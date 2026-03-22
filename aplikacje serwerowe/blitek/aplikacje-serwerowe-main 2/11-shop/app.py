import os
import secrets
from flask import Flask
from flask_bs4 import Bootstrap

from extensions import db, login_manager, bcrypt
from models import Users

from main.routes import main_bp
from auth.routes import auth_bp
from store.routes import store_bp
from shop.routes import shop_bp

def create_app():
    app = Flask(__name__)
    Bootstrap(app)

    # --- konfiguracja ---
    app.config['SECRET_KEY'] = secrets.token_urlsafe(64)

    # --- konfiguracja katalogu i pliku bazy danych ---
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATA_DIR = os.path.join(BASE_DIR, 'data')
    os.makedirs(DATA_DIR, exist_ok=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(DATA_DIR, 'inventory.db')
    # app.config['SQLALCHEMY_BINDS'] = {
    #     'inventory': 'sqlite:///' + os.path.join(DATA_DIR, 'inventory.db')
    # }
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # --- inicjalizacja rozszerzeń ---
    db.init_app(app)
    login_manager.init_app(app)
    bcrypt.init_app(app)

    # --- rejestracja blueprint ---
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(store_bp, url_prefix='/store')
    app.register_blueprint(shop_bp, url_prefix='/shop')

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
    app.run(debug=True, port=5001)