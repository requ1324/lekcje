from flask import Flask, render_template

app = Flask(__name__)

users = [
    {'id': 1, 'name': 'Piotr', 'email': 'piotr@poczta.pl'},
    {'id': 2, 'name': 'Ewa', 'email': 'ewa@poczta.pl'},
    {'id': 3, 'name': 'Anna', 'email': 'anna@poczta.pl'},
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