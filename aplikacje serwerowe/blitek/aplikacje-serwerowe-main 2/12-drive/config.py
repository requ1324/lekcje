import os
from pathlib import Path
import secrets

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', secrets.token_urlsafe(32))

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATA_DIR = os.path.join(BASE_DIR, 'data')
    os.makedirs(DATA_DIR, exist_ok=True)

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///' + os.path.join(DATA_DIR, 'drive.db'))
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ścieżki do katalogów aplikacji
    DATA_PATH = Path(os.environ.get('DATA_PATH', 'data')).resolve()
    STORAGE_ROOT = DATA_PATH / 'storage'

    # maksymalny rozmiar pliku do wysłania (domyślnie 200MB)
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 200 * 1024 * 1024))

    # zabezpieczenie sesji
    SESSION_COOKIE_HTTPONLY = True # ochrona przed XSS
    SESSION_COOKIE_SAMESITE = 'Lax' # ochrona przed CSRF
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', '0') == '1' # tylko w protokole HTTPS

    # zabezpieczenie cookies 'remember me'
    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_SAMESITE = 'Lax'
    REMEMBER_COOKIE_SECURE = os.environ.get('REMEMBER_COOKIE_SECURE', '0') == '1'

    # czas wygaśnięcia tokena (1 godzina)
    WTF_CSRF_TIME_LIMIT = 3600

    # ---------------------------------------------------------------------------
    # TWORZENIE PIERWSZEGO ADMINISTRATORA
    # ---------------------------------------------------------------------------
    # 1. Ustaw własny token (opcjonalne, domyślnie: Qwerty123!):
    #       Windows:  set SETUP_TOKEN=TwojTajnyToken
    #       Linux/Mac: export SETUP_TOKEN=TwojTajnyToken
    #
    # 2. Uruchom serwer:
    #       flask --app app run --debug
    #
    # 3. Otwórz w przeglądarce:
    #       http://127.0.0.1:5000/setup?token=TwojTajnyToken
    #
    # Po utworzeniu konta endpoint /setup przestaje istnieć (zwraca 404).
    # ---------------------------------------------------------------------------
    SETUP_TOKEN = os.environ.get('SETUP_TOKEN', '')
