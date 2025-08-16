import hashlib
import hmac
import time
import os
from dotenv import load_dotenv

load_dotenv()


def generate_admin_username_challenge():
    # Simple example: HMAC of the current time slot with shared secret
    # Admin client-side code would need to generate the same
    secret = os.environ.get('ADMIN_SHARED_SECRET_FOR_USERNAME')
    time_slot = str(int(time.time() // 300))  # Changes every 5 minutes
    return hmac.new(secret.encode(), time_slot.encode(), hashlib.sha256).hexdigest()[:16]


print(generate_admin_username_challenge())
