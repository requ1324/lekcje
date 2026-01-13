from flask import Flask, render_template, redirect, url_for, session, flash
from flask_bs4 import Bootstrap
from flask_wtf import FlaskForm
from wtforms.fields.simple import PasswordField
from wtforms.validators import DataRequired
from wtforms import StringField, SubmitField
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_urlsafe(32)
bootstrap = Bootstrap(app)

VALID_USER = 'admin'
VALID_PASS = 'admin123'

class LoginForm(FlaskForm):
    login = StringField('Login',validators=[DataRequired()], render_kw={"placeholder": "Podaj login"})
    password = PasswordField('Haslo',validators=[DataRequired()], render_kw={"placeholder": "Podaj haslo"})
    submit = SubmitField('Login')

@app.route("/", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if form.login.data == VALID_USER and form.password.data == VALID_PASS:
            session['user'] = form.login.data
            flash('Zalogowano pomyslnie', 'success')

            return redirect(url_for('dashboard'))
        else:
            flash('Nieprawidlowe dane', 'danger')
    return render_template("login.html", title="Login", login_form=form)

@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():
    return render_template("dashboard.html", title="Dashboard")

@app.route("/logout", methods=["GET", "POST"])
def logout():
    return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(debug=True)
