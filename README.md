# 🏛️ LandChain

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![OIN](https://img.shields.io/badge/Open%20Invention%20Network-Community%20Member-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> A decentralized land record management system built on the Polygon blockchain, integrating encrypted document storage, NFT-based ownership, INR tokenization, and UPI/card payments.

---

## 🚀 Overview

**LandChain** is transforming how land records are stored, updated, and transferred by leveraging blockchain, encryption, and digital payments. Our platform ensures **secure**, **transparent**, and **tamper-proof** land ownership through NFTs, while enabling seamless INR-based transactions through UPI/card payments.

---

## 🔗 Live Contracts

- **Polygon Amoy (Testnet)**  
  - NFT Contract: [`0x3C741947476A084A7b888E78cA155A1BbEb37A46`](https://amoy.polygonscan.com/address/0x3C741947476A084A7b888E78cA155A1BbEb37A46)
  - Token Contract: [`0xe21dF63B4e1aE83E62E4EfA0AfeFFf2D979f2a61`](https://amoy.polygonscan.com/address/0x3C741947476A084A7b888E78cA155A1BbEb37A46)
  - Proxy (Coming Soon)

---

## 📦 Tech Stack

| Layer        | Tech/Tools                                         |
|--------------|----------------------------------------------------|
| Blockchain   | Polygon zkEVM / Polygon PoS                        |
| Smart Contracts | Solidity, Hardhat, OpenZeppelin (Upgradeable)     |
| Backend      | Node.js / Express (API Gateway + DB encryption)    |
| Frontend     | React + TailwindCSS (ThirdWeb & ethers.js)         |
| Payments     | RazorPay (INR Tokenization + UPI/Card Gateway)     |
| Storage      | IPFS + AES-256 Encryption                          |
| Identity     | Aadhaar (UIDAI-verified via KYC partners)          |

---

## 🧩 Core Features

- ✅ **NFT Minting for Land Records** (with encrypted metadata)
- 🔄 **Append-Only Updates** using update history (not overwrite)
- 🔐 **AES Encrypted Document Upload** (PDF, PPT, MP4, TXT, IMG)
- 🧾 **Audit Logging** of every state change (fully on-chain)
- 🪙 **Tokenized INR Payments** via RazorPay (non-official INR token)
- 👤 **Aadhaar Verification** (for Indian identity verification)
- 🧑‍⚖️ **Government Permission Layer** (admin tools for officials)
- 📱 **Mobile-First & AppStore-Ready DApp**

---

## 🧪 Testing

- NFT `0x3C741947476A084A7b888E78cA155A1BbEb37A46` - Test using Remix QuickDApp at [`landchainnft.surge.sh`](https://landchainnft.surge.sh)
- Logs `0xe21dF63B4e1aE83E62E4EfA0AfeFFf2D979f2a61` - Test using Remix QuickDApp at [`landchainlogger.surge.sh`](https://landchainlogger.surge.sh)

## Additional Important Features (Yet unimplemented)

### 💰 Payments & Tokenization

- Users pay in INR to mint a land NFT.
- Payments are processed via RazorPay (card/UPI).
- The platform mints equivalent INR tokens internally for on-chain use.
- Token transfers reflect real-world currency transactions securely.

### 🧩 Splitting and Merging Land NFTs

- Each land parcel is represented by an NFT (ERC-721 or ERC-3525). You can extend this with metadata and a polygonal boundary (e.g., via GeoJSON or WKT). To support split/merge:
- Split = burn 1 NFT → mint N new NFTs
- Merge = burn N NFTs → mint 1 new NFT
- Split/Merged land is transferred safely

### 🌏 Geo-Spatial Metadata & Validation
- Ensure no overlaps with other land
- Adjacent parcels are merged cleanly
- Area balances out post-split/merge

---

## 🎯 Goals

- Reduce land disputes by 90% via immutability and clear ownership.
- Enable state-level governments to integrate blockchain with ease.
- Bring real-world assets into the on-chain economy through NFT ownership.

---

## 🌐 Visit Us

📎 Website: [https://landchain.in](https://landchain.in)  
🛠️ GitHub: [/The-LandChain-Company/LandChain](https://github.com/The-LandChain-Company/LandChain)

