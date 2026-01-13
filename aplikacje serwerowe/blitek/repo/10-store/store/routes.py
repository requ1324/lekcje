from flask import render_template, url_for, redirect, request, flash
import pandas as pd
from . import store_bp
from . forms import AddProductForm
from extensions import db
from models import Inventory

@store_bp.route('/')
def index():
    add_product_form = AddProductForm()
    page = request.args.get('page', 1, type=int)
    per_page = 20
    pagination = Inventory.query.order_by(Inventory.id).paginate(page=page, per_page=per_page)
    records = pagination.items
    return render_template('store/index.html', title='Magazyn', records=records, pagination=pagination, add_product_form=add_product_form)

@store_bp.route('/import-data', methods=['GET', 'POST'])
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