"""
routes.py — Thin Flask blueprint for the deployment engine.

All heavy logic lives in services/.  Routes only handle:
  - Request validation
  - Auth check
  - Calling the right service function
  - Formatting the response

Rate limiting: basic per-user tracking via in-memory dict.
Production should use Redis-based rate limiting.
"""

import time
import json
from functools import wraps
from typing import Dict, Tuple

from flask import Blueprint, request, jsonify, session

from .services.compiler import compile_sources, compile_file, CompilationError
from .services.deployer import (
    deploy_to_local,
    deploy_to_network,
    estimate_gas,
    DeploymentError,
)


deploy_bp = Blueprint("deploy", __name__)


# ---------------------------------------------------------------------------
# Auth decorator (reuse pattern from main routes)
# ---------------------------------------------------------------------------

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Not authenticated"}), 401
        return f(*args, **kwargs)
    return decorated


# ---------------------------------------------------------------------------
# Rate limiting — simple in-memory tracker
# ---------------------------------------------------------------------------

_rate_store: Dict[str, list] = {}  # user_id -> [timestamp, ...]
RATE_WINDOW = 60       # seconds
RATE_MAX_COMPILE = 30  # max compilations per window
RATE_MAX_DEPLOY = 10   # max deployments per window


def _rate_check(action: str, limit: int) -> Tuple[bool, str]:
    """Return (allowed, message). Side effect: records the timestamp."""
    user_id = str(session.get("user_id", "anon"))
    key = f"{user_id}:{action}"
    now = time.time()
    timestamps = _rate_store.get(key, [])
    # Purge old entries
    timestamps = [t for t in timestamps if now - t < RATE_WINDOW]
    if len(timestamps) >= limit:
        return False, f"Rate limit: max {limit} {action} requests per {RATE_WINDOW}s"
    timestamps.append(now)
    _rate_store[key] = timestamps
    return True, ""


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@deploy_bp.route("/compile", methods=["POST"])
@login_required
def compile_endpoint():
    """
    Compile Solidity source(s).

    Body (JSON):
        sources: { "FileName.sol": "<source>" }   — multi-file
        OR
        source: "<source>"                        — single-file shorthand
        solc_version: "0.8.24" (optional)

    Returns:
        { contracts: { "Name": { abi, bytecode } } }
    """
    allowed, msg = _rate_check("compile", RATE_MAX_COMPILE)
    if not allowed:
        return jsonify({"error": msg}), 429

    data = request.get_json(silent=True) or {}

    solc_version = data.get("solc_version", "0.8.24")

    # Accept multi-file or single-file input
    sources = data.get("sources")
    if not sources:
        single = data.get("source")
        if not single:
            return jsonify({"error": "Provide 'sources' dict or 'source' string"}), 400
        sources = {"Contract.sol": single}

    try:
        result = compile_sources(sources, solc_version=solc_version)
        return jsonify({"contracts": result}), 200
    except CompilationError as e:
        return jsonify({"error": f"Compilation failed:\n{e}"}), 422
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {e}"}), 500


@deploy_bp.route("/local", methods=["POST"])
@login_required
def deploy_local_endpoint():
    """
    Compile + deploy to ephemeral dev chain.

    Body (JSON):
        source: "<solidity source>"
        OR sources: { ... }
        contract_name: "MyContract" (optional, if multiple contracts)
        constructor_args: [...] (optional)
        solc_version: "0.8.24" (optional)
        dry_run: false (optional)

    Returns:
        { address, tx_hash, block_number, contract_name, gas_used, abi }
    """
    allowed, msg = _rate_check("deploy", RATE_MAX_DEPLOY)
    if not allowed:
        return jsonify({"error": msg}), 429

    data = request.get_json(silent=True) or {}

    source = data.get("source", "")
    sources = data.get("sources")
    contract_name = data.get("contract_name")
    constructor_args = data.get("constructor_args", [])
    solc_version = data.get("solc_version", "0.8.24")
    dry_run = data.get("dry_run", False)

    if not source and not sources:
        return jsonify({"error": "Provide 'source' or 'sources'"}), 400

    # For the deploy_to_local convenience function, we pass raw source
    sol_input = source if source else json.dumps(sources)

    try:
        # If multi-file, compile first then deploy manually
        if sources:
            from .services.deployer import deploy_contract, _pick_contract
            from .services.chain import get_local_w3, get_dev_private_key

            compiled = compile_sources(sources, solc_version=solc_version)
            name, artifact = _pick_contract(compiled, contract_name)
            w3 = get_local_w3()
            key = get_dev_private_key(w3, index=0)
            result = deploy_contract(
                w3=w3,
                abi=artifact["abi"],
                bytecode=artifact["bytecode"],
                deployer_private_key=key,
                constructor_args=constructor_args,
                dry_run=dry_run,
                contract_name=name,
            )
        else:
            result = deploy_to_local(
                source,
                contract_name=contract_name,
                constructor_args=constructor_args,
                solc_version=solc_version,
                dry_run=dry_run,
            )

        return jsonify(result.to_dict()), 200

    except (CompilationError, DeploymentError) as e:
        return jsonify({"error": str(e)}), 422
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {e}"}), 500


@deploy_bp.route("/network", methods=["POST"])
@login_required
def deploy_network_endpoint():
    """
    Compile + deploy to a real network.

    Body (JSON):
        source: "<solidity source>"
        rpc_url: "https://..." (optional, defaults to app config RPC_URL)
        private_key: "0x..." (optional, defaults to platform key)
        contract_name: "MyContract" (optional)
        constructor_args: [...] (optional)
        solc_version: "0.8.24" (optional)
        dry_run: false (optional)

    Returns:
        { address, tx_hash, block_number, contract_name, gas_used, abi }
    """
    allowed, msg = _rate_check("deploy", RATE_MAX_DEPLOY)
    if not allowed:
        return jsonify({"error": msg}), 429

    data = request.get_json(silent=True) or {}

    source = data.get("source", "")
    if not source:
        return jsonify({"error": "Provide 'source'"}), 400

    # RPC and key: prefer request body, fall back to env
    from flask import current_app
    import os

    rpc_url = data.get("rpc_url") or current_app.config.get("RPC_URL")
    private_key = data.get("private_key") or os.getenv(
        "PLATFORM_OPERATIONAL_WALLET_PRIVATE_KEY"
    )

    if not rpc_url:
        return jsonify({"error": "No RPC URL configured"}), 400
    if not private_key:
        return jsonify({"error": "No deployer private key available"}), 400

    contract_name = data.get("contract_name")
    constructor_args = data.get("constructor_args", [])
    solc_version = data.get("solc_version", "0.8.24")
    dry_run = data.get("dry_run", False)

    try:
        result = deploy_to_network(
            source,
            rpc_url=rpc_url,
            private_key=private_key,
            contract_name=contract_name,
            constructor_args=constructor_args,
            solc_version=solc_version,
            dry_run=dry_run,
        )
        return jsonify(result.to_dict()), 200

    except (CompilationError, DeploymentError) as e:
        return jsonify({"error": str(e)}), 422
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {e}"}), 500
