from flask import Flask, render_template, request, redirect, url_for
from flask_bs4 import Bootstrap

app = Flask(__name__)
bootstrap = Bootstrap(app)

users = []

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # pobieranie danych
        name = request.form['name']
        email = request.form.get('email')
        if name and email:
            users.append({'name': name, 'email': email})
        return redirect(url_for('index'))
    return render_template('index.html', title='Home', users=users)

if __name__ == '__main__':
    app.run(debug=True)