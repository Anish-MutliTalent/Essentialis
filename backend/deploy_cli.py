#!/usr/bin/env python3
"""
deploy_cli.py — Terminal deployment script for Essentialis Dev.

Usage:
  python deploy_cli.py --source ../contracts/ActionLogger.sol --network local
  python deploy_cli.py --source ../contracts/ActionLogger.sol --network local --dry-run
  python deploy_cli.py --source ../contracts/ActionLogger.sol --network local --estimate-gas
  python deploy_cli.py --source ../contracts/ActionLogger.sol --network local --print-abi-only
  python deploy_cli.py --source ../contracts/ActionLogger.sol --network local --test-call --test-function "logAction" --test-args '["test","hello"]'
  python deploy_cli.py --source ../contracts/ActionLogger.sol --network live --rpc-url $RPC_URL --private-key $KEY
"""

import argparse
import json
import os
import sys
from pathlib import Path

# Force UTF-8 output on Windows (avoids UnicodeEncodeError with emoji)
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Add parent so we can import app.deploy.*
sys.path.insert(0, str(Path(__file__).resolve().parent))

from dotenv import load_dotenv

load_dotenv()

from app.deploy.services.compiler import compile_file, CompilationError
from app.deploy.services.deployer import (
    deploy_to_local,
    deploy_to_network,
    estimate_gas,
    DeploymentError,
)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Essentialis Dev — Solidity Compile & Deploy CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--source", "-s",
        required=True,
        help="Path to .sol file",
    )
    parser.add_argument(
        "--network", "-n",
        choices=["local", "live"],
        default="local",
        help="Target: 'local' (ephemeral dev chain) or 'live' (real RPC)",
    )
    parser.add_argument(
        "--rpc-url",
        default=os.getenv("RPC_URL"),
        help="RPC endpoint for live network (default: $RPC_URL from .env)",
    )
    parser.add_argument(
        "--private-key",
        default=os.getenv("PLATFORM_OPERATIONAL_WALLET_PRIVATE_KEY"),
        help="Deployer private key for live network (default: from .env)",
    )
    parser.add_argument(
        "--solc-version",
        default="0.8.24",
        help="Solidity compiler version (default: 0.8.24)",
    )
    parser.add_argument(
        "--contract-name",
        default=None,
        help="Contract to deploy if file contains multiple contracts",
    )
    parser.add_argument(
        "--constructor-args",
        default="[]",
        help="JSON array of constructor arguments (default: [])",
    )

    # --- Mode flags ---
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Compile + build tx, but don't send. Shows estimated gas.",
    )
    parser.add_argument(
        "--estimate-gas",
        action="store_true",
        help="Only compile and estimate deployment gas.",
    )
    parser.add_argument(
        "--print-abi-only",
        action="store_true",
        help="Only compile and print the ABI (no deployment).",
    )
    parser.add_argument(
        "--test-call",
        action="store_true",
        help="Deploy, then call a function on the deployed contract.",
    )
    parser.add_argument(
        "--test-function",
        default=None,
        help="Function name for --test-call (auto-detected if omitted).",
    )
    parser.add_argument(
        "--test-args",
        default="[]",
        help="JSON array of args for --test-call (default: []).",
    )

    args = parser.parse_args()

    sol_path = Path(args.source).resolve()
    if not sol_path.exists():
        print(f"❌ File not found: {sol_path}", file=sys.stderr)
        sys.exit(1)

    constructor_args = json.loads(args.constructor_args)

    print(f"⛓️  Essentialis Dev — Deployment Engine")
    print(f"   Source:  {sol_path.name}")
    print(f"   Network: {args.network}")
    print(f"   Solc:    {args.solc_version}")
    print()

    # --- Print ABI only -----------------------------------------------------
    if args.print_abi_only:
        try:
            compiled = compile_file(sol_path, solc_version=args.solc_version)
            name = args.contract_name or next(iter(compiled))
            if name not in compiled:
                print(f"❌ Contract '{name}' not found. Available: {', '.join(compiled.keys())}")
                sys.exit(1)
            print(f"📋 ABI for {name}:")
            print(json.dumps(compiled[name]["abi"], indent=2))
            return
        except CompilationError as e:
            print(f"❌ Compilation failed:\n{e}", file=sys.stderr)
            sys.exit(1)

    # --- Estimate gas only --------------------------------------------------
    if args.estimate_gas:
        try:
            result = estimate_gas(
                sol_path,
                contract_name=args.contract_name,
                constructor_args=constructor_args,
                solc_version=args.solc_version,
            )
            print(f"⛽ Gas Estimate for {result['contract_name']}:")
            print(f"   Estimated:    {result['estimated_gas']:,}")
            print(f"   With buffer:  {result['gas_with_buffer']:,}  (1.2×)")
            return
        except (CompilationError, DeploymentError) as e:
            print(f"❌ {e}", file=sys.stderr)
            sys.exit(1)

    # --- Deploy (local or live) ---------------------------------------------
    try:
        if args.network == "local":
            result = deploy_to_local(
                sol_path,
                contract_name=args.contract_name,
                constructor_args=constructor_args,
                solc_version=args.solc_version,
                dry_run=args.dry_run,
            )
        else:
            if not args.rpc_url:
                print("❌ --rpc-url required for live network (or set RPC_URL in .env)", file=sys.stderr)
                sys.exit(1)
            if not args.private_key:
                print("❌ --private-key required for live network (or set PLATFORM_OPERATIONAL_WALLET_PRIVATE_KEY in .env)", file=sys.stderr)
                sys.exit(1)

            result = deploy_to_network(
                sol_path,
                rpc_url=args.rpc_url,
                private_key=args.private_key,
                contract_name=args.contract_name,
                constructor_args=constructor_args,
                solc_version=args.solc_version,
                dry_run=args.dry_run,
            )

        # --- Output ---------------------------------------------------------
        tag = " [DRY RUN]" if result.is_dry_run else ""
        print(f"{'🧪' if result.is_dry_run else '✅'} Deployment{tag} {'simulated' if result.is_dry_run else 'complete'}!")
        print(f"   Contract:  {result.contract_name}")
        print(f"   Address:   {result.address}")
        print(f"   Tx Hash:   {result.tx_hash}")
        print(f"   Block:     {result.block_number}")
        print(f"   Gas Used:  {result.gas_used:,}")
        print()

        # --- Test call (optional) -------------------------------------------
        if args.test_call and not result.is_dry_run:
            _do_test_call(result, args)

    except (CompilationError, DeploymentError) as e:
        print(f"❌ {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {type(e).__name__}: {e}", file=sys.stderr)
        sys.exit(1)


def _do_test_call(result, args):
    """Call a function on the deployed contract to verify it works."""
    from app.deploy.services.chain import get_local_w3
    from web3 import Web3

    if args.network == "local":
        w3 = get_local_w3()
    else:
        w3 = Web3(Web3.HTTPProvider(args.rpc_url))

    contract = w3.eth.contract(
        address=result.address,
        abi=result.abi,
    )

    # Pick function: explicit, or auto-detect first non-view public function
    fn_name = args.test_function
    if not fn_name:
        fn_name = _auto_detect_function(result.abi)
        if not fn_name:
            print("⚠️  No suitable function found for test call. Use --test-function <name>")
            return

    fn_args = json.loads(args.test_args)

    print(f"🔧 Test call: {fn_name}({', '.join(repr(a) for a in fn_args)})")

    try:
        fn = contract.functions[fn_name](*fn_args)

        # Check if it's a view/pure function
        fn_abi = next((f for f in result.abi if f.get("name") == fn_name), None)
        is_view = fn_abi and fn_abi.get("stateMutability") in ("view", "pure")

        if is_view:
            ret = fn.call()
            print(f"   ✅ Return value: {ret}")
        else:
            # Send a transaction
            sender = w3.eth.accounts[0] if args.network == "local" else None
            if sender:
                tx_hash = fn.transact({"from": sender})
                receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
                print(f"   ✅ Tx succeeded. Gas used: {receipt['gasUsed']:,}")

                # Check for events
                if receipt["logs"]:
                    print(f"   📡 {len(receipt['logs'])} event(s) emitted")
                    for log in receipt["logs"]:
                        # Try to decode with contract ABI
                        try:
                            decoded = contract.events[fn_name].process_log(log)
                            print(f"      → {decoded}")
                        except Exception:
                            print(f"      → Raw log: {log['data'][:66]}...")
            else:
                print("   ⚠️  Live test-call requires signing (not implemented in CLI yet)")

    except Exception as e:
        print(f"   ❌ Test call failed: {e}")


def _auto_detect_function(abi: list) -> str | None:
    """Find the first non-constructor, non-view public function."""
    for item in abi:
        if item.get("type") != "function":
            continue
        if item.get("stateMutability") in ("view", "pure"):
            continue
        return item["name"]
    # If all are view/pure, pick the first function
    for item in abi:
        if item.get("type") == "function":
            return item["name"]
    return None


if __name__ == "__main__":
    main()
