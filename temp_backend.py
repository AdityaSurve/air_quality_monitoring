from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import requests
import time

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/USC_AirNow'
db = SQLAlchemy(app)


class AQIData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    DateObserved = db.Column(db.String(50))
    HourObserved = db.Column(db.Integer)
    LocalTimeZone = db.Column(db.String(50))
    ReportingArea = db.Column(db.String(50))
    StateCode = db.Column(db.String(50))
    Latitude = db.Column(db.Float)
    Longitude = db.Column(db.Float)
    UserLatitude = db.Column(db.Float)
    UserLongitude = db.Column(db.Float)
    ParameterName = db.Column(db.String(50))
    AQI = db.Column(db.Integer)
    CategoryNumber = db.Column(db.Integer)
    CategoryName = db.Column(db.String(50))
    Timestamp = db.Column(db.DateTime)

    def __init__(self, DateObserved, HourObserved, LocalTimeZone, ReportingArea, StateCode, Latitude, Longitude, UserLatitude, UserLongitude, ParameterName, AQI, CategoryNumber, CategoryName, Timestamp):
        self.DateObserved = DateObserved
        self.HourObserved = HourObserved
        self.LocalTimeZone = LocalTimeZone
        self.ReportingArea = ReportingArea
        self.StateCode = StateCode
        self.Latitude = Latitude
        self.Longitude = Longitude
        self.UserLatitude = UserLatitude
        self.UserLongitude = UserLongitude
        self.ParameterName = ParameterName
        self.AQI = AQI
        self.CategoryNumber = CategoryNumber
        self.CategoryName = CategoryName
        self.Timestamp = Timestamp


journey_path = [
    (34.0522, -118.2437),  # Los Angeles, CA
    (37.7749, -122.4194),  # San Francisco, CA
    (47.6062, -122.3321),  # Seattle, WA
    (41.8781, -87.6298),   # Chicago, IL
    (40.7128, -74.0060),   # New York, NY
    (25.7617, -80.1918),   # Miami, FL
    (33.4484, -112.0740),  # Phoenix, AZ
    (29.7604, -95.3698),   # Houston, TX
    (39.7392, -104.9903),  # Denver, CO
    (32.7157, -117.1611),  # San Diego, CA
    (39.9526, -75.1652),   # Philadelphia, PA
    (30.2672, -97.7431),   # Austin, TX
    (32.7767, -96.7970),   # Dallas, TX
    (29.4241, -98.4936),   # San Antonio, TX
    (39.7684, -86.1581),   # Indianapolis, IN
    (38.9072, -77.0369),   # Washington, D.C.
    (42.3601, -71.0589),   # Boston, MA
    (36.1627, -86.7816),   # Nashville, TN
    (38.2527, -85.7585),   # Louisville, KY
    (35.2271, -80.8431),   # Charlotte, NC
    (36.1699, -115.1398),  # Las Vegas, NV
    (45.5152, -122.6784),  # Portland, OR
    (27.9506, -82.4572),   # Tampa, FL
    (39.9612, -82.9988),   # Columbus, OH
    (35.1495, -90.0490),   # Memphis, TN
    (43.0389, -87.9065),   # Milwaukee, WI
    (44.9778, -93.2650),   # Minneapolis, MN
    (35.4676, -97.5164),   # Oklahoma City, OK
    (37.3382, -121.8863),  # San Jose, CA
    (33.7490, -84.3880),   # Atlanta, GA
    (39.1031, -84.5120),   # Cincinnati, OH
    (36.7394, -119.7848),  # Fresno, CA
    (27.9942, -82.4513),   # St. Petersburg, FL
    (35.0844, -106.6504),  # Albuquerque, NM
    (42.3314, -83.0458),   # Detroit, MI
    (36.1745, -115.1372),  # Henderson, NV
    (29.6516, -82.3248),   # Gainesville, FL
    (33.7488, -84.3885),   # Athens, GA
    (40.7608, -111.8910),  # Salt Lake City, UT
    (32.7357, -97.1081),   # Arlington, TX
    (36.0726, -79.7910),   # Greensboro, NC
    (36.1867, -94.1288),   # Fayetteville, AR
    (41.4993, -81.6944),   # Cleveland, OH
    (30.3322, -81.6557),   # Jacksonville, FL
    (36.1539, -95.9928),   # Tulsa, OK
    (39.0997, -94.5786),   # Kansas City, MO
    (33.4255, -111.9400),  # Tempe, AZ
    (35.5951, -82.5515),   # Asheville, NC
    (32.7765, -79.9311),   # Charleston, SC
    (43.0731, -89.4012),   # Madison, WI
    (44.9773, -103.7716),  # Rapid City, SD
    (47.6588, -117.4260),  # Spokane, WA
    (32.2226, -110.9747),  # Tucson, AZ
    (30.6954, -88.0399),   # Mobile, AL
]


counter = 0


def get_current_location():
    global counter
    location = journey_path[counter]
    counter = (counter + 1) % len(journey_path)
    return location


def fetch_aqi_data(lat, lon):
    url = f"https://www.airnowapi.org/aq/observation/latLong/current/?latitude={lat}&longitude={lon}&distance=30&format=application/json&api_key=2227FB9E-63AE-497B-A911-03E91430AEA1"
    try:
        response = requests.get(url)
        data = response.json()
        aqi_data = []
        for item in data:
            if 'AQI' in item:
                aqi_data.append(AQIData(
                    DateObserved=item['DateObserved'],
                    HourObserved=item['HourObserved'],
                    LocalTimeZone=item['LocalTimeZone'],
                    ReportingArea=item['ReportingArea'],
                    StateCode=item['StateCode'],
                    Latitude=item['Latitude'],
                    Longitude=item['Longitude'],
                    UserLatitude=lat,
                    UserLongitude=lon,
                    ParameterName=item['ParameterName'],
                    AQI=item['AQI'],
                    CategoryNumber=item['Category']['Number'],
                    CategoryName=item['Category']['Name'],
                    Timestamp=datetime.now()
                ))
        return aqi_data
    except Exception as e:
        print(f"Error fetching or parsing AQI data: {e}")
        return []


def main():
    while True:
        lat, lon = get_current_location()
        aqi_data = fetch_aqi_data(lat, lon)
        if aqi_data:
            db.session.add_all(aqi_data)
            db.session.commit()
            print(f"AQI data saved.")
        time.sleep(60)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        main()
