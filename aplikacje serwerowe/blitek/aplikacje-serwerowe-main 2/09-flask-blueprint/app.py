import os
import secrets
from flask import Flask
from flask_bs4 import Bootstrap

from extensions import db, login_manager, bcrypt
from models import Users

from main.routes import main_bp
from auth.routes import auth_bp

def create_app():
    app = Flask(__name__)
    Bootstrap(app)

    # --- konfiguracja ---
    app.config['SECRET_KEY'] = secrets.token_urlsafe(64)

    # --- konfiguracja katalogu i pliku bazy danych ---
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATA_DIR = os.path.join(BASE_DIR, 'data')
    os.makedirs(DATA_DIR, exist_ok=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(DATA_DIR, 'users.db')

    # --- inicjalizacja rozszerzeń ---
    db.init_app(app)
    login_manager.init_app(app)
    bcrypt.init_app(app)

    # --- rejestracja blueprint ---
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')

    # --- rejestracja loadera użytkowników
    @login_manager.user_loader
    def load_user(user_id):
        return Users.query.get(int(user_id))

    return app

# --- uruchomienie aplikacji ---
if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all() # tworzenie tabel w bazie SQLite
    app.run(debug=True)