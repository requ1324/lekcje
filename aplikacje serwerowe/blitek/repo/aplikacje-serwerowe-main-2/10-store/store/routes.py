from flask import render_template, url_for, redirect, request, flash
import pandas as pd
from flask_login import login_required

from . import store_bp
from . forms import AddProductForm
from extensions import db
from models import Inventory

@store_bp.route('/', methods=['GET'])
@login_required
def index():
    add_product_form = AddProductForm()
    edit_product_form = AddProductForm()
    page = request.args.get('page', 1, type=int)
    per_page = 20
    search = request.args.get('search', '').strip()
    query = Inventory.query
    if search:
        query = query.filter(
            Inventory.name.ilike(f'%{search}%') |
            Inventory.symbol.ilike(f'%{search}%') |
            Inventory.category.ilike(f'%{search}%') |
            Inventory.brand.ilike(f'%{search}%') |
            Inventory.model.ilike(f'%{search}%')
        )
    pagination = query.order_by(Inventory.id).paginate(page=page, per_page=per_page)
    records = pagination.items
    return render_template('store/index.html', title='Magazyn', records=records, pagination=pagination, add_product_form=add_product_form, search=search, edit_product_form=edit_product_form)

@store_bp.route('/import-data', methods=['GET', 'POST'])
@login_required
def import_data():
    # pobieranie pliku z formularza
    file = request.files.get('file')
    if not file:
        flash('Nie wybrano pliku.', 'danger')
        return redirect(url_for('store.index'))

    # wczytywanie zawartości pliku csv
    try:
        df = pd.read_csv(file)
    except Exception as e:
        flash(f'Błąd wczytywania pliku: {e}.', 'danger')
        return redirect(url_for('store.index'))

    # usuń stare rekordy z bazy
    db.session.query(Inventory).delete()

    # dodawanie nowych rekordów
    for _, row in df.iterrows():
        item = Inventory(
            id=int(row['id']),
            symbol=row['symbol'],
            name=row['name'],
            category=row['category'],
            brand=row['brand'],
            model=row['model'],
            quantity=int(row['quantity']),
            weight_kg=float(row['weight_kg']),
            price_pln=float(row['price_pln']),
            inventory_value_pln=float(row['inventory_value_pln'])
        )
        db.session.add(item)
    db.session.commit()

    flash('Dane zostały zaimportowane pomyślnie.', 'success')
    return redirect(url_for('store.index'))

@store_bp.route('/add-product', methods=['POST'])
@login_required
def add_product():
    if request.method == 'POST':
        # pobieranie danych z formularza
        symbol = request.form.get('symbol')
        name = request.form.get('name')
        category = request.form.get('category')
        brand = request.form.get('brand')
        model = request.form.get('model')
        quantity = request.form.get('quantity', type=int)
        weight_kg = request.form.get('weight_kg', type=float)
        price_pln = request.form.get('price_pln', type=float)

        # obliczanie wartości magazynowej
        inventory_value_pln = quantity * price_pln

        # utworzenie obiektu i zapis do bazy
        new_item = Inventory(
            symbol=symbol,
            name=name,
            category=category,
            brand=brand,
            model=model,
            quantity=quantity,
            weight_kg=weight_kg,
            price_pln=price_pln,
            inventory_value_pln=inventory_value_pln
        )
        db.session.add(new_item)
        db.session.commit()

        flash('Produkt został dodany pomyślnie.', 'success')
        return redirect(url_for('store.index'))