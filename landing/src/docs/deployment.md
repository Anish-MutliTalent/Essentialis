# Deployment Guide

Deploying Essentialis in production or staging is straightforward if you follow these steps. This covers both backend and frontend.

---

## Production Deployment Overview
- **Recommended:** Deploy backend and frontend separately (preferably with Docker or managed cloud services).
- **Environment variables and secrets** must be set securely (never hard-code them).

---

## Backend (Flask, Python)

### With Docker
```bash
cd backend
docker build -t essentialis-backend .
docker run --env-file .env -p 8080:8080 essentialis-backend
```

- Make sure your `.env` file contains all secret keys, DB URLs, and contract addresses required in `config.py`.
- Use a cloud database (PostgreSQL or compatible) for persistence.
- Scale with tools like Gunicorn + nginx in production.

### Without Docker
```bash
cd backend
pip install -r requirements.txt
python run.py
```

---

## Frontend (React, Vite)

### Build and Deploy
```bash
cd frontend
npm install
npm run build
# Serve with nginx, Netlify, Vercel or another static server
```
- The built files will be in `frontend/dist/`.

### Configuration
- Adjust environment variables (API URLs) to point to your backend.
- Use HTTPS in production for all connections.

---

## Upgrade & Migration Tips
- Run DB migrations as needed (using Flask CLI or DB migration tools).
- Never expose secrets in code or logs.

---

## Best Practices
- Back up secrets and databases securely.
- Use monitoring and alerting for infrastructure stability.
- For blockchain config and wallet keys, prefer HSM/KMS or managed secret stores.

---

For full variable details see [development.md](development.md) and [architecture.md](architecture.md).
