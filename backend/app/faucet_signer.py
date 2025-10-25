import os
from eth_account import Account
from eth_account.messages import encode_typed_data
from dotenv import load_dotenv
import time

load_dotenv()

# Load configuration from environment
OWNER_PRIVATE_KEY = os.getenv('OWNER_PRIVATE_KEY')
CHAIN_ID = int(os.getenv('CHAIN_ID'))
CONTRACT_ADDRESS = os.getenv('FAUCET_CONTRACT_ADDRESS')

# Create an account from private key
owner_account = Account.from_key(OWNER_PRIVATE_KEY)


# EIP-712 Domain (must match smart contract)
def get_domain():
    return {
        "name": "EssentialisPayout",
        "version": "1",
        "chainId": CHAIN_ID,
        "verifyingContract": CONTRACT_ADDRESS,
    }


# EIP-712 Types (must match smart contract)
def get_types():
    return {
        "Claim": [
            {"name": "recipient", "type": "address"},
            {"name": "amount", "type": "uint256"},
            {"name": "nonce", "type": "uint256"},
            {"name": "deadline", "type": "uint256"},
        ]
    }


def create_claim_signature(recipient: str, amount_wei: int, nonce: int):
    """
    Create an EIP-712 signature for a faucet claim.

    Args:
        recipient: Ethereum address of the recipient
        amount_wei: Amount in wei (not ether)
        nonce: Current nonce for the recipient from contract

    Returns:
        dict with recipient, amount, nonce, deadline, and signature
    """
    # Set deadline to 10 minutes from now
    deadline = int(time.time()) + (10 * 60)

    # Create the message data
    message = {
        "recipient": recipient,
        "amount": amount_wei,
        "nonce": nonce,
        "deadline": deadline,
    }

    # Build EIP-712 structured data
    structured_data = {
        "types": get_types(),
        "primaryType": "Claim",
        "domain": get_domain(),
        "message": message,
    }

    # Encode and sign
    encoded_data = encode_typed_data(full_message=structured_data)
    signed_message = owner_account.sign_message(encoded_data)

    # Return signature and claim details
    return {
        "recipient": recipient,
        "amount": str(amount_wei),
        "nonce": str(nonce),
        "deadline": str(deadline),
        "signature": signed_message.signature.hex(),
    }


# Example usage (for testing)
if __name__ == "__main__":
    test_recipient = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    test_amount = 300000000000000  # 0.0003 ETH in wei
    test_nonce = 0

    result = create_claim_signature(test_recipient, test_amount, test_nonce)
    print("Signature created:")
    print(result)