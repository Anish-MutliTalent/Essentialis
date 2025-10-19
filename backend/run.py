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
        user = User.query.filter_by(email=admin_email).first()
        if not user.is_admin:
            user.is_admin = True
        if not user.otp_secret:
            user.generate_otp_secret()
        db.session.commit()
        return

    admin_user = User(email=admin_email, is_admin=True)
    admin_user.set_password(admin_password)
    admin_user.generate_otp_secret()  # Generate OTP for admin
    db.session.add(admin_user)
    db.session.commit()


if __name__ == '__main__':
    app.run(debug=False)  # debug=False for production
