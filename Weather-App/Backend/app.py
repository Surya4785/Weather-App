from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# OpenWeather API setup (Replace with your API key)
API_KEY = "1c217b554320ce241d0cc2c7b8daaf41"

def get_weather_data_for_city(city):
    geo_url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    geo_response = requests.get(geo_url)
    if geo_response.status_code != 200:
        return None

    geo_data = geo_response.json()
    if "name" not in geo_data:
        return None

    lat, lon = geo_data["coord"]["lat"], geo_data["coord"]["lon"]
    forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    forecast_response = requests.get(forecast_url)

    if forecast_response.status_code != 200:
        return None

    forecast_data = forecast_response.json()
    temperature_data = [forecast["main"]["temp"] for forecast in forecast_data["list"][:5]]

    return {
        "city": geo_data["name"],
        "day": list(range(1, len(temperature_data) + 1)),
        "temperature": temperature_data
    }

def perform_linear_regression(city):
    weather_data = get_weather_data_for_city(city)
    if not weather_data:
        return None, "City not found or data fetch failed"

    df = pd.DataFrame(weather_data)
    X = df["day"].values.reshape(-1, 1)
    y = df["temperature"].values

    model = LinearRegression()
    model.fit(X, y)
    next_day = [[len(df) + 1]]
    prediction = model.predict(next_day)[0]

    return prediction, weather_data

@app.route('/api/analysis', methods=['GET'])
def get_analysis():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": True, "message": "City parameter is required"}), 400

    prediction, weather_data = perform_linear_regression(city)
    if prediction is None:
        return jsonify({"error": True, "message": weather_data}), 404

    return jsonify({
        "message": "Analysis complete",
        "prediction": f"{prediction:.2f}°C",
        "days": weather_data["day"],
        "temperature": weather_data["temperature"]
    })

if __name__ == '__main__':
    app.run(debug=True)
