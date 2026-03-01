"""
compiler.py — Solidity compilation via py-solc-x with caching.

Supports:
  - Single file or multi-file (sources dict) compilation
  - OpenZeppelin import remapping
  - SHA-256 based output caching to avoid redundant solc invocations
"""

import json
import hashlib
import os
from pathlib import Path
from typing import Dict, List, Optional, Union

import solcx


# ---------------------------------------------------------------------------
# Cache directory — sits next to the backend app
# ---------------------------------------------------------------------------
_CACHE_DIR = Path(__file__).resolve().parents[2] / "compiled_cache"
_CACHE_DIR.mkdir(exist_ok=True)

# Base contracts directory (for resolving file paths)
_CONTRACTS_DIR = Path(__file__).resolve().parents[3] / "contracts"


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------

def ensure_solc(version: str = "0.8.24") -> str:
    """Install solc if missing, return the installed version string."""
    installed = [str(v) for v in solcx.get_installed_solc_versions()]
    if version not in installed:
        solcx.install_solc(version)
    return version


def compile_sources(
    sources: Dict[str, str],
    *,
    solc_version: str = "0.8.24",
    base_path: Optional[str] = None,
    remappings: Optional[List[str]] = None,
    no_cache: bool = False,
) -> Dict[str, dict]:
    """
    Compile one or more Solidity sources.

    Args:
        sources:  ``{ "FileName.sol": "<solidity source code>", ... }``
        solc_version: Compiler version (auto-installed if missing).
        base_path: Root for relative import resolution.
        remappings: Import remappings, e.g.
                    ``["@openzeppelin/=node_modules/@openzeppelin/"]``
        no_cache: Force recompilation even if cached.

    Returns:
        ``{ "ContractName": { "abi": [...], "bytecode": "0x..." }, ... }``
    """
    version = ensure_solc(solc_version)

    # --- Cache key ----------------------------------------------------------
    canon = json.dumps(sources, sort_keys=True)
    cache_key = hashlib.sha256(
        f"{canon}|{version}|{remappings}".encode()
    ).hexdigest()
    cache_file = _CACHE_DIR / f"{cache_key}.json"

    if not no_cache and cache_file.exists():
        return json.loads(cache_file.read_text())

    # --- Build solc JSON-input ----------------------------------------------
    input_json: dict = {
        "language": "Solidity",
        "sources": {
            name: {"content": src} for name, src in sources.items()
        },
        "settings": {
            "outputSelection": {
                "*": {
                    "*": ["abi", "evm.bytecode.object"]
                }
            },
        },
    }

    if remappings:
        input_json["settings"]["remappings"] = remappings

    solcx.set_solc_version(version)

    # Determine allow_paths for imports
    compile_kwargs: dict = {}
    if base_path:
        compile_kwargs["base_path"] = base_path
        compile_kwargs["allow_paths"] = [base_path]

    output = solcx.compile_standard(input_json, **compile_kwargs)

    # --- Check for errors ---------------------------------------------------
    errors = output.get("errors", [])
    fatals = [e for e in errors if e.get("severity") == "error"]
    if fatals:
        msgs = "\n".join(e.get("formattedMessage", e["message"]) for e in fatals)
        raise CompilationError(msgs)

    # --- Extract ABI + bytecode per contract --------------------------------
    result: Dict[str, dict] = {}
    for source_name, file_output in output.get("contracts", {}).items():
        for contract_name, contract_data in file_output.items():
            result[contract_name] = {
                "abi": contract_data["abi"],
                "bytecode": "0x" + contract_data["evm"]["bytecode"]["object"],
                "source_file": source_name,
            }

    # --- Write cache --------------------------------------------------------
    cache_file.write_text(json.dumps(result, indent=2))

    return result


def compile_file(
    sol_path: Union[str, Path],
    *,
    solc_version: str = "0.8.24",
    remappings: Optional[List[str]] = None,
    no_cache: bool = False,
) -> Dict[str, dict]:
    """
    Convenience: compile a single ``.sol`` file from disk.

    Import remappings for @openzeppelin are auto-detected if a
    ``node_modules/@openzeppelin`` directory exists nearby.
    """
    sol_path = Path(sol_path).resolve()
    if not sol_path.exists():
        raise FileNotFoundError(f"Solidity file not found: {sol_path}")

    source_text = sol_path.read_text(encoding="utf-8")
    sources = {sol_path.name: source_text}

    # Auto-detect OpenZeppelin remappings
    if remappings is None:
        remappings = _auto_remappings(sol_path)

    return compile_sources(
        sources,
        solc_version=solc_version,
        base_path=str(sol_path.parent),
        remappings=remappings,
        no_cache=no_cache,
    )


# ---------------------------------------------------------------------------
# Internal
# ---------------------------------------------------------------------------

def _auto_remappings(sol_path: Path) -> List[str]:
    """Walk up from sol_path looking for node_modules/@openzeppelin."""
    remaps = []
    search = sol_path.parent
    for _ in range(5):  # max 5 levels up
        oz_dir = search / "node_modules" / "@openzeppelin"
        if oz_dir.is_dir():
            remaps.append(
                f"@openzeppelin/={str(oz_dir)}/"
            )
            break
        parent = search.parent
        if parent == search:
            break
        search = parent
    return remaps


class CompilationError(Exception):
    """Raised when solc reports fatal errors."""
    pass
