<!-- .github/copilot-instructions.md for Essentialis repository -->
# Copilot / AI agent instructions (concise)

Purpose: help an AI coding agent be productive quickly in this mono-repo by describing architecture, key files, dev workflows, conventions, and concrete examples.

1) Big-picture architecture
- Backend: Flask app in `backend/app/` using application factory `create_app()` (entry: `backend/run.py`). Business logic and blockchain helpers live in `backend/app/services.py`, `routes.py`, `ipfs.py`, `AES.py`, and `crypt.py`.
- Frontend: React + TypeScript + Vite in `frontend/`. Wallet & auth use Thirdweb (`frontend/src/lib/thirdweb.ts`) and `thirdweb/react` providers. UI components live under `frontend/src/components/` (design system in `components/UI`).
- Contracts: Solidity sources in `contracts/` and compiled ABI JSON in `backend/app/abi/` and `frontend/src/abi/`.

2) How the pieces communicate (key flows)
- Frontend -> Backend: frontend proxies `/api` requests to Flask (see `frontend/vite.config.ts`). Example: frontend checks auth with `fetch('/api/auth/status', { credentials: 'include' })` (see `frontend/src/App.tsx`). Keep cookies/credentials enabled.
- Backend -> Blockchain: backend uses `web3` (configured via env `RPC_URL`) and reads ABIs from `backend/app/abi/*` (see `backend/app/config.py`). Smart-contract interaction helpers live in `services.py` and `routes.py`.
- Storage: files/metadata are uploaded to IPFS via `backend/app/ipfs.py` (used by `routes.py` endpoints `/ipfs/file` and `/ipfs/json`). Encryption helpers are in `backend/app/AES.py` and `backend/app/crypt.py`.

3) Dev workflows & commands (Windows PowerShell examples)
- Backend setup (virtualenv + requirements):
  $ python -m venv .venv; .\.venv\Scripts\Activate; pip install -r backend\requirements.txt
- Run backend (development):
  $env:DATABASE_URL = 'sqlite:///dev.db'; $env:ADMIN_EMAIL = 'admin@example.com'; python .\backend\run.py
- Use Flask CLI for admin init (register admin from env):
  $env:FLASK_APP = 'backend/run.py'; $env:ADMIN_EMAIL='admin@example.com'; $env:ADMIN_PASSWORD='secret'; flask init-admin
- Frontend setup & dev server:
  cd frontend; npm install; echo "VITE_THIRDWEB_CLIENT_ID=..." > .env; npm run dev
- Frontend build:
  cd frontend; npm run build

4) Important environment variables and where they matter
- Frontend: VITE_THIRDWEB_CLIENT_ID (see `frontend/src/lib/thirdweb.ts`) — required for Thirdweb client.
- Backend (`backend/app/config.py`): DATABASE_URL, RPC_URL, NFT_DOC_CONTRACT_ADDRESS, NFT_LAND_CONTRACT_ABI_PATH (ABI filenames under `backend/app/abi/`), PLATFORM_OPERATIONAL_WALLET_PRIVATE_KEY (sensitive), ADMIN_EMAIL, ADMIN_PASSWORD (used for `init-admin`).

5) Project-specific conventions and patterns
- API proxying: frontend sends requests to `/api/*`; Vite strips `/api` and proxies to `http://127.0.0.1:5000`. When editing routes, remember the `/api` prefix is removed by dev proxy (so backend routes are defined without `/api` prefix).
- Auth: backend uses Flask session cookies for auth; frontend must use `credentials: 'include'` on fetch calls. Example endpoints: `/auth/register/email`, `/auth/login/email`, `/auth/logout`, `/auth/status` (see `backend/app/routes.py`).
- Wallets: frontend relies on Thirdweb's `AutoConnect` and `inAppWallet` usage (see `frontend/src/main.tsx`), and the app uses `useActiveAccount()` for route protection.
- Routing: frontend nested routes under `/dashboard` map to components in `frontend/src/components/UI/dashboard/content/`, e.g., `DocView.tsx` corresponds to route `/dashboard/my-docs/:tokenId/view`.

6) Integration points to watch when editing
- ABI and contract addresses: keep ABIs in sync between `contracts/`, `backend/app/abi/`, and `frontend/src/abi/`.
- IPFS + Encryption: uploading and metadata flows traverse frontend (encrypt client-side or backend?) and backend `ipfs` helpers; examine `routes.py` and `ipfs.py` for exact shape.
- Web3 provider health: backend checks `w3.is_connected()` before contract calls; if adding RPC calls, mirror these checks.

7) Concrete examples to copy/use
- Check auth status from the app (App.tsx): fetch('/api/auth/status', { method: 'GET', credentials: 'include' }) — keep credentials included.
- Vite proxy config (dev): `frontend/vite.config.ts` maps `/api` -> `http://127.0.0.1:5000` and rewrites the path.
- Thirdweb client: `frontend/src/lib/thirdweb.ts` requires `VITE_THIRDWEB_CLIENT_ID` and exports `client` used by `AutoConnect`.

8) Safety & secrets
- Never commit private keys or `.env` with secrets. `PLATFORM_OPERATIONAL_WALLET_PRIVATE_KEY` and OAuth client secrets must be kept out of the repo and injected via CI or runtime secrets.

9) Quick pointers for common edits
- Adding a new API endpoint: update `backend/app/routes.py` or add a new blueprint under `backend/app/`, register via `create_app()`. Remember to test via the frontend dev proxy: fetch('/api/your-route').
- Frontend component location: add new dashboard screens under `frontend/src/components/UI/dashboard/content/` and register routes in `frontend/src/App.tsx`.
- Smart-contract changes: update `.sol` in `contracts/`, recompile to produce ABI JSON and update ABI files referenced in `backend/app/abi/` and `frontend/src/abi/`.

10) Where to look first when debugging
- Backend: `backend/run.py`, `backend/app/routes.py`, `backend/app/services.py`, `backend/app/ipfs.py`, `backend/app/config.py`.
- Frontend: `frontend/src/main.tsx`, `frontend/src/App.tsx`, `frontend/src/lib/thirdweb.ts`, `frontend/vite.config.ts`, `frontend/src/components/`.

If any of these sections are unclear or you want more detail (unit-test patterns, CI, or contract deployment steps), tell me which area to expand and I'll iterate.
