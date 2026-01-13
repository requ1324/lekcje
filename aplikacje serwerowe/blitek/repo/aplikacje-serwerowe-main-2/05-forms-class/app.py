from flask import Flask, render_template, request, redirect, url_for
from flask_bs4 import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, EmailField
from wtforms.validators import DataRequired
import secrets

app = Flask(__name__)
bootstrap = Bootstrap(app)
app.config['SECRET_KEY'] = secrets.token_urlsafe(32)

class UserForm(FlaskForm):
    name = StringField('Imię', validators=[DataRequired()], render_kw={"placeholder": "Wpisz imię"})
    email = EmailField('Email', validators=[DataRequired()], render_kw={"placeholder": "Wpisz email"})
    submit = SubmitField('Dodaj')

users = []

@app.route('/', methods=['GET', 'POST'])
def index():
    user_form = UserForm()
    if user_form.validate_on_submit():
        users.append({'name': user_form.name.data, 'email': user_form.email.data})
        return redirect(url_for('index'))
    return render_template('index.html', title='Home', users=users, user_form=user_form)

if __name__ == '__main__':
    app.run(debug=True)