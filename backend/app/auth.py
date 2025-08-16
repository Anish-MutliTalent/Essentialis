# app/auth.py
from flask import request, jsonify, session, current_app, url_for
from web3 import Web3  # IMPORT Web3
from web3.auto import w3 as w3_auto  # For signature verification (this w3_auto is a local instance)
from eth_account.messages import encode_defunct
import time
from datetime import datetime, timedelta, UTC
import secrets
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature

# Import from your app modules
from . import db  # Assuming db is in app/__init__.py
from .models import User, AdminLoginToken  # IMPORT User and AdminLoginToken


from .admin import generate_admin_username_challenge


def register_user_email():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    wallet_address = data.get('walletAddress')

    if not email or not password or not wallet_address:
        return jsonify({"error": "Missing email, password, or wallet address"}), 400
    if User.query.filter_by(email=email).first() or User.query.filter_by(wallet_address=wallet_address).first():
        return jsonify({"error": "User already exists"}), 400

    user = User(email=email, wallet_address=wallet_address)
    user.set_password(password)
    user.generate_otp_secret()  # Generate OTP secret at registration
    db.session.add(user)
    db.session.commit()

    otp_uri = user.get_otp_uri()
    return jsonify({
        "message": "User registered. Please set up OTP.",
        "email": user.email,
        "walletAddress": user.wallet_address,
        "otpSecret": user.otp_secret,  # Send secret for manual entry, or
        "otpUri": otp_uri
    }), 201


def login_user_email():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    otp_code = data.get('otpCode')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    if not user.otp_secret:  # OTP not set up
        return jsonify({"error": "OTP not set up for this account. Please complete registration."}), 403

    if not user.verify_otp(otp_code):
        return jsonify({"error": "Invalid OTP code"}), 401

    session['user_id'] = user.id
    session['wallet_address'] = user.wallet_address
    return jsonify({
        "message": "Login successful",
        "userId": user.id,
        "walletAddress": user.wallet_address,
        "isAdmin": user.is_admin
    }), 200


def metamask_login_challenge():
    # Client requests a message to sign
    nonce = secrets.token_hex(16)
    session['metamask_nonce'] = nonce
    # Message should be human-readable and specific to your dApp
    message = f"Please sign this message to log into YourDAppName. Nonce: {nonce}"
    return jsonify({"message_to_sign": message}), 200


def metamask_login_verify():
    data = request.get_json()
    wallet_address = data.get('walletAddress')
    signature = data.get('signature')
    original_message = data.get('originalMessage')  # Client sends back the message it signed

    if not wallet_address or not signature or not original_message:
        return jsonify({"error": "Missing walletAddress, signature, or originalMessage"}), 400

    # Verify the nonce from the message if it was included
    expected_nonce = session.pop('metamask_nonce', None)
    if not expected_nonce or expected_nonce not in original_message:
        current_app.logger.warning("MetaMask login: Nonce mismatch or missing.")
        return jsonify({"error": "Invalid session or nonce."}), 403

    try:
        message_hash = encode_defunct(text=original_message)
        signer_address = w3_auto.eth.account.recover_message(message_hash, signature=signature)

        if Web3.to_checksum_address(signer_address) == Web3.to_checksum_address(wallet_address):
            user = User.query.filter_by(wallet_address=Web3.to_checksum_address(wallet_address)).first()
            if not user:  # First time MetaMask login, create a user entry
                user = User(wallet_address=Web3.to_checksum_address(wallet_address))
                # You might want to prompt them to link an email later if desired
                db.session.add(user)
                db.session.commit()

            session['user_id'] = user.id
            session['wallet_address'] = user.wallet_address

            return jsonify({
                "message": "MetaMask login successful",
                "userId": user.id,
                "walletAddress": user.wallet_address,
                "isAdmin": user.is_admin
            }), 200
        else:
            return jsonify({"error": "Signature verification failed"}), 401
    except Exception as e:
        current_app.logger.error(f"MetaMask login error: {e}")
        return jsonify({"error": "An error occurred during signature verification"}), 500


