from flask import Flask, render_template
from flask_bs4 import Bootstrap

app = Flask(__name__)
bootstrap = Bootstrap(app)

users = [
    {'id': 1,'name': 'Tomasz', 'email': 'tomasz@poczta.pl'},
    {'id': 2,'name': 'Emilia', 'email': 'emilia@poczta.pl'},
    {'id': 3,'name': 'Wiktor', 'email': 'wiktor@poczta.pl'}
]

@app.route('/')
def index():
    return render_template('index.html', title='Home', users=users)

@app.route('/user/<int:id>')
def user(id):
    user = next((user for user in users if user['id'] == id), None)
    return render_template('user.html', title='Profil użytkownika', user=user)

if __name__ == '__main__':
    app.run(debug=True)