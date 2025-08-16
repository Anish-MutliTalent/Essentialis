# app/event_indexer.py
import time
import json
from web3 import Web3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import ActionLog  # Add other models for NFTMinted, NFTListed events
from backend.app.config import Config
from datetime import datetime
import logging
from pathlib import Path

# Setup basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Database Setup ---
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Web3 Setup ---
w3 = Web3(Web3.HTTPProvider(Config.POLYGON_RPC_URL))
if not w3.is_connected():
    logging.error("Failed to connect to Polygon RPC for indexer.")
    exit(1)


def get_contract_abi(abi_path_key):
    abi_path = getattr(Config, abi_path_key)
    if not abi_path:
        logging.error(f"{abi_path_key} not configured.")
        return None
    try:
        with open(abi_path) as f:
            return json.load(f)
    except FileNotFoundError:
        logging.error(f"ABI file not found: {abi_path}")
        return None


# Load ABIs
action_logger_abi = Path(__file__).parent / "abi" / get_contract_abi('ACTION_LOGGER_CONTRACT_ABI_PATH')
# nft_land_abi = get_contract_abi('NFT_LAND_CONTRACT_ABI_PATH')
# nft_marketplace_abi = get_contract_abi('NFT_MARKETPLACE_CONTRACT_ABI_PATH')

if not action_logger_abi:  # Add checks for other ABIs if indexing them
    logging.error("Failed to load ActionLogger ABI. Exiting.")
    exit(1)

action_logger_address = Config.ACTION_LOGGER_CONTRACT_ADDRESS
# nft_land_address = Config.NFT_LAND_CONTRACT_ADDRESS
# nft_marketplace_address = Config.NFT_MARKETPLACE_CONTRACT_ADDRESS

if not action_logger_address:  # Add checks for other addresses
    logging.error("ActionLogger contract address not configured. Exiting.")
    exit(1)

action_logger_contract_instance = w3.eth.contract(address=Web3.to_checksum_address(action_logger_address),
                                                  abi=action_logger_abi)


# Similarly for other contracts if you index their events:
# nft_land_contract_instance = w3.eth.contract(address=Web3.to_checksum_address(nft_land_address), abi=nft_land_abi)
# nft_marketplace_contract_instance = w3.eth.contract(address=Web3.to_checksum_address(nft_marketplace_address),
# abi=nft_marketplace_abi)


def get_last_processed_block(db_session):
    # Store the last processed block number in DB to resume from there
    # Create a simple model for this if needed: e.g., IndexerState(event_name, last_block)
    # For simplicity, querying the latest block from the ActionLog table
    latest_log = db_session.query(ActionLog).order_by(ActionLog.block_number.desc()).first()
    if latest_log and latest_log.block_number:
        return latest_log.block_number
    return 0  # Or deployment block of the contract


def process_action_logged_event(event, db_session):
    args = event['args']
    tx_hash = event['transactionHash'].hex()

    # Avoid duplicates
    existing_log = db_session.query(ActionLog).filter_by(tx_hash=tx_hash, log_id_onchain=args.get(
        'logId')).first()  # Assuming logId is part of event
    if existing_log:
        logging.info(f"Log for tx {tx_hash} and logId {args.get('logId')} already processed.")
        return

    log_entry = ActionLog(
        log_id_onchain=args.get('logId'),  # If your event has a logId field
        user_address=args.user,
        action=args.action,
        details=args.details,
        timestamp=datetime.fromtimestamp(args.timestamp),  # Ensure this matches your event's timestamp format
        block_number=event['blockNumber'],
        tx_hash=tx_hash
    )
    db_session.add(log_entry)
    db_session.commit()
    logging.info(f"Indexed ActionLogged: User {args.user}, Action {args.action}, Block {event['blockNumber']}")


# You would create similar process_event functions for NFTMinted, NFTListed, NFTSold, etc.
# and store them in their respective database tables (e.g., IndexedNFT, IndexedListing).

def listen_for_events():
    db_session = SessionLocal()
    try:
        # For ActionLogger events
        last_block_action_logger = get_last_processed_block(db_session)  # Adjust starting block
        # You might want to start from a contract deployment block or a known recent block for the first run
        # For robust production, store the last processed block PER CONTRACT/EVENT in a dedicated table.
        # If the last_block_action_logger is 0, you might want to set it to a recent block or contract deployment block.
        # For this example, if it's 0, it means it will scan from block 0, which is very slow.
        # Better to initialize `last_block_action_logger` to `w3.eth.block_number - N` or contract deployment block.
        if last_block_action_logger == 0:
            # Heuristic: start from a recent block or contract deployment if known
            # contract_deployment_block = 12 34 56 # Replace with actual
            # last_block_action_logger = max(contract_deployment_block, w3.eth.block_number - 1000)
            pass  # For this example, will proceed, but be aware of scanning from genesis.

        logging.info(f"Starting event listener for ActionLogger from block {last_block_action_logger + 1}")
        # Add similar logic for other contracts/events (NFTLand, NFTMarketplace)

        action_logged_event_filter = action_logger_contract_instance.events.ActionLogged.create_filter(
            fromBlock=last_block_action_logger + 1
        )
        # nft_minted_filter = nft_land_contract_instance.events.NFTMinted.create_filter(...)
        # nft_listed_filter = nft_marketplace_contract_instance.events.NFTListed.create_filter(...)

        while True:
            try:
                for event in action_logged_event_filter.get_new_entries():
                    process_action_logged_event(event, db_session)

                # for event in nft_minted_filter.get_new_entries():
                #     process_nft_minted_event(event, db_session) # Implement this
                # for event in nft_listed_filter.get_new_entries():
                #     process_nft_listed_event(event, db_session) # Implement this

                # Update last processed block periodically, not necessarily after each event batch
                # current_highest_block_processed = max([e['blockNumber'] for e in new_action_logs],
                # default=last_block_action_logger)
                # if current_highest_block_processed > last_block_action_logger:
                #    last_block_action_logger = current_highest_block_processed
                #    # Persist this new last_block_action_logger

            except Exception as e:
                logging.error(f"Error in event polling loop: {e}")
                # Recreate a filter if it becomes invalid due to RPC issues, etc.
                time.sleep(10)  # Wait before retrying
                # Re-initialize filter (careful with fromBlock to avoid missing events or reprocessing)
                # A robust solution might need to re-check connection and re-create the filter
                # from the last successfully processed block number.
                db_session.rollback()  # Roll back any partial commits from this iteration
                # Reconnect or re-initialize if necessary
                w3_check = Web3(Web3.HTTPProvider(Config.POLYGON_RPC_URL))
                if not w3_check.is_connected():
                    logging.error("Indexer lost RPC connection. Attempting to reconnect...")
                    # Recreate filters based on the last known processed block
                    action_logged_event_filter = action_logger_contract_instance.events.ActionLogged.create_filter(
                        fromBlock=get_last_processed_block(db_session) + 1  # Ensure this is correct
                    )

            time.sleep(15)  # Poll every 15 seconds
    finally:
        db_session.close()


if __name__ == "__main__":
    logging.info("Starting blockchain event indexer...")
    # Ensure DB schema is created (Flask app does this, but indexer might run standalone)
    # from app.models import Base # if using declarative base for SQLAlchemy
    # Base.metadata.create_all(bind=engine) # If needed
    listen_for_events()
