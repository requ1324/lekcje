from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_bs4 import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, EmailField, PasswordField
from wtforms.validators import DataRequired, Email
import secrets

app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = secrets.token_urlsafe(32)

VALID_USERNAME = 'admin'
VALID_PASSWORD = '12345'

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

@app.route('/', methods=['GET', 'POST'])
def login():
    login_form = LoginForm()
    if login_form.validate_on_submit():
        if login_form.password.data == VALID_PASSWORD and login_form.username.data == VALID_USERNAME:
            session['username'] = login_form.username.data
            flash('Zalogowano pomyślnie', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Nieprawidłowa nazwa użytkownika lub hasło', 'danger')
    return render_template('login.html', title='Login', login_form=login_form)

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    user = session.get('username')
    if not user:
        flash('Musisz się zalogować, aby zobaczyć tę stronę', 'warning')
        return redirect(url_for('login'))
    return render_template('dashboard.html', title='Dashboard', user=user)

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.pop('username', None)
    flash('Wylogowano poprawnie', 'success')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)