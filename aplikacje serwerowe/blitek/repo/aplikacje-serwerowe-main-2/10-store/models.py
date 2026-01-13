from flask_login import UserMixin
from extensions import db

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    def is_authenticated(self):
        return True

class Inventory(db.Model):
    __bind_key__ = 'inventory'
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(50))
    name = db.Column(db.String(50))
    category = db.Column(db.String(50))
    brand = db.Column(db.String(50))
    model = db.Column(db.String(50))
    quantity = db.Column(db.Integer)
    weight_kg = db.Column(db.Float)
    price_pln = db.Column(db.Float)
    inventory_value_pln = db.Column(db.Float)