from . import db
from werkzeug.security import generate_password_hash, check_password_hash
import pyotp  # For OTP
import time
from datetime import datetime, UTC


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), index=True, unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=True)
    wallet_address = db.Column(db.String(42), unique=True, nullable=True)  # Polygon address

    otp_secret = db.Column(db.String(32), nullable=True)
    last_otp_timestamp = db.Column(db.BigInteger, nullable=True)

    is_admin = db.Column(db.Boolean, default=False)

    # New fields for user details
    name = db.Column(db.String(100), nullable=True)
    age = db.Column(db.Integer, nullable=True)
    # For 'address', using a Text type in case it's long (e.g., full street address)
    physical_address = db.Column(db.Text, nullable=True)  # Renamed to avoid conflict with wallet 'address'
    gender = db.Column(db.String(20), nullable=True)  # e.g., "male", "female", "other"
    profile_picture_url = db.Column(db.String(255), nullable=True)  # Any random pfp

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not self.password_hash:
            return False
        return check_password_hash(self.password_hash, password)

    def generate_otp_secret(self):
        self.otp_secret = pyotp.random_base32()

    def get_otp_uri(self):
        if not self.otp_secret or not self.email:
            return None
        return pyotp.totp.TOTP(self.otp_secret).provisioning_uri(name=self.email, issuer_name="YourDAppName")

    def verify_otp(self, otp_code, window=1):
        if not self.otp_secret:
            return False
        totp_current = pyotp.TOTP(self.otp_secret)
        current_timestamp_slot = int(time.time() // totp_current.interval)

        if self.last_otp_timestamp and self.last_otp_timestamp >= (current_timestamp_slot - window):
            return False

        is_valid = totp_current.verify(otp_code, valid_window=window)
        if is_valid:
            self.last_otp_timestamp = current_timestamp_slot
        return is_valid


class ActionLog(db.Model):  # For indexed action logger events
    id = db.Column(db.Integer, primary_key=True)
    log_id_onchain = db.Column(db.BigInteger, index=True, nullable=True)  # If your contract emits a logId
    user_address = db.Column(db.String(42), index=True)
    action = db.Column(db.String(255))
    details = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True)
    block_number = db.Column(db.BigInteger)
    tx_hash = db.Column(db.String(66), unique=True)


class AdminLoginToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.Text, unique=True, index=True)
    username_challenge = db.Column(db.String(128))  # The dynamic username expected for this token
    expires_at = db.Column(db.DateTime)
    used = db.Column(db.Boolean, default=False)


class AllowedEmail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, index=True, nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.now(UTC))
    added_by = db.Column(db.String(120), nullable=True) # Admin email or system
    is_registered = db.Column(db.Boolean, default=False) # True if they have completed registration

class Waitlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, index=True, nullable=True) # Optional if they use social handle
    contact_info = db.Column(db.String(255), nullable=False) # LinkedIn/Whatsapp/TG handle
    platform = db.Column(db.String(50), nullable=False) # 'linkedin', 'whatsapp', 'telegram'
    status = db.Column(db.String(20), default='pending') # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))

class ReferralCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, index=True, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))
    expires_at = db.Column(db.DateTime, nullable=True)
    max_uses = db.Column(db.Integer, default=1) # 1 for one-time, -1 for infinite
    used_count = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)

class UserReferral(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    referral_code = db.Column(db.String(50), unique=True, index=True, nullable=False)
    landing_count = db.Column(db.Integer, default=0)       # visits to /?ref=code
    waitlist_count = db.Column(db.Integer, default=0)       # waitlist signups via this ref
    signup_list = db.Column(db.Text, default='[]')          # JSON array of email strings
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))
