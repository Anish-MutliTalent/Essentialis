from app import create_app, db
from app.models import User  # Import models to ensure they are known to SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()


app = create_app()


@app.cli.command("init-admin")
def init_admin():
    """Initializes the default admin user."""
    admin_email = app.config.get('ADMIN_EMAIL')
    admin_password = os.environ.get('ADMIN_PASSWORD')

    if not admin_email:
        print("ADMIN_EMAIL not set in config.")
        return

    if User.query.filter_by(email=admin_email).first():
        print(f"Admin user with email {admin_email} already exists.")
        user = User.query.filter_by(email=admin_email).first()
        if not user.is_admin:
            user.is_admin = True
            print("Updated existing user to be admin.")
        if not user.otp_secret:
            user.generate_otp_secret()
            print(f"Generated OTP secret for admin. URI: {user.get_otp_uri()}")
            print(f"Manual Secret: {user.otp_secret}")
        db.session.commit()
        return

    admin_user = User(email=admin_email, is_admin=True)
    admin_user.set_password(admin_password)
    admin_user.generate_otp_secret()  # Generate OTP for admin
    db.session.add(admin_user)
    db.session.commit()
    print(f"Admin user {admin_email} created.")
    print(f"Please use an authenticator app with this URI: {admin_user.get_otp_uri()}")
    print(f"Or manually enter this secret: {admin_user.otp_secret}")
    print("IMPORTANT: Change the default password immediately after first login if set statically.")


if __name__ == '__main__':
    app.run(debug=True)  # debug=False for production
