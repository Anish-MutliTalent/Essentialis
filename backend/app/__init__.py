from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config
import json
from web3 import Web3
import logging  # Add this at the top
from pathlib import Path

db = SQLAlchemy()

# Placeholder for Web3 connection
w3 = None
nft_land_contract = None
action_logger_contract = None
nft_marketplace_contract = None


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

    CORS(app, supports_credentials=True)

    # Configure Flask logger if not already done elsewhere
    if not app.debug:  # Example: Log more in production
        app.logger.setLevel(logging.INFO)
    else:
        app.logger.setLevel(logging.DEBUG)

    db.init_app(app)

    global w3, nft_land_contract, action_logger_contract, nft_marketplace_contract

    if not app.config['POLYGON_RPC_URL']:
        raise ValueError("POLYGON_RPC_URL not set in .env or config")

    w3 = Web3(Web3.HTTPProvider(app.config['POLYGON_RPC_URL']))
    if not w3.is_connected():
        raise ConnectionError("Failed to connect to Polygon RPC")

    # Load and parse NFT contract ABI
    cfg_path = app.config.get('NFT_LAND_CONTRACT_ABI_PATH')
    if not cfg_path:
        raise ValueError("NFT_LAND_CONTRACT_ABI_PATH not configured")

    abi_path = Path(cfg_path) if Path(cfg_path).is_absolute() else Path(__file__).parent / 'abi' / cfg_path
    contract_abi_text = abi_path.read_text()
    try:
        contract_abi = json.loads(contract_abi_text)
    except Exception as e:
        raise ValueError(f"Failed to parse NFT contract ABI at {abi_path}: {e}")

    # Set the contract address (replace with your contract's deployed address)
    contract_address = app.config.get('NFT_LAND_CONTRACT_ADDRESS')
    # Check that contract code exists at address
    if not w3.eth.get_code(Web3.to_checksum_address(contract_address)):
        raise ConnectionError(f"No contract code found at NFT_LAND_CONTRACT_ADDRESS {contract_address} on RPC")

    nft_land_contract = w3.eth.contract(address=Web3.to_checksum_address(contract_address), abi=contract_abi)

    # Load and parse ActionLogger ABI
    cfg_path = app.config.get('ACTION_LOGGER_CONTRACT_ABI_PATH')
    if not cfg_path:
        raise ValueError("ACTION_LOGGER_CONTRACT_ABI_PATH not configured")
    abi_path = Path(cfg_path) if Path(cfg_path).is_absolute() else Path(__file__).parent / 'abi' / cfg_path
    action_logger_abi_text = abi_path.read_text()
    try:
        action_logger_abi = json.loads(action_logger_abi_text)
    except Exception as e:
        raise ValueError(f"Failed to parse ActionLogger ABI at {abi_path}: {e}")

    contract_address = app.config.get('ACTION_LOGGER_CONTRACT_ADDRESS')
    if not w3.eth.get_code(Web3.to_checksum_address(contract_address)):
        app.logger.warning(f"No contract code found at ACTION_LOGGER_CONTRACT_ADDRESS {contract_address}")
    action_logger_contract = w3.eth.contract(address=Web3.to_checksum_address(contract_address), abi=action_logger_abi)

    # Blueprints
    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()  # Ensure models are imported before this

    return app
