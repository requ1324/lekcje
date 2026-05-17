from pathlib import Path

from flask import Flask
from flask_login import current_user

from config import Config
from extensions import db, bcrypt, csrf, login_manager, limiter
from models import User
from blueprints.auth import auth_bp
from blueprints.drive import drive_bp
from blueprints.admin import admin_bp

try:
    from flask_talisman import Talisman
except Exception:
    Talisman = None

def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # tworzenie katalogów dla bazy i przechowywania plików
    Path(app.config['DATA_PATH']).mkdir(parents=True, exist_ok=True)
    Path(app.config['STORAGE_ROOT']).mkdir(parents=True, exist_ok=True)

    # inicjalizacja rozszerzeń
    db.init_app(app)
    bcrypt.init_app(app)
    csrf.init_app(app)
    login_manager.init_app(app)

    if limiter is not None:
        limiter.init_app(app)
        # limity żądań na minutę dla każdego blueprinta
        limiter.limit('20/minute')(auth_bp)
        limiter.limit('60/minute')(drive_bp)
        limiter.limit('30/minute')(admin_bp)

    # konfiguracja bezpieczeństwa Talismana
    # force_https=True tylko na produkcji (HTTPS), lokalnie wyłączone
    if Talisman is not None:
        Talisman(
            app,
            force_https=not app.debug,
            content_security_policy={
                'default-src': ["'self'"],
                'script-src': ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
                'style-src': ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
            }
        )

    # tworzenie tabel w bazie danych
    with app.app_context():
        db.create_all()

    # ładowanie użytkownika po ID
    @login_manager.user_loader
    def load_user(user_id: str):
        return db.session.get(User, int(user_id))

    # rejestracja blueprintów
    app.register_blueprint(auth_bp)
    app.register_blueprint(drive_bp)
    app.register_blueprint(admin_bp)

    # procesor kontekstu udostępnia zmienne globalne we wszystkich szablonach
    @app.context_processor
    def inject_globals():
        return {'current_user': current_user}

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)