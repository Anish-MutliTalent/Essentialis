import random
import string
import AES
from operators import mul, div
from functools import reduce
from hashlib import sha512, sha3_512
import base64
import bcrypt


class KeyGenerator:
    def __init__(self, length=16):
        self.length = length

    def generate_key(self):
        # Generate a random key made of ascii letters and digits
        key = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(self.length))
        return key

    def store_key_in_litprotocol(self, key):
        # Placeholder for litprotocol storage API
        # Replace the following line with an actual API call to litprotocol
        print(f"Storing key in litprotocol: {key}")


def bcrypt_hash(text: str):
    return bcrypt.hashpw(text.encode('utf-8'), bcrypt.gensalt())

