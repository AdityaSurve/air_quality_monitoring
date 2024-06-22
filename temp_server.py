from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
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

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


@app.route('/aqi', methods=['GET'])
def get_aqi_data():
    data = db.session.query(AQIData).all()
    result = {}
    for datum in data:
        if datum.ParameterName not in result:
            result[datum.ParameterName] = []
        result[datum.ParameterName].append(datum.to_dict())
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
