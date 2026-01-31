from flask import Blueprint, request, jsonify, session
from web3 import Web3
from web3.exceptions import ContractLogicError
import os
from dotenv import load_dotenv
from .faucet_signer import create_claim_signature

load_dotenv()

# Create Blueprint
faucet_bp = Blueprint('faucet', __name__)

# Configuration
RPC_URL = os.getenv('RPC_URL')
FAUCET_CONTRACT_ADDRESS = os.getenv('FAUCET_CONTRACT_ADDRESS')
PAYOUT_AMOUNT_ETH = "0.00002"  # 0.00002 ETH

# Initialize Web3
web3 = Web3(Web3.HTTPProvider(RPC_URL))

# Contract ABI (minimal - only what we need)
FAUCET_ABI = [
    {
        "inputs": [{"name": "", "type": "address"}],
        "name": "nonces",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"name": "recipient", "type": "address"},
            {"name": "amount", "type": "uint256"},
            {"name": "deadline", "type": "uint256"},
            {"name": "signature", "type": "bytes"},
            {"name": "pubEncryptionKey", "type": "string"}
        ],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# Get contract instance
faucet_contract = web3.eth.contract(
    address=Web3.to_checksum_address(FAUCET_CONTRACT_ADDRESS),
    abi=FAUCET_ABI
)


def get_nonce(recipient_address: str) -> int:
    """Get the current nonce for a recipient from the smart contract."""
    try:
        checksum_address = Web3.to_checksum_address(recipient_address)
        nonce = faucet_contract.functions.nonces(checksum_address).call()
        return nonce
    except Exception as e:
        print(f"Error getting nonce: {e}")
        raise


@faucet_bp.route('/address', methods=['GET'])
def get_faucet_address():
    """Return the faucet contract address."""
    return jsonify({"address": FAUCET_CONTRACT_ADDRESS}), 200


@faucet_bp.route('/get-claim-signature', methods=['POST'])
def get_claim_signature():
    """
    Generate an EIP-712 signature for a faucet claim.

    Expected body:
    {
        "recipient": "0x..."
    }

    Returns:
    {
        "recipient": "0x...",
        "amount": "500000000000000",
        "nonce": "0",
        "deadline": "1234567890",
        "signature": "0x...",
        "contractAddress": "0x...",
        "chainId": "8453"
    }
    """
    try:
        # 1. Check authentication
        if 'user_id' not in session:
            return jsonify({"error": "Not authenticated"}), 401

        # 2. Get recipient from request
        data = request.get_json()
        recipient = data.get('recipient')

        if not recipient:
            return jsonify({"error": "Recipient address required"}), 400

        # 3. Validate address
        if not Web3.is_address(recipient):
            return jsonify({"error": "Invalid Ethereum address"}), 400

        # Normalize address
        recipient = Web3.to_checksum_address(recipient)
        normalized = recipient.lower()

        # 5. Get current nonce from contract
        nonce = get_nonce(recipient)

        # 6. Convert payout amount to wei
        amount_wei = web3.to_wei(PAYOUT_AMOUNT_ETH, 'ether')

        # 7. Create EIP-712 signature
        signature_data = create_claim_signature(recipient, amount_wei, nonce)

        # 9. Return signature and contract info
        return jsonify({
            **signature_data,
            "contractAddress": FAUCET_CONTRACT_ADDRESS,
            "chainId": str(web3.eth.chain_id),
        }), 200

    except Exception as e:
        print(f"Error in get_claim_signature: {e}")
        return jsonify({"error": str(e)}), 500


@faucet_bp.route('/relay-claim', methods=['POST'])
def relay_claim():
    """
    Backend submits the claim transaction on behalf of the user (for MetaMask/EOAs).

    Expected body:
    {
        "recipient": "0x...",
        "pubEncryptionKey": "optional..."
    }

    Returns:
    {
        "success": true,
        "txHash": "0x..."
    }
    """
    try:
        # 1. Check authentication
        if 'user_id' not in session: # Consistency with other route (was userId vs user_id)
             # Checking both just in case, or stick to what was there. auth.py sets user_id.
             if 'userId' not in session and 'user_id' not in session:
                return jsonify({"error": "Not authenticated"}), 401

        # 2. Get recipient from request
        data = request.get_json()
        recipient = data.get('recipient')
        pub_key = data.get('pubEncryptionKey', '') # Optional key

        if not recipient:
            return jsonify({"error": "Recipient address required"}), 400

        # 3. Validate address
        if not Web3.is_address(recipient):
            return jsonify({"error": "Invalid Ethereum address"}), 400

        recipient = Web3.to_checksum_address(recipient)
        normalized = recipient.lower()

        # 5. Get nonce
        nonce = get_nonce(recipient)

        # 6. Convert amount to wei
        amount_wei = web3.to_wei(PAYOUT_AMOUNT_ETH, 'ether')

        # 7. Create signature
        signature_data = create_claim_signature(recipient, amount_wei, nonce)

        # 8. Prepare transaction (backend submits)
        owner_account = web3.eth.account.from_key(os.getenv('OWNER_PRIVATE_KEY'))

        # Build transaction
        tx = faucet_contract.functions.claim(
            Web3.to_checksum_address(signature_data['recipient']),
            int(signature_data['amount']),
            int(signature_data['deadline']),
            bytes.fromhex(signature_data['signature'][2:]),  # Remove '0x' prefix
            str(pub_key)
        ).build_transaction({
            'from': owner_account.address,
            'nonce': web3.eth.get_transaction_count(owner_account.address),
            'gas': 200000,  # Increased gas for storage
            'gasPrice': web3.eth.gas_price,
        })

        # Sign transaction
        signed_tx = web3.eth.account.sign_transaction(tx, os.getenv('OWNER_PRIVATE_KEY'))

        # Send transaction
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)

        # Wait for receipt (optional - remove if you want async)
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)

        # 10. Return success
        return jsonify({
            "success": True,
            "txHash": tx_hash.hex(),
            "blockNumber": receipt['blockNumber'],
        }), 200

    except ContractLogicError as e:
        print(f"Contract error in relay_claim: {e}")
        return jsonify({"error": f"Contract error: {str(e)}"}), 400
    except Exception as e:
        print(f"Error in relay_claim: {e}")
        return jsonify({"error": str(e)}), 500


# @faucet_bp.route('/check-claimed/<address>', methods=['GET'])
# def check_claimed(address):
#     """
#     Check if an address has already claimed.
#
#     Returns:
#     {
#         "hasClaimed": true/false
#     }
#     """
#     try:
#         if not Web3.is_address(address):
#             return jsonify({"error": "Invalid address"}), 400
#
#         normalized = Web3.to_checksum_address(address).lower()
#
#         return jsonify({
#             "hasClaimed": normalized in claimed_users
#         }), 200
#
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
