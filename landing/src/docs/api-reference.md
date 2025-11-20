# API Reference

This document explains the main API surfaces available in Essentialis: backend REST endpoints, authentication flows, and any public (or developer) APIs.

---

## User Authentication
- **POST /register** — Register a new user (email, password, wallet address, sets up OTP)
- **POST /login** — User login with email/password or wallet signature
- **POST /otp** — Submit a time-based OTP code (2FA)

---

## Documents & Storage
- **POST /upload** — Upload a new encrypted document
- **GET /file/:id** — Download an encrypted document (decrypted in frontend)
- **GET /my-docs** — List user’s own files and metadata
- **DELETE /file/:id** — Delete a document
- **POST /mint** — Mint document ownership as a blockchain NFT
- **GET /audit** — Get audit trail for document access & sharing

---

## Sharing
- **POST /share** — Generate a secure, permissioned sharing link
- **PATCH /share/:id/revoke** — Revoke access instantly
- **GET /audit** — View who accessed shared docs and from where

---

## Admin & Advanced
- **POST /init-admin** — Platform admin initialization (run by CLI)
- **GET /faucet** — Developer/test wallet funding endpoint

Refer to [Code Walkthrough](code-walkthrough.md) and [Architecture](architecture.md) for specific request/response formats and for pointers into the code itself. This API reference is intended for developers or advanced users ONLY.
