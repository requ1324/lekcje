from flask import Flask, render_template, redirect, url_for, session, flash
from flask_bs4 import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired
import secrets
import json
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_urlsafe(32)
bootstrap = Bootstrap(app)

USER_FILE = 'users.json'

# -------------------- JSON handling --------------------

def load_users():
    if not os.path.exists(USER_FILE):
        return {}
    with open(USER_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(USER_FILE, 'w') as f:
        json.dump(users, f)

# -------------------- Forms --------------------

class LoginForm(FlaskForm):
    login = StringField('Login', validators=[DataRequired()], render_kw={"placeholder": "Podaj login"})
    password = PasswordField('Hasło', validators=[DataRequired()], render_kw={"placeholder": "Podaj hasło"})
    submit = SubmitField('Zaloguj')

class RegisterForm(FlaskForm):
    login = StringField('Login', validators=[DataRequired()], render_kw={"placeholder": "Podaj login"})
    password = PasswordField('Hasło', validators=[DataRequired()], render_kw={"placeholder": "Podaj hasło"})
    submit = SubmitField('Zarejestruj')

# -------------------- Routes --------------------

@app.route("/", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        users = load_users()
        username = form.login.data
        password = form.password.data
        if username in users and users[username] == password:
            session['user'] = username
            flash('Zalogowano pomyślnie', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Nieprawidłowy login lub hasło', 'danger')
    return render_template("login.html", title="Login", login_form=form)

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        users = load_users()
        username = form.login.data
        if username in users:
            flash('Użytkownik już istnieje', 'warning')
        else:
            users[username] = form.password.data
            save_users(users)
            flash('Rejestracja zakończona sukcesem. Możesz się teraz zalogować.', 'success')
            return redirect(url_for('login'))
    return render_template("register.html", title="Rejestracja", register_form=form)

@app.route("/dashboard")
def dashboard():
    if 'user' not in session:
        flash("Musisz się zalogować", "warning")
        return redirect(url_for('login'))
    return render_template("dashboard.html", title="Dashboard", user=session['user'])

@app.route("/logout")
def logout():
    session.pop('user', None)
    flash("Wylogowano pomyślnie", "info")
    return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(debug=True)
