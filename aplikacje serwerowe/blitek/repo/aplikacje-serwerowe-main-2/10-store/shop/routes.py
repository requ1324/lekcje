from . import shop_bp
from flask import render_template, url_for, redirect, request, flash
from flask_login import login_required, current_user
from extensions import db
from models import Inventory

@shop_bp.route('/') 
@login_required
def index():
    products = Inventory.query.all()
    return render_template('index.html', title='Sklep', products=products)

@shop_bp.route('/add-to-cart/<int:product_id>')
@login_required
def add_to_cart(product_id):
    product = Inventory.query.get_or_404(product_id)
    
    if product.quantity <= 0:
        return "Produkt niedostepny"
    item = CartItems.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if item:
        item.quantity += 1
    else:
        item = CartItems(user_id=current_user.id, product_id=product_id, quantity=1)  
        db.session.add(item)
    db.session.commit()

    return redirect(url_for('shop.cart'))


@shop_bp.route('/cart')
@login_required
def cart():
    items = CartItems.query.filter_by(user_id=current_user.id).all()
    total = sum(item.product.price_pln * item.quantity for item in items)
    return render_template('cart.html', title='Koszyk', items=items, total=total)