from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField, SubmitField
from wtforms.validators import DataRequired

class AddProductForm(FlaskForm):
    symbol = StringField('Symbol', validators=[DataRequired()])
    name = StringField('Nazwa', validators=[DataRequired()])
    category = StringField('Kategoria', validators=[DataRequired()])
    brand = StringField('Producent', validators=[DataRequired()])
    model = StringField('Model', validators=[DataRequired()])
    quantity = IntegerField('Ilość', validators=[DataRequired()])
    weight_kg = FloatField('Waga (kg)', validators=[DataRequired()])
    price_pln = FloatField('Cena jednostkowa', validators=[DataRequired()])
    submit = SubmitField('Dodaj')