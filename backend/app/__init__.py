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

    contract_abi = open(Path(__file__).parent / "abi" / app.config.get('NFT_LAND_CONTRACT_ABI_PATH'), 'r').read()
    # Set the contract address (replace with your contract's deployed address)
    contract_address = app.config.get('NFT_LAND_CONTRACT_ADDRESS')
    nft_land_contract = w3.eth.contract(address=Web3.to_checksum_address(contract_address), abi=contract_abi)

    contract_abi = open(Path(__file__).parent / "abi" / app.config.get('ACTION_LOGGER_CONTRACT_ABI_PATH'), 'r').read()
    # Set the contract address (replace with your contract's deployed address)
    contract_address = app.config.get('ACTION_LOGGER_CONTRACT_ADDRESS')
    action_logger_contract = w3.eth.contract(address=Web3.to_checksum_address(contract_address), abi=contract_abi)

    contract_abi = open(Path(__file__).parent / "abi" / app.config.get('NFT_MARKETPLACE_CONTRACT_ABI_PATH'), 'r').read()
    # Set the contract address (replace with your contract's deployed address)
    contract_address = app.config.get('NFT_MARKETPLACE_CONTRACT_ADDRESS')
    nft_marketplace_contract = w3.eth.contract(address=Web3.to_checksum_address(contract_address), abi=contract_abi)

    # Blueprints
    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()  # Ensure models are imported before this

    return app
