from flask import Flask, render_template, redirect, url_for

from flask_bs4 import Bootstrap

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
import secrets

app = Flask(__name__)
bootstrap = Bootstrap(app)

app.config['SECRET_KEY'] = secrets.token_urlsafe(32)

users = []
userId = 1

class StudentForm(FlaskForm):
    imie= StringField('Imie', validators=[DataRequired()], render_kw={"placeholder": "Imie"})
    nazwisko = StringField('Nazwisko', validators=[DataRequired()], render_kw={"placeholder": "Nazwisko"})
    klasa = StringField('Klasa', validators=[DataRequired()], render_kw={"placeholder": "Klasa"})
    submit = SubmitField('Dodaj')


@app.route('/add_student', methods=['GET', 'POST'])
def add_student():
    add_form = StudentForm()
    if add_form.validate_on_submit():
        users.append({'id': userId, 'first_name': add_form.imie.data, 'last_name': add_form.nazwisko.data, 'class_name': add_form.klasa.data})
        return redirect(url_for('index'))
    return render_template('add_student.html', title="Dodaj Ucznia", add_form=add_form)

@app.route('/del_user/<int:id>')
def del_user(id):
    for i, d in enumerate(users):
        if d['id'] == id:
            del users[i]
            return redirect(url_for('index'))


@app.route('/')
def index():
    return render_template("index.html", title="Uczniowie", users=users)

if __name__ == '__main__':
    app.run(debug=True)
