import time
import sqlalchemy.exc
from flask import current_app, session
from . import db  # assuming this imports your SQLAlchemy instance

MAX_RETRIES = 3
RETRY_DELAY = 0.5  # seconds

def safe_query_get(model, pk):
    """Safely perform Model.query.get(pk) with auto-retry on connection loss."""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return db.session.get(model, pk)
        except sqlalchemy.exc.OperationalError as e:
            msg = str(e).lower()
            # Retry only if it's a recoverable SSL/connection error
            if "ssl connection has been closed" in msg or "server closed the connection" in msg:
                current_app.logger.warning(f"DB connection lost. Retrying ({attempt}/{MAX_RETRIES})...")
                db.session.rollback()
                time.sleep(RETRY_DELAY)
                continue
            raise  # Non-recoverable DB error, re-raise
        except Exception:
            raise  # Any other exception, re-raise immediately
    # If we exhausted retries
    raise sqlalchemy.exc.OperationalError("Persistent DB connection failure after retries", None, None)
