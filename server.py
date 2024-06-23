from datetime import datetime, timedelta
from flask import Flask, request, jsonify
import pandas as pd
import os
from rtree.index import Index
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)


def bounding_box_calculator(latitude, longitude, distance):
    latitude = float(latitude)
    longitude = float(longitude)
    distance = float(distance)
    radius = 3958.8
    lat_rad = latitude * (math.pi / 180)
    lon_rad = longitude * (math.pi / 180)
    d_rad = distance / (2 * radius)

    lat_min = lat_rad - d_rad
    lat_max = lat_rad + d_rad
    lon_min = lon_rad - d_rad
    lon_max = lon_rad + d_rad

    lat_min_deg = lat_min * (180 / math.pi)
    lat_max_deg = lat_max * (180 / math.pi)

    lon_min_deg = lon_min * (180 / math.pi)
    lon_max_deg = lon_max * (180 / math.pi)

    return lon_min_deg, lat_min_deg, lon_max_deg, lat_max_deg


@app.route('/get_data', methods=['GET'])
def get_data():
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    date = request.args.get('date')

    time = date.split(' ')[1]
    date = date.split(' ')[0]

    air_quality_data = pd.read_csv('./results/air_quality.csv')

    air_quality_data['Date'] = pd.to_datetime(
        air_quality_data['UTC'], format='%Y-%m-%dT%H:%M')
    air_quality_data['Time'] = pd.to_datetime(
        air_quality_data['UTC'], format='%Y-%m-%dT%H:%M')
    air_quality_data['Time'] = air_quality_data['Time'].dt.hour

    bbox = bounding_box_calculator(lat, lon, 10)
    minX = bbox[0]
    minY = bbox[1]
    maxX = bbox[2]
    maxY = bbox[3]

    filtered_data = air_quality_data[(air_quality_data['Latitude'] >= minY) & (air_quality_data['Latitude'] <= maxY) & (
        air_quality_data['Longitude'] >= minX) & (air_quality_data['Longitude'] <= maxX)]

    filtered_data = filtered_data[filtered_data['Date'] == date]

    end_hour = int(time.split(':')[0])
    start_hour = end_hour - 1

    filtered_data = filtered_data.to_dict(orient='records')

    pm25_data = []
    pm10_data = []

    for data in filtered_data:
        if data['Parameter'] == 'PM2.5':
            pm25_data.append(data)
        elif data['Parameter'] == 'PM10':
            pm10_data.append(data)

    # get only the unique 'AQI' values
    pm25_data = list({each['AQI']: each for each in pm25_data}.values())
    pm10_data = list({each['AQI']: each for each in pm10_data}.values())

    final_data = {
        'PM2.5': pm25_data,
        'PM10': pm10_data
    }

    return jsonify(final_data)


if __name__ == '__main__':
    app.run(debug=True)
