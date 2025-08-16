import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag


# Define a custom exception for a clear and consistent API
class DecryptionError(Exception):
    """Raised when decryption fails due to an integrity check failure (invalid tag)."""
    pass


class AES:
    """
    A class that provides a strong, unified authenticated encryption scheme based on
    the industry-standard AES-256-GCM (Galois/Counter Mode).

    This implementation is securely backward-compatible with the previous class API,
    while using the superior GCM mode internally.

    This class provides:
    1.  Confidentiality: The message content is kept secret.
    2.  Integrity: The message cannot be modified without detection.
    3.  Authenticity: The message is confirmed to be from the sender who holds the key.
    """
    # Define constants for GCM parameters
    _KEY_SIZE = 32  # Use AES-256
    _NONCE_SIZE = 12  # Recommended 96-bit (12-byte) nonce for GCM
    _TAG_SIZE = 16  # GCM's authentication tag is 128 bits (16 bytes)

    def __init__(self, master_key: bytes):
        """
        Initializes the cipher with a master secret key.

        Args:
            master_key (bytes): A high-entropy master key of exactly 32 bytes (256 bits).
        """
        if not isinstance(master_key, bytes) or len(master_key) != self._KEY_SIZE:
            raise ValueError(f"master_key must be exactly {self._KEY_SIZE} bytes.")

        # With GCM, we can use the key directly without derivation.
        self._key = master_key

    def encrypt(self, plaintext: bytes, associated_data: bytes = None) -> bytes:
        """
        Encrypts and authenticates the plaintext using AES-256-GCM.

        Args:
            plaintext (bytes): The data to encrypt.
            associated_data (bytes, optional): Additional data to authenticate but not
                                               encrypt (e.g., headers, metadata). Defaults to None.

        Returns:
            bytes: A single byte string containing the nonce and the GCM-generated
                   ciphertext + tag.
                   Format: [nonce (12 bytes)][ciphertext + tag]
        """
        if not isinstance(plaintext, bytes):
            raise TypeError("Plaintext must be bytes.")
        if associated_data is not None and not isinstance(associated_data, bytes):
            raise TypeError("Associated data must be bytes.")

        # Instantiate the AES-GCM cipher with our key
        aesgcm = AESGCM(self._key)

        # Generate a secure, unique nonce for every single encryption operation.
        # This is critically important for GCM's security.
        nonce = os.urandom(self._NONCE_SIZE)

        # Encrypt the data. The result is an atomic operation that produces
        # the ciphertext and the authentication tag appended together.
        ciphertext_and_tag = aesgcm.encrypt(nonce, plaintext, associated_data)

        # Prepend the nonce to the result. The decrypt method will need it.
        return nonce + ciphertext_and_tag

    def decrypt(self, packaged_ciphertext: bytes, associated_data: bytes = None) -> bytes:
        """
        Decrypts and verifies the packaged ciphertext using AES-256-GCM.

        Args:
            packaged_ciphertext (bytes): The byte string produced by the encrypt() method.
            associated_data (bytes, optional): The exact same associated data that was
                                               provided during encryption.

        Returns:
            bytes: The original plaintext if decryption and verification are successful.

        Raises:
            DecryptionError: If the authentication tag is invalid, indicating the data
                             is corrupt, has been tampered with, or was encrypted with
                             a different key or different associated data.
        """
        if not isinstance(packaged_ciphertext, bytes):
            raise TypeError("Ciphertext must be bytes.")
        if associated_data is not None and not isinstance(associated_data, bytes):
            raise TypeError("Associated data must be bytes.")

        min_len = self._NONCE_SIZE + self._TAG_SIZE
        if len(packaged_ciphertext) < min_len:
            raise DecryptionError("Invalid ciphertext: too short to contain a nonce and tag.")

        # 1. Unpack the nonce and the combined ciphertext/tag
        nonce = packaged_ciphertext[:self._NONCE_SIZE]
        ciphertext_and_tag = packaged_ciphertext[self._NONCE_SIZE:]

        # 2. Instantiate the AES-GCM cipher
        aesgcm = AESGCM(self._key)

        # 3. Decrypt and verify. This is an atomic operation.
        #    The library raises InvalidTag on failure, which we catch and
        #    re-raise as our consistent API error.
        try:
            plaintext = aesgcm.decrypt(nonce, ciphertext_and_tag, associated_data)
            return plaintext
        except InvalidTag:
            raise DecryptionError("Integrity check failed. Ciphertext is invalid or has been tampered with.")