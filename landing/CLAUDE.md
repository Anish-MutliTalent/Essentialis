# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands
- Build: `npm run build`
- Development Server: `npm run dev`
- Linting: `npm run lint`
- Preview: `npm run preview`

## Architecture Overview
Essentialis is a privacy-preserving document management system blending web, cloud, and blockchain technologies.

### High-Level Structure
- **Frontend**: A React application built with Vite and TypeScript.
- **Security Model**: Employs a Zero-Knowledge architecture where documents are encrypted in the browser before being sent to the backend. The backend never sees decrypted data.
- **Blockchain Integration**: Uses Optimism for ownership (NFTs), audit trails, and access control. Thirdweb is used for blockchain interactions.
- **Storage**: Encrypted documents are stored on IPFS or trusted cloud storage.

### Key Frontend Directories
- `src/pages/`: Main route components (Dashboard, Homepage, Blog, etc.).
- `src/components/UI/`: Reusable design system components.
- `src/components/UI/dashboard/`: Specific components for the user dashboard.
- `src/lib/`: Core utilities for crypto, blockchain (thirdweb), and storage.
- `src/abi/`: JSON ABIs for smart contracts (DocToken, NFTDoc, etc.).
- `src/docs/`: Project documentation and architectural guides.

### Technology Stack
- **Framework**: React 18, Vite, TypeScript.
- **Styling**: Tailwind CSS, Framer Motion, GSAP.
- **Web3**: Thirdweb, Ethers.js, WalletConnect.
- **Other**: Supabase (database/auth), Monaco Editor, PDF.js.
