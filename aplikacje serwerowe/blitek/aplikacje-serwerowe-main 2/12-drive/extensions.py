from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect

try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
except Exception: # pozwla na uruchomienie aplikacji bez limitera
    Limiter = None
    get_remote_address = None

db = SQLAlchemy()
bcrypt = Bcrypt()
csrf = CSRFProtect()

login_manager = LoginManager()
login_manager.login_view = 'auth.login_get'
login_manager.login_message_category = 'warning'

# limiter - ograniczenie liczby żądań
limiter = None
if Limiter and get_remote_address:
    limiter = Limiter(key_func=get_remote_address)
