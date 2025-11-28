# System Architecture

Essentialis uses modern, secure, and privacy-preserving architecture, blending web, cloud, and blockchain. Here’s how it all fits together:

---

## High-Level Overview

```mermaid
graph TD

    User((User or Developer))

    A["Frontend Web App\nReact, Vite, TypeScript"]
    B["Backend API\nFlask, Python, Web3"]
    C["Blockchain\nOptimism, Smart Contracts"]
    D["Storage\nEncrypted, IPFS or Cloud"]

    A -->|HTTP(S) Requests| B
    B -->|Web3 / JSON-RPC| C
    B -->|Encrypted Documents| D
    A -->|Direct IPFS for Public Files| D
    User -->|Browser| A
```

- **Frontend**: Runs in your web browser. Handles user interaction, local encryption, viewing, and wallet connection.
- **Backend**: A secure API that manages account creation, login, file operations, and blockchain actions. Never sees your decrypted data.
- **Blockchain**: Used for ownership (NFT), audit trails, and access control. All actions are verifiable and censorship-resistant.
- **Storage**: Raw files are stored encrypted on decentralized (IPFS) or trusted cloud storage.

---

## How Actions Flow

1. **Sign Up & Login**: 
   - Users register with email or wallet. Backend verifies credentials and issues a session.
2. **File Upload**:
   - Docs are encrypted _in the browser_.
   - App sends only the encrypted file to backend, which stores it on IPFS/cloud.
   - Metadata (tags, etc.) is also encrypted.
   - Ownership details may be written to the blockchain (e.g., minting a document NFT).
3. **Sharing**:
   - User generates a secure, time-limited access link.
   - All access is logged on-chain for full auditability.

---

## Security Principles
- **Zero-Knowledge**: Backend never sees, stores, or decrypts user data.
- **End-to-End Encryption**: Files are always encrypted except during viewing _by the owner or an authorized recipient_.
- **Permissioned Access**: Sharing is explicit, time-bound, and revocable.

---

## Key Technologies
- **Frontend**: React, Vite, TypeScript, Thirdweb, WalletConnect, Tailwind
- **Backend**: Flask, SQLAlchemy, Web3.py, pyotp, Postgres
- **Blockchain/Smart Contracts**: ERC721 or ERC1155 for documents, custom logging contract
- **Storage**: IPFS for decentralization, optional conventional cloud

---

## Further Reading
- [Development](development.md)
- [Code Walkthrough](code-walkthrough.md)
- [API Reference](api-reference.md)
