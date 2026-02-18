import json
import numbers
import os
from tokenize import Number

from dominate.svg import switch
from flask import Flask, render_template, request
from flask_bs4 import Bootstrap
from sqlalchemy import case

app = Flask(__name__)
Bootstrap(app)

USERS_FILE = 'person.json'
def load_data():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

@app.route("/", methods=['GET'])
def index():
    userFilter = request.args.get('filter')
    data = load_data()

    # average value + unique
    count = 0
    value = 0
    unique = []

    for item in data:
        count += 1
        value += float(item['salary'][1:].replace(',','.'))
        if item['size'] not in unique:
            unique.append(item['size'])

    avg = round(value / count, 2)


    ## filter

    # max/min
    def sorter(i):
        return float(i['salary'][1:].replace(',', '.'))

    if userFilter == "MAX":
        data.sort(key=sorter, reverse=True)
        data = [data[1]]

    if userFilter == "MIN":
        data.sort(key=sorter, reverse=False)
        data = [data[1]]

    def filterArray(i):
        return i['size'] == userFilter

    # size
    if userFilter in unique:
        data = filter(filterArray, data)

    return render_template('index.html', list=data, avg=format(avg, ','), count=count, unique=unique, filter=userFilter)

if __name__ == '__main__':
    app.run(debug=True, port=5001)