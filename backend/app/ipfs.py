import requests
from werkzeug.datastructures import FileStorage
from dotenv import load_dotenv
import os
from typing import Iterator, Tuple

load_dotenv()

# Pinata API credentials
PINATA_API_KEY = os.environ.get('PINATA_API_KEY')
PINATA_SECRET_API_KEY = os.environ.get('PINATA_SECRET_API_KEY')


def upload_json(data: dict) -> str:
    # Set request headers
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
        "Content-Type": "application/json"
    }

    # Set the endpoint
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"

    # Send request
    response = requests.post(url, headers=headers, json={"pinataContent": data})

    # Output the IPFS hash
    if response.status_code == 200:
        return response.json()["IpfsHash"]
    else:
        return f"error: {response.status_code}, {response.text}"


def upload_file(file: FileStorage) -> str:
    # API endpoint
    url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

    # Headers (note: no 'Content-Type' when uploading files!)
    headers = {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
    }

    files = {
        'file': (file.filename, file.stream)
    }

    response = requests.post(url, files=files, headers=headers, stream=True)

    if response.status_code == 200:
        return response.json()['IpfsHash']
    else:
        return f"error: {response.status_code}, {response.text}"


def download_json(ipfs_hash: str) -> dict:
    # Uses an IPFS gateway to retrieve the JSON.
    gateway_url = f"https://ipfs.io/ipfs/{ipfs_hash}"
    response = requests.get(gateway_url)
    response.raise_for_status()
    return response.json()

def stream_file_from_ipfs(ipfs_hash: str) -> Tuple[Iterator[bytes], dict]:
    """
    Streams a file directly from IPFS and returns an iterator and headers.

    :param ipfs_hash: IPFS CID
    :return: (byte iterator, response headers)
    """
    gateway_url = f"https://ipfs.io/ipfs/{ipfs_hash}"
    response = requests.get(gateway_url, stream=True)
    response.raise_for_status()

    headers = {
        "Content-Type": response.headers.get("Content-Type", "application/octet-stream"),
        "Content-Length": response.headers.get("Content-Length"),
        "Content-Disposition": response.headers.get("Content-Disposition"),
    }

    return response.iter_content(chunk_size=8192), headers
