from flask import Flask, render_template, request
from flask_bs4 import Bootstrap
import requests

API_URL = "https://danepubliczne.imgw.pl/api/data/synop"

def get_imgw_data(station_name):
    try:
     response = requests.get(API_URL)
     
     if response.status_code == 200:
        data = response.json()
       
        for station in data:
            if station["stacja"].lower() == station_name.lower():
                return station
        return None
     else:  
         return "API_ERROR"
    except requests.exceptions.RequestException:
        return "API_ERROR"

def getCities():
    try:
        response = requests.get(API_URL)
        if response.status_code == 200:
            data = response.json()
            return sorted([station["stacja"] for station in data])
        else:
            return []
    except requests.exceptions.RequestException:
        return []
    
app = Flask(__name__)
Bootstrap(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    weather = None
    error = None

    cities = getCities()

    if request.method == 'POST':
        selected_city = request.form['city']
        result = get_imgw_data(selected_city)

        if result == "API_ERROR":
            error = "Blad polaczenia z api"
        elif result is None:
            error = "Brak danych dla wybranego miast"
        else:
            weather = result
    return render_template('index.html', weather=weather, cities=cities, error=error)


if __name__ == '__main__':
    app.run(debug=True)