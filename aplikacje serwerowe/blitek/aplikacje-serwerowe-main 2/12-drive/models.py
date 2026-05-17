from datetime import datetime
from flask_login import UserMixin
from extensions import db, bcrypt

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, index=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    # rola użytkownika
    role = db.Column(db.String(32), nullable=False, default='user', index=True)

    # limit miejsca w bajtach
    quota_bytes = db.Column(db.BigInteger, nullable=False)

    # status konta
    active = db.Column(db.Boolean, nullable=False, default=True)

    # data i godzina rejestracji
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # relacje do innych modeli
    # ...

    def set_password(self, password: str) -> None:
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)

    @property
    def is_admin(self) -> bool:
        return self.role == 'admin'

    @property
    def is_active(self) -> bool:
        return bool(self.active)
