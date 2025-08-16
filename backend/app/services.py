from pathlib import Path
from flask import current_app
from web3 import Web3  # Make sure Web3 is imported for type hinting and utilities

# Import the initialized instances from your app package (app/__init__.py)
# This assumes your app/__init__.py defines w3, nft_land_contract, etc. globally within that file
# and they are not None.
from . import w3, nft_land_contract, action_logger_contract, nft_marketplace_contract

def log_action_on_chain(user_address, action_description, details_json_str, acting_as_address=None):
    if not action_logger_contract:  # Check if contract instance is valid
        current_app.logger.error("ActionLogger contract not loaded or not available.")
        return {"error": "ActionLogger service not available"}, False
    if not w3:  # Check if w3 is valid
        current_app.logger.error("Web3 instance not available.")
        return {"error": "Web3 service not available"}, False

    try:
        backend_wallet_address_str = current_app.config.get('PLATFORM_OPERATIONAL_WALLET_ADDRESS')
        backend_private_key = current_app.config.get('PLATFORM_OPERATIONAL_WALLET_PRIVATE_KEY')

        if not backend_wallet_address_str or not backend_private_key:
            current_app.logger.error("Backend operational wallet or private key not configured for logging.")
            return {"error": "Cannot log action: backend signer not configured"}, False

        backend_wallet_address = Web3.to_checksum_address(backend_wallet_address_str)

        # Ensure w3.eth is available
        if not hasattr(w3, 'eth'):
            current_app.logger.error("w3.eth is not available. Web3 connection issue?")
            return {"error": "Web3 eth attribute not available"}, False

        tx_params = {
            'from': backend_wallet_address,
            'nonce': w3.eth.get_transaction_count(backend_wallet_address),
            'gas': 200000,
            'gasPrice': w3.eth.gas_price
        }

        # Assuming ActionLogger.sol has: function logAction(string memory action, string memory details) public
        # The .functions accessor should exist if action_logger_contract is a valid Contract object
        transaction_call = action_logger_contract.functions.logAction(
            action_description, details_json_str
        )
        transaction = transaction_call.build_transaction(tx_params)  # build_transaction is a method

        signed_tx = w3.eth.account.sign_transaction(transaction, private_key=backend_private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        current_app.logger.info(f"Action logged on-chain: {action_description}, Tx: {tx_hash.hex()}")
        return {"tx_hash": tx_hash.hex(), "status": tx_receipt.status}, True

    except Exception as e:
        current_app.logger.error(f"Error logging action on-chain: {e}")
        # Log the full traceback for better debugging
        import traceback
        current_app.logger.error(traceback.format_exc())
        return {"error": str(e)}, False


def get_nft_details(token_id):
    if not nft_land_contract:  # Check if contract instance is valid
        current_app.logger.error("NFTLand contract not loaded or not available.")
        return {"error": "NFTLand contract not loaded."}, 503
    if not w3:  # Check if w3 is valid
        current_app.logger.error("Web3 instance not available.")
        return {"error": "Web3 service not available"}, 503

    try:
        # The .functions accessor should exist if nft_land_contract is valid
        owner = nft_land_contract.functions.ownerOf(token_id).call()
        token_uri = nft_land_contract.functions.tokenData(token_id).call()
        return {
            "token_id": token_id,
            "owner": owner,
            "token_uri": token_uri,
        }, 200
    except Exception as e:
        current_app.logger.error(f"Error fetching NFT details for token {token_id}: {e}")
        import traceback
        current_app.logger.error(traceback.format_exc())
        return {"error": f"Could not fetch details for token {token_id}. It may not exist or an error occurred."}, 404


def get_active_listings_from_contract(limit=50, offset=0):
    if not nft_marketplace_contract:  # Check if contract instance is valid
        current_app.logger.error("Marketplace contract not loaded or not available.")
        return {"error": "Marketplace contract not loaded"}, 503
    if not w3:  # Check if w3 is valid
        current_app.logger.error("Web3 instance not available.")
        return {"error": "Web3 service not available"}, 503

    try:
        # The .functions accessor should exist if nft_marketplace_contract is valid
        total_listings_on_chain = nft_marketplace_contract.functions.getTotalListings().call()
        # ... rest of the logic (which I mentioned is inefficient on-chain)
        return {"message": "Fetching active listings from on-chain is inefficient. Use an event indexer.", "data": [],
                "total_on_chain_listings_for_debug": total_listings_on_chain}, 200
    except Exception as e:
        current_app.logger.error(f"Error fetching listings: {e}")
        import traceback
        current_app.logger.error(traceback.format_exc())
        return {"error": str(e)}, 500


# --- Fiat On-Ramp Conceptual Service ---
def get_fiat_onramp_quote(amount_inr, crypto_currency="MATIC", user_wallet_address=None):
    """
    Conceptual: Gets a quote from a fiat on-ramp provider like Transak.
    This would involve making an API call to the provider.
    """
    api_key = current_app.config['TRANSAK_API_KEY']
    env = current_app.config['TRANSAK_ENVIRONMENT']
    if not api_key:
        return {"error": "Fiat on-ramp service not configured"}, 503

    # Example: This is pseudocode for what an integration might look like
    # endpoint = f"https://api.{'global.' if env == 'PRODUCTION' else ''}transak.com/v2/currencies/price"
    # params = {
    #     "partnerApiKey": api_key,
    #     "fiatCurrency": "INR",
    #     "cryptoCurrency": crypto_currency,
    #     "fiatAmount": amount_inr,
    #     "paymentMethod": "upi", # example
    #     "walletAddress": user_wallet_address, # if direct deposit
    #     "isBuyOrSell": "BUY"
    # }
    # response = requests.get(endpoint, params=params)
    # if response.status_code == 200:
    #     data = response.json()
    #     # Process data: crypto_amount, fees, total_inr_debit, etc.
    #     return {"quote_data": data['response']}, 200
    # else:
    #     return {"error": "Failed to get quote from Transak", "details": response.text}, 500

    # Placeholder response
    estimated_matic = float(amount_inr) / 80  # Dummy rate 1 MATIC = 80 INR
    return {
        "fiat_currency": "INR",
        "fiat_amount": amount_inr,
        "crypto_currency": crypto_currency,
        "estimated_crypto_amount": estimated_matic,
        "message": "This is a conceptual quote. Integrate with a real provider."
    }, 200


def get_estimated_gas_fee_inr(transaction_type="mint"):
    # This is highly dynamic. Gas price fluctuates.
    # You'd need to estimate gas units for a typical transaction of this type.
    # gas_units_mint = 200000 # Example
    # gas_units_buy = 300000 # Example
    # current_gas_price_wei = w3.eth.gas_price
    # gas_fee_matic = Web3.from_wei(gas_units_mint * current_gas_price_wei, 'ether')
    # matic_to_inr_rate = 80 # Fetch this from an oracle or price feed
    # gas_fee_inr = float(gas_fee_matic) * matic_to_inr_rate
    # return gas_fee_inr
    return 5.00  # Placeholder INR for gas