from extensions import db
from flask_login import UserMixin
from datetime import datetime

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    def is_authenticated(self):
        return True

class Inventory(db.Model):
    # __bind_key__ = 'inventory'
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

class CartItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('inventory.id'))
    quantity = db.Column(db.Integer, default=1)
    product = db.relationship('Inventory')

class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    total_price = db.Column(db.Float)

class OrderItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    product_id = db.Column(db.Integer)
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float)