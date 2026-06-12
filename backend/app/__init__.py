from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config
import json
from web3 import Web3
import logging  # Add this at the top
from pathlib import Path
from .faucet import faucet_bp

db = SQLAlchemy()

# Placeholder for Web3 connection
w3 = None
nft_land_contract = None
action_logger_contract = None
nft_marketplace_contract = None


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    # Use configured MAX_CONTENT_LENGTH from Config (default in Config.py). Do not override here.

    CORS(app, supports_credentials=True)

    # Configure Flask logger if not already done elsewhere
    if not app.debug:  # Example: Log more in production
        app.logger.setLevel(logging.INFO)
    else:
        app.logger.setLevel(logging.DEBUG)

    db.init_app(app)

    global w3, nft_land_contract, action_logger_contract, nft_marketplace_contract

    if not app.config['RPC_URL']:
        raise ValueError("RPC_URL not set in .env or config")

    w3 = Web3(Web3.HTTPProvider(app.config['RPC_URL']))
    if not w3.is_connected():
        raise ConnectionError("Failed to connect to RPC")
    app.w3 = w3

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
    contract_address = app.config.get('NFT_DOC_CONTRACT_ADDRESS')
    # Check that contract code exists at address
    if not w3.eth.get_code(Web3.to_checksum_address(contract_address)):
        raise ConnectionError(f"No contract code found at NFT_DOC_CONTRACT_ADDRESS {contract_address} on RPC")

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
    app.register_blueprint(faucet_bp, url_prefix='/faucet')

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()  # Ensure models are imported before this
        ensure_schema(app)  # Add post-launch columns to existing tables

    return app


def ensure_schema(app):
    """db.create_all() creates missing tables but never alters existing ones.
    This adds the post-launch Waitlist columns (referral/position/source) to an
    already-existing `waitlist` table, then backfills referral codes. Safe to
    run on every boot — each step is guarded by an existence check.
    """
    import secrets
    from sqlalchemy import inspect, text

    try:
        inspector = inspect(db.engine)
        if 'waitlist' not in inspector.get_table_names():
            return  # fresh DB — create_all already built it with all columns

        existing = {c['name'] for c in inspector.get_columns('waitlist')}
        # column name -> SQL type clause (kept simple for SQLite + Postgres)
        additions = {
            'referral_code': 'VARCHAR(16)',
            'referred_by': 'VARCHAR(16)',
            'referral_count': 'INTEGER DEFAULT 0',
            'referral_visits': 'INTEGER DEFAULT 0',
            'source': 'VARCHAR(255)',
        }
        added = []
        for col, ddl in additions.items():
            if col not in existing:
                db.session.execute(text(f'ALTER TABLE waitlist ADD COLUMN {col} {ddl}'))
                added.append(col)
        if added:
            db.session.commit()
            app.logger.info(f"ensure_schema: added waitlist columns {added}")

        # Helpful indexes (no-op if they already exist)
        for stmt in (
            'CREATE INDEX IF NOT EXISTS ix_waitlist_referral_code ON waitlist (referral_code)',
            'CREATE INDEX IF NOT EXISTS ix_waitlist_referred_by ON waitlist (referred_by)',
        ):
            try:
                db.session.execute(text(stmt))
            except Exception:
                db.session.rollback()
        db.session.commit()

        # Backfill referral codes for any rows missing one.
        from .models import Waitlist
        missing = Waitlist.query.filter(
            (Waitlist.referral_code.is_(None)) | (Waitlist.referral_code == '')
        ).all()
        if missing:
            taken = {
                r.referral_code for r in Waitlist.query.filter(Waitlist.referral_code.isnot(None)).all()
            }
            for entry in missing:
                code = secrets.token_urlsafe(6)[:10]
                while code in taken:
                    code = secrets.token_urlsafe(6)[:10]
                taken.add(code)
                entry.referral_code = code
                if entry.referral_count is None:
                    entry.referral_count = 0
                if entry.referral_visits is None:
                    entry.referral_visits = 0
            db.session.commit()
            app.logger.info(f"ensure_schema: backfilled {len(missing)} waitlist referral codes")
    except Exception as e:
        db.session.rollback()
        app.logger.warning(f"ensure_schema skipped/failed: {e}")
