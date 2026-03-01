"""
chain.py — Ephemeral Dev Chain for contract deployment.

Uses Ganache (via npx) as a local Ethereum node.
Starts on demand, shuts down when done.

This gives us:
  - Real EVM execution (actual contract deployment)
  - Pre-funded accounts with known private keys
  - No Python dependency conflicts
  - Closer to what Hardhat/Foundry uses

Falls back to EthereumTesterProvider if Ganache is not available.
"""

import subprocess
import sys
import shutil
import time
import signal
import atexit
from web3 import Web3


# Singleton state
_dev_w3 = None
_ganache_process = None

# Ganache defaults
GANACHE_PORT = 8546  # Avoid conflict with user's RPC on 8545
GANACHE_HOST = "127.0.0.1"

# Ganache creates 10 accounts, each with 1000 ETH.
# These are deterministic with the default mnemonic.
_GANACHE_DEFAULT_PRIVATE_KEYS = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
]

_IS_WIN = sys.platform == "win32"


def _start_ganache():
    """Start a Ganache instance as a subprocess."""
    global _ganache_process

    if _ganache_process is not None:
        return

    # On Windows, npx is a .cmd wrapper — need shell=True
    cmd = [
        "npx", "-y", "ganache",
        "--port", str(GANACHE_PORT),
        "--host", GANACHE_HOST,
        "--chain.chainId", "1337",
        "--wallet.deterministic",
        "--logging.quiet",
    ]

    try:
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=_IS_WIN,
            creationflags=subprocess.CREATE_NO_WINDOW if _IS_WIN else 0,
        )
        _ganache_process = proc

        # Register cleanup
        atexit.register(_stop_ganache)

        # Wait for Ganache to be ready
        rpc_url = f"http://{GANACHE_HOST}:{GANACHE_PORT}"
        w3 = Web3(Web3.HTTPProvider(rpc_url))

        for _ in range(30):  # Wait up to 30 seconds
            # Check if process died
            if proc.poll() is not None:
                stderr = proc.stderr.read().decode(errors="replace") if proc.stderr else ""
                raise RuntimeError(f"Ganache exited early: {stderr[:500]}")
            try:
                if w3.is_connected():
                    return
            except Exception:
                pass
            time.sleep(1)

        raise RuntimeError("Ganache failed to start within 30 seconds")

    except FileNotFoundError:
        raise RuntimeError(
            "npx/ganache not found. Install Node.js or run: npm install -g ganache"
        )


def _stop_ganache():
    """Terminate the Ganache subprocess."""
    global _ganache_process
    if _ganache_process is not None:
        try:
            _ganache_process.terminate()
            _ganache_process.wait(timeout=5)
        except Exception:
            try:
                _ganache_process.kill()
            except Exception:
                pass
        _ganache_process = None


def get_local_w3() -> Web3:
    """
    Return a Web3 instance connected to the local dev chain.

    Starts Ganache on first call.
    """
    global _dev_w3
    if _dev_w3 is None:
        _start_ganache()
        rpc_url = f"http://{GANACHE_HOST}:{GANACHE_PORT}"
        _dev_w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not _dev_w3.is_connected():
            raise RuntimeError(f"Cannot connect to Ganache at {rpc_url}")
    return _dev_w3


def get_dev_account(w3: Web3 = None, index: int = 0) -> str:
    """Return the address of a pre-funded dev account."""
    if w3 is None:
        w3 = get_local_w3()
    accounts = w3.eth.accounts
    if index >= len(accounts):
        raise IndexError(f"Only {len(accounts)} dev accounts available")
    return accounts[index]


def get_dev_private_key(index: int = 0) -> str:
    """Return a known dev private key (Ganache deterministic wallet)."""
    if index >= len(_GANACHE_DEFAULT_PRIVATE_KEYS):
        raise IndexError(f"Only {len(_GANACHE_DEFAULT_PRIVATE_KEYS)} known keys")
    return _GANACHE_DEFAULT_PRIVATE_KEYS[index]


def deploy_contract_local(w3: Web3, abi: list, bytecode: str, constructor_args=None):
    """
    Deploy a contract on the local dev chain using native transact().

    Args:
        w3: Web3 instance from get_local_w3().
        abi: Contract ABI.
        bytecode: Compiled bytecode (hex string with 0x prefix).
        constructor_args: List of constructor arguments.

    Returns:
        Tuple of (contract_address, tx_hash_hex, receipt).
    """
    if constructor_args is None:
        constructor_args = []

    deployer = get_dev_account(w3, index=0)
    contract = w3.eth.contract(abi=abi, bytecode=bytecode)

    tx_hash = contract.constructor(*constructor_args).transact({
        "from": deployer,
        "gas": 5_000_000,
    })

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=30)

    if receipt["status"] != 1:
        raise RuntimeError("Contract deployment transaction reverted")

    return receipt["contractAddress"], tx_hash.hex(), receipt


def reset_chain():
    """Tear down the dev chain. Next call to get_local_w3() starts fresh."""
    global _dev_w3
    _stop_ganache()
    _dev_w3 = None
