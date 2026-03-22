from . import shop_bp
from flask import render_template, request, redirect, url_for, flash
from flask_login import login_required, current_user
from extensions import db
from models import Inventory, CartItems, Orders, OrderItems

# lista produktów
@shop_bp.route('/')
@login_required
def index():
    products = Inventory.query.all()
    return render_template('shop/index.html', title='Sklep', products=products)

# dodawanie do koszyka
@shop_bp.route('/add-to-cart/<int:product_id>')
@login_required
def add_to_cart(product_id):
    product = Inventory.query.get_or_404(product_id)

    if product.quantity <= 0:
        return 'Produkt niedostępny'

    item = CartItems.query.filter_by(user_id=current_user.id, product_id=product_id).first()

    if item:
        item.quantity += 1
    else:
        item = CartItems(user_id=current_user.id, product_id=product_id, quantity=1)
        db.session.add(item)
    db.session.commit()

    return redirect(url_for('shop.cart'))

# koszyk
@shop_bp.route('/cart')
@login_required
def cart():
    items = CartItems.query.filter_by(user_id=current_user.id).all()
    total = sum(item.product.price_pln * item.quantity for item in items)

    return render_template('shop/cart.html', title='Koszyk', items=items, total=total)

# usuwanie z koszyka
@shop_bp.route('/remove-from-cart/<int:product_id>')
@login_required
def remove_from_cart(product_id):
    item = CartItems.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    if item:
        db.session.delete(item)
        db.session.commit()
    return redirect(url_for('shop.cart'))

# złóż zamówienie
@shop_bp.route('/checkout')
@login_required
def checkout():
    items = CartItems.query.filter_by(user_id=current_user.id).all()

    if not items:
        return 'Koszyk jest pusty'

    total = 0
    order = Orders(user_id=current_user.id, total_price=0)
    db.session.add(order)
    db.session.flush()

    for item in items:
        if item.product.quantity < item.quantity:
            return f'Za mało produktu {item.product.name}'

        item.product.quantity -= item.quantity
        subtotal = item.product.price_pln * item.quantity
        total += subtotal
        order_item = OrderItems(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price_pln
        )
        db.session.add(order_item)

    order.total_price = total

    # czyszczenie koszyka
    for item in items:
        db.session.delete(item)

    db.session.commit()

    return redirect(url_for('shop.index'))

@shop_bp.route('/orders')
@login_required
def orders():
    orders = (
        Orders.query.filter_by(user_id=current_user.id)
        .order_by(Orders.created_at.desc())
        .all()
    )

    order_ids = [o.id for o in orders]
    items = []
    if order_ids:
        items = (
            OrderItems.query
            .filter(OrderItems.order_id.in_(order_ids))
            .order_by(OrderItems.id.desc(), OrderItems.order_id.asc())
            .all()
        )

    product_ids = sorted({i.product_id for i in items})
    products = []
    if product_ids:
        products = Inventory.query.filter(Inventory.id.in_(product_ids)).all()
    products_by_id = {p.id: p for p in products}
    items_by_order = {o.id: [] for o in orders}
    for i in items:
        items_by_order.setdefault(i.order_id, []).append(i)

    return render_template(
        'shop/orders.html',
        orders=orders,
        items_by_order=items_by_order,
        products_by_id=products_by_id
    )