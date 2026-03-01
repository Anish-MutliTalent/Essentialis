"""
deployer.py — Contract deployment engine.

Handles:
  - Gas estimation with safety multiplier
  - Explicit chainId / nonce / gas pricing (never relies on defaults)
  - Dry-run mode (build tx without sending)
  - Clear error wrapping
  - Private key is NEVER logged or persisted

Wallet strategy:
  Phase 1 uses raw private keys (from .env or user-supplied).
  Future phases will integrate MetaMask signature delegation.
"""

import json
from typing import Any, Dict, List, Optional, Union
from pathlib import Path

from web3 import Web3
from web3.types import TxReceipt
from eth_account import Account

from .compiler import compile_sources, compile_file, CompilationError
from .chain import get_local_w3, get_dev_account, deploy_contract_local


# ---------------------------------------------------------------------------
# Core deployment
# ---------------------------------------------------------------------------

class DeploymentError(Exception):
    """Raised when deployment fails at any stage."""
    pass


class DeployResult:
    """Structured result from a contract deployment."""

    def __init__(
        self,
        address: str,
        tx_hash: str,
        block_number: int,
        abi: list,
        bytecode: str,
        contract_name: str,
        gas_used: int,
        is_dry_run: bool = False,
    ):
        self.address = address
        self.tx_hash = tx_hash
        self.block_number = block_number
        self.abi = abi
        self.bytecode = bytecode
        self.contract_name = contract_name
        self.gas_used = gas_used
        self.is_dry_run = is_dry_run

    def to_dict(self) -> dict:
        return {
            "address": self.address,
            "tx_hash": self.tx_hash,
            "block_number": self.block_number,
            "contract_name": self.contract_name,
            "gas_used": self.gas_used,
            "abi": self.abi,
            "is_dry_run": self.is_dry_run,
        }

    def __repr__(self):
        tag = " [DRY RUN]" if self.is_dry_run else ""
        return (
            f"DeployResult({self.contract_name} @ {self.address}"
            f" | tx={self.tx_hash[:18]}..."
            f" | gas={self.gas_used}{tag})"
        )


GAS_MULTIPLIER = 1.2  # Safety margin on estimated gas


def deploy_contract(
    w3: Web3,
    abi: list,
    bytecode: str,
    deployer_private_key: str,
    constructor_args: Optional[List[Any]] = None,
    chain_id: Optional[int] = None,
    gas_multiplier: float = GAS_MULTIPLIER,
    dry_run: bool = False,
    contract_name: str = "Unknown",
) -> DeployResult:
    """
    Deploy a single compiled contract.

    Args:
        w3: Web3 instance (local or live).
        abi: Contract ABI.
        bytecode: Contract bytecode (hex with 0x prefix).
        deployer_private_key: Hex-encoded private key. **Never logged.**
        constructor_args: Arguments to pass to constructor.
        chain_id: Explicit chain ID. Auto-detected if None.
        gas_multiplier: Safety factor on estimated gas (default 1.2×).
        dry_run: If True, build the tx but don't send it.
        contract_name: Human label for logging.

    Returns:
        DeployResult with address, tx_hash, etc.

    Raises:
        DeploymentError on failure.
    """
    if constructor_args is None:
        constructor_args = []

    try:
        account = Account.from_key(deployer_private_key)
    except Exception as e:
        raise DeploymentError(f"Invalid private key format: {type(e).__name__}")

    try:
        contract = w3.eth.contract(abi=abi, bytecode=bytecode)
        constructor = contract.constructor(*constructor_args)

        # --- Determine chain ID ------------------------------------------------
        if chain_id is None:
            try:
                chain_id = w3.eth.chain_id
            except Exception:
                chain_id = 1  # fallback

        # --- Estimate gas ------------------------------------------------------
        DEFAULT_LOCAL_GAS = 3_000_000  # generous fallback for local chains
        try:
            estimated_gas = constructor.estimate_gas({
                "from": account.address,
            })
        except Exception:
            # MockBackend in eth-tester may have incompatible estimate_gas.
            # Use a generous default for local chains; raise on live networks.
            try:
                is_local = hasattr(w3.provider, "ethereum_tester")
            except Exception:
                is_local = False
            if is_local:
                estimated_gas = DEFAULT_LOCAL_GAS
            else:
                raise DeploymentError("Gas estimation failed on live network")

        gas_limit = int(estimated_gas * gas_multiplier)

        # --- Build transaction -------------------------------------------------
        nonce = w3.eth.get_transaction_count(account.address)

        # Try EIP-1559 first, fall back to legacy gasPrice
        try:
            base_fee = w3.eth.get_block("latest").get("baseFeePerGas")
        except Exception:
            base_fee = None

        if base_fee is not None:
            # EIP-1559 transaction
            tx = constructor.build_transaction({
                "from": account.address,
                "nonce": nonce,
                "gas": gas_limit,
                "chainId": chain_id,
                "maxFeePerGas": base_fee * 2,
                "maxPriorityFeePerGas": w3.to_wei(1, "gwei"),
            })
        else:
            # Legacy transaction
            tx = constructor.build_transaction({
                "from": account.address,
                "nonce": nonce,
                "gas": gas_limit,
                "chainId": chain_id,
                "gasPrice": w3.eth.gas_price,
            })

        # --- Dry run: return without sending -----------------------------------
        if dry_run:
            return DeployResult(
                address="0x" + "0" * 40,
                tx_hash="0x" + "0" * 64,
                block_number=0,
                abi=abi,
                bytecode=bytecode,
                contract_name=contract_name,
                gas_used=estimated_gas,
                is_dry_run=True,
            )

        # --- Sign & send -------------------------------------------------------
        signed_tx = w3.eth.account.sign_transaction(tx, deployer_private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        receipt: TxReceipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

        if receipt["status"] != 1:
            raise DeploymentError(
                f"Transaction reverted. tx_hash={tx_hash.hex()}"
            )

        return DeployResult(
            address=receipt["contractAddress"],
            tx_hash=tx_hash.hex(),
            block_number=receipt["blockNumber"],
            abi=abi,
            bytecode=bytecode,
            contract_name=contract_name,
            gas_used=receipt["gasUsed"],
        )

    except DeploymentError:
        raise
    except Exception as e:
        raise DeploymentError(f"Deployment failed: {type(e).__name__}: {e}")


# ---------------------------------------------------------------------------
# Convenience: compile + deploy in one call
# ---------------------------------------------------------------------------

def deploy_to_local(
    sol_source_or_path: Union[str, Path],
    *,
    contract_name: Optional[str] = None,
    constructor_args: Optional[List[Any]] = None,
    solc_version: str = "0.8.24",
    dry_run: bool = False,
) -> DeployResult:
    """
    Compile + deploy to the ephemeral dev chain in one call.

    Uses native transact() via chain.py — avoids MockBackend.estimate_gas()
    incompatibility.  For real-network deployment, use deploy_to_network().

    Args:
        sol_source_or_path: Path to a .sol file **or** raw Solidity source.
        contract_name: If multiple contracts in the file, specify which one
                       to deploy.  Defaults to the first one found.
        constructor_args: Constructor arguments.
        solc_version: Compiler version.
        dry_run: Build tx without sending.

    Returns:
        DeployResult.
    """
    compiled = _compile_input(sol_source_or_path, solc_version=solc_version)
    name, artifact = _pick_contract(compiled, contract_name)

    if dry_run:
        return DeployResult(
            address="0x" + "0" * 40,
            tx_hash="0x" + "0" * 64,
            block_number=0,
            abi=artifact["abi"],
            bytecode=artifact["bytecode"],
            contract_name=name,
            gas_used=0,
            is_dry_run=True,
        )

    w3 = get_local_w3()
    try:
        address, tx_hash, receipt = deploy_contract_local(
            w3,
            abi=artifact["abi"],
            bytecode=artifact["bytecode"],
            constructor_args=constructor_args,
        )
    except Exception as e:
        raise DeploymentError(f"Local deployment failed: {e}")

    return DeployResult(
        address=address,
        tx_hash=tx_hash,
        block_number=receipt["blockNumber"],
        abi=artifact["abi"],
        bytecode=artifact["bytecode"],
        contract_name=name,
        gas_used=receipt["gasUsed"],
    )


def deploy_to_network(
    sol_source_or_path: Union[str, Path],
    rpc_url: str,
    private_key: str,
    *,
    contract_name: Optional[str] = None,
    constructor_args: Optional[List[Any]] = None,
    solc_version: str = "0.8.24",
    dry_run: bool = False,
) -> DeployResult:
    """
    Compile + deploy to any live network.

    Args:
        sol_source_or_path: Path to a .sol file or raw Solidity source.
        rpc_url: HTTP RPC endpoint.
        private_key: Deployer private key. **Never logged.**
        contract_name: Which contract to deploy if multiple in file.
        constructor_args: Constructor arguments.
        solc_version: Compiler version.
        dry_run: Build tx without sending.

    Returns:
        DeployResult.
    """
    compiled = _compile_input(sol_source_or_path, solc_version=solc_version)
    name, artifact = _pick_contract(compiled, contract_name)

    w3 = Web3(Web3.HTTPProvider(rpc_url))
    if not w3.is_connected():
        raise DeploymentError(f"Cannot connect to RPC: {rpc_url}")

    return deploy_contract(
        w3=w3,
        abi=artifact["abi"],
        bytecode=artifact["bytecode"],
        deployer_private_key=private_key,
        constructor_args=constructor_args,
        dry_run=dry_run,
        contract_name=name,
    )


def estimate_gas(
    sol_source_or_path: Union[str, Path],
    *,
    contract_name: Optional[str] = None,
    constructor_args: Optional[List[Any]] = None,
    solc_version: str = "0.8.24",
) -> Dict[str, Any]:
    """
    Compile and estimate deployment gas.

    On the local chain (MockBackend), does a trial deploy and reads
    gas from the receipt.  On live networks, uses estimate_gas().

    Returns dict with estimated gas and contract metadata.
    """
    compiled = _compile_input(sol_source_or_path, solc_version=solc_version)
    name, artifact = _pick_contract(compiled, contract_name)

    # Deploy on local chain to measure actual gas
    from .chain import reset_chain
    reset_chain()  # fresh chain for estimation
    w3 = get_local_w3()

    try:
        _, _, receipt = deploy_contract_local(
            w3,
            abi=artifact["abi"],
            bytecode=artifact["bytecode"],
            constructor_args=constructor_args,
        )
        actual_gas = receipt["gasUsed"]
    except Exception as e:
        raise DeploymentError(f"Gas estimation via trial deploy failed: {e}")
    finally:
        reset_chain()  # clean up after estimation

    return {
        "contract_name": name,
        "estimated_gas": actual_gas,
        "gas_with_buffer": int(actual_gas * GAS_MULTIPLIER),
    }


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _compile_input(
    sol_source_or_path: Union[str, Path],
    solc_version: str = "0.8.24",
) -> Dict[str, dict]:
    """Determine if input is a file path or raw source, then compile."""
    path = Path(sol_source_or_path)
    if path.suffix == ".sol" and path.exists():
        return compile_file(path, solc_version=solc_version)
    else:
        # Treat as raw source
        sources = {"Contract.sol": str(sol_source_or_path)}
        return compile_sources(sources, solc_version=solc_version)


def _pick_contract(
    compiled: Dict[str, dict],
    contract_name: Optional[str] = None,
) -> tuple:
    """Pick which contract to deploy from compilation output."""
    if not compiled:
        raise DeploymentError("Compilation produced no contracts")

    if contract_name:
        if contract_name not in compiled:
            available = ", ".join(compiled.keys())
            raise DeploymentError(
                f"Contract '{contract_name}' not found. Available: {available}"
            )
        return contract_name, compiled[contract_name]

    # Default: first contract
    name = next(iter(compiled))
    return name, compiled[name]
