from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_bs4 import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, EmailField, PasswordField
from wtforms.validators import DataRequired
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
import os
import json

app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = secrets.token_urlsafe(32)

USERS_FILE = os.path.join(os.getcwd(), 'users.json')

def load_users():
    """funkcja wczytuje użytkowników z pliku json"""
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_users(users):
    """funkcja zapisuje użytkownika do pliku json podczas rejestracji"""
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=4, ensure_ascii=False)

class RegisterForm(FlaskForm):
    email = EmailField('Login', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Rejestruj')

class LoginForm(FlaskForm):
    email = EmailField('Login', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Zaloguj')

@app.route('/register', methods=['GET', 'POST'])
def register():
    register_form = RegisterForm()
    if register_form.validate_on_submit():
        users = load_users()
        # sprawdzamy, czy użytkownik istnieje
        if any(u['email'] == register_form.email.data for u in users):
            flash('Użytkownik o takiej nazwie już istnieje!', 'warning')
            return redirect(url_for('register'))
        # zapisujemy nowego użytkownika
        new_user = {
            'email': register_form.email.data,
            'password': generate_password_hash(register_form.password.data)
        }
        users.append(new_user)
        save_users(users)
        flash('Rejestracja zakończona sukcesem! Możesz się teraz zalogować', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Rejestracja', register_form=register_form)

@app.route('/', methods=['GET', 'POST'])
def login():
    login_form = LoginForm()
    if login_form.validate_on_submit():
        users = load_users()
        user = next((u for u in users if u['email'] == login_form.email.data), None)
        if user and check_password_hash(user['password'], login_form.password.data):
            session['email'] = login_form.email.data
            flash('Zalogowano poprawnie!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Nieprawidłowa nazwa użytkownika lub hasło!', 'danger')
    return render_template('login.html', title='Logowanie', login_form=login_form)

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.pop('email', None)
    flash('Wylogowano poprawnie!', 'success')
    return redirect(url_for('login'))

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    user = session.get('email')
    if not user:
        flash('Musisz się zalogować, aby zobaczyć tę stronę!', 'warning')
        return redirect(url_for('login'))
    return render_template('dashboard.html', title='Dashboard', user=user)

if __name__ == '__main__':
    app.run(debug=True)