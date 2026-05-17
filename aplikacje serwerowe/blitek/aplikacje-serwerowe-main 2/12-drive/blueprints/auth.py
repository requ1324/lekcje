from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_user, logout_user
from sqlalchemy import select

from extensions import db
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.get('/login')
def login_get():
    return render_template('login.html', title='Logowanie')

@auth_bp.post('/login')
def login_post():
    email = request.form.get('email', '').strip()
    password = request.form.get('password', '')
    user = db.session.scalar(select(User).where(User.email == email))
    if user is None or not user.check_password(password) or not user.is_active:
        flash('Nieprawidłowy e-mail lub hasło.', 'danger')
        return redirect(url_for('auth.login_get'))
    login_user(user, remember=bool(request.form.get('remember')))
    return redirect(url_for('drive.dashboard'))

@auth_bp.post('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth.login_get'))
@auth_bp.post("/setup")
def setup_post():
    if db.session.query(User.id).limit(1).first() is not None:
        abort(404)
    setup_token = (request.args.get('token') or "").strip()
    if not current_app.config.get['SETUP_TOKEN']:
        abort(403)
    