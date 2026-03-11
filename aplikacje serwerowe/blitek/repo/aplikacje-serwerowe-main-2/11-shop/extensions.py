from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Ta strona jest dostępna dla zalogowanych użytkowników!'
login_manager.login_message_category = 'danger'
bcrypt = Bcrypt()