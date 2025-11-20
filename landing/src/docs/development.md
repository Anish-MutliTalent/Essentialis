# Development Guide

This section explains how to run, test, and contribute to Essentialis. It covers both the frontend (web app) and backend (API), assuming basic familiarity with Node.js, Python, and Git.

---

## Prerequisites
- Node.js v18+, npm (for frontend)
- Python 3.10+ (for backend)
- Docker (optional, for easy deployment)
- A modern browser (for app testing)

---

## Getting Started: Frontend

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```
2. **Run the dev server**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Getting Started: Backend

1. **Install dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. **Copy and edit `.env` config based on backend/config.py. Set up appropriate values for RPC URLs, DB connection, contract addresses, etc.**
3. **Run with Gunicorn or Flask**
   ```bash
   python run.py
   # or
   gunicorn -b 0.0.0.0:8080 run:app
   ```
4. The API will be at [http://localhost:8080](http://localhost:8080).

---

## Docker Deployment

To run both frontend and backend in Docker containers:
```bash
cd backend
docker build -t essentialis-backend .
docker run --env-file .env -p 8080:8080 essentialis-backend
```

---

## Developer Tips
- **Frontend** uses Vite, React, Tailwind, and thirdweb/react for wallet integration.
- **Backend** is a Flask app using SQLAlchemy, Web3.py, and Postgres (use SQLite for local quickstart).
- Smart contract interactions are performed via backend Web3 calls; contract ABIs/addresses are in `config.py`.
- For database migrations, use `flask db` commands or SQLAlchemy's ORM.

---

## Contributing
- Fork, branch, and submit PRs via GitHub.
- Lint code with `npm run lint` or flake8.
- Write clear commit messages. See [Code Walkthrough](code-walkthrough.md).