# --- Admin Login ---
def get_admin_login_link():
    # This should be a protected endpoint, perhaps only callable by a superuser or from a trusted IP
    # For simplicity, let's assume an admin already has some way to request this
    # (e.g., after an initial secure setup)

    # Check if the requester is authorized to get an admin link (e.g., specific IP, or pre-auth)
    # For this example, let's assume it's okay for now.

    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'], salt='admin-login-link')
    admin_username_challenge = generate_admin_username_challenge()

    token_data = {
        "purpose": "admin_login",
        "username_challenge": admin_username_challenge,
        "timestamp": time.time()
    }
    login_token_str = s.dumps(token_data)

    # Store the token and challenge in DB to validate later
    # (ensure only one valid token exists or handle expiration/cleanup)
    # Clear old tokens for the admin user
    AdminLoginToken.query.filter_by(used=False).delete()  # Or mark as expired

    new_db_token = AdminLoginToken(
        token=login_token_str,
        username_challenge=admin_username_challenge,
        expires_at=datetime.now(UTC) + timedelta(seconds=current_app.config['ADMIN_LOGIN_TOKEN_MAX_AGE'])
    )
    db.session.add(new_db_token)
    db.session.commit()

    # The dynamic link
    dynamic_link = url_for('main.admin_login_page', login_token=login_token_str, _external=True)
    return jsonify(
        {"dynamic_admin_login_link": dynamic_link, "admin_username_hint": "Use your generator for current username."})


def admin_login():
    data = request.get_json()
    token_str = data.get('login_token')
    dynamic_username = data.get('dynamic_username')
    email = data.get('email')  # Admin's registered email
    password = data.get('password')
    otp_code = data.get('otp_code')

    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'], salt='admin-login-link')
    try:
        token_data = s.loads(token_str, max_age=current_app.config['ADMIN_LOGIN_TOKEN_MAX_AGE'])
    except SignatureExpired:
        return jsonify({"error": "Admin login link has expired."}), 401
    except BadTimeSignature:
        return jsonify({"error": "Invalid admin login link."}), 401
    except Exception as e:
        return jsonify({"error": f"{e}"}), 401

    db_token = AdminLoginToken.query.filter_by(token=token_str).first()
    if not db_token or db_token.used or db_token.expires_at < datetime.now(UTC):
        return jsonify({"error": "Admin login token is invalid, used, or expired."}), 401

    if token_data.get("username_challenge") != dynamic_username:
        return jsonify({"error": "Invalid dynamic username"}), 401

    if token_data.get("purpose") != "admin_login":
        return jsonify({"error": "Invalid token purpose."}), 401

    # Verify the generated dynamic username on the server-side as well
    expected_admin_username = generate_admin_username_challenge()
    if dynamic_username != expected_admin_username or dynamic_username != db_token.username_challenge:
        # This check is redundant if token_data.get("username_challenge") == dynamic_username is done,
        # but good for defense in depth.
        return jsonify({"error": "Dynamic admin username mismatch."}), 401

    admin_user = User.query.filter_by(email=email, is_admin=True).first()
    if not admin_user:
        return jsonify({"error": "Admin account not found for this email."}), 403

    if not admin_user.check_password(password):
        return jsonify({"error": "Invalid admin password."}), 401

    if not admin_user.otp_secret:  # OTP not set up
        return jsonify({"error": "OTP not set up for admin account."}), 403

    if not admin_user.verify_otp(otp_code):
        return jsonify({"error": "Invalid admin OTP code."}), 401

    # Mark token as used
    db_token.used = True
    db.session.commit()

    session['user_id'] = admin_user.id
    session['wallet_address'] = admin_user.wallet_address  # Admin might have a wallet too
    session['is_admin'] = True
    return jsonify({"message": "Admin login successful"}), 200


def logout_user():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200
