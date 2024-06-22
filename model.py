from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import csv
import gpxpy
from datetime import datetime
from xml.etree import ElementTree
import requests
import math
import pandas as pd

class AirQualityExtractor:
    def __init__(self):
        self.driver = None
        self.service = None
        self.wait_time = 5
        self.base_url = 'https://www.airnowapi.org/aq/observation/latLong/historical'

    def create_driver(self):
        self.service = Service(r'C://Users/Aditya/Downloads/msedgedriver.exe')
        self.driver = webdriver.Edge(service=self.service)

    def close_driver(self):
        self.driver.quit()

    def navigate_to_url(self, url):
        self.driver.get(url)

    def sleep(self):
        time.sleep(self.wait_time)

    def parse_output_text(self, output_text):
        lines = output_text.split('\n')
        headers = [header.replace('"', '') for header in lines[0].split(',')]
        data = []
        for line in lines[1:]:
            values = [value.replace('"', '') for value in line.split(',')]
            data.append(dict(zip(headers, values)))
        return data

    def write_to_csv(self, data):
        csv_file_path = './results/air_quality.csv'
        csv_header = ["Latitude",
                      "Longitude",
                      "UTC",
                      "Parameter",
                      "Unit",
                      "AQI",
                      "Category"]
        try:
            file_exists = os.path.isfile(csv_file_path)
            with open(csv_file_path, 'a', newline='') as csv_file:
                writer = csv.DictWriter(csv_file, fieldnames=csv_header)
                if not file_exists:
                    writer.writeheader()
                writer.writerows(data)
                print("Data written to CSV successfully.")
        except Exception as e:
            print("Error writing to CSV:", e)

    def api_data(self, date, bounding_box):
        hour_holder = date.split(' ')[1]
        hour = hour_holder.split(':')[0]
        date = date.split(' ')[0]
        bounding_box = bounding_box.replace('[', '')
        bounding_box = bounding_box.replace(']', '')
        bounding_box = bounding_box.split(',')
        bounding_box = [float(x) for x in bounding_box]
        print(f'Date: {date}')
        print(f'Hour: {hour}')
        print(f'Bounding Box: {bounding_box}')
        url = f'https://www.airnowapi.org/aq/data/?startDate={date}T{hour}&endDate={date}T{hour}&parameters=PM25,PM10&BBOX={bounding_box[0]},{bounding_box[1]},{bounding_box[2]},{bounding_box[3]}&dataType=A&format=application/json&verbose=0&monitorType=0&includerawconcentrations=0&API_KEY=2227FB9E-63AE-497B-A911-03E91430AEA1'
        print("Url: ", url)
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            self.write_to_csv(data)
        else:
            print("Failed to get data from API")

    def gpx_processor(self, distance):
        csv_file_path = './results/gpx_data.csv'
        data = pd.read_csv(csv_file_path)
        data = data.head(400)
        for index, row in data.iterrows():
            distance = distance
            date = row['time']
            bounding_box = row['bbox']
            self.api_data(date, bounding_box)
            print(f'Iteration {index} completed.')

    def scrape_data(self, latitude, longitude, distance, date):
        self.create_driver()
        self.navigate_to_url('https://docs.airnowapi.org/login')
        self.sleep()
        username_field = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, 'username'))
        )
        password_field = self.driver.find_element(By.ID, 'password')
        login_button = self.driver.find_element(By.NAME, 'exec')
        username_field.send_keys('aditya_25')
        password_field.send_keys('aditya_25@AirNow')
        login_button.click()
        self.sleep()
        self.navigate_to_url(
            'https://docs.airnowapi.org/HistoricalObservationsByLatLon/query')

        input1 = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, 'latitudeCoord'))
        )
        input2 = self.driver.find_element(By.ID, 'longitudeCoord')
        input3 = self.driver.find_element(By.NAME, 'distance')
        input4 = self.driver.find_element(
            By.ID, 'dateSelectorWpr_dateSelector')
        button = self.driver.find_element(By.ID, 'buildUrl')
        input1.clear()
        input1.send_keys(latitude)
        input2.clear()
        input2.send_keys(longitude)
        input3.clear()
        input3.send_keys(distance)
        input4.clear()
        input4.send_keys(date)
        button.click()
        output = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, 'urlView'))
        )
        self.sleep()
        main_button = self.driver.find_element(By.ID, 'runItBtn')
        main_button.click()
        final_output = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, 'outputView'))
        )
        self.sleep()
        final_output_text = final_output.text
        output_data = self.parse_output_text(final_output_text)
        self.write_to_csv(output_data)
        self.close_driver()

class GPX_Extractor:
    def __init__(self):
        self.gpx_file_path = './TaskData/danielle GPX .GPX'

    def bounding_box_calculator(self, latitude, longitude, distance):
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

    def read_gpx_file(self):
        tree = ElementTree.parse(self.gpx_file_path)
        root = tree.getroot()

        data = []
        for trkpt in root.iter('{http://www.topografix.com/GPX/1/1}trkpt'):
            lat = trkpt.attrib['lat']
            lon = trkpt.attrib['lon']
            ele = trkpt.find('{http://www.topografix.com/GPX/1/1}ele').text
            time_str = trkpt.find(
                '{http://www.topografix.com/GPX/1/1}time').text
            time_obj = datetime.strptime(time_str, "%m/%d/%Y, %I:%M:%S %p")
            bbox = self.bounding_box_calculator(lat, lon, 100)
            bbox = [bbox[0], bbox[1], bbox[2], bbox[3]]

            data.append({
                'lat': lat,
                'lon': lon,
                'ele': ele,
                'time': time_obj,
                'bbox': bbox
            })

        return data

    def write_to_csv(self, data):
        csv_file_path = './results/gpx_data.csv'
        csv_header = ["lat", "lon", "ele", "time", "bbox"]
        file_exists = os.path.isfile(csv_file_path)
        with open(csv_file_path, 'a', newline='') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=csv_header)
            if not file_exists:
                writer.writeheader()
            writer.writerows(data)

    def extract_data(self):
        data = self.read_gpx_file()
        self.write_to_csv(data)

class Ping_Extractor():
    def __init__(self):
        self.ping_base_file_path = './TaskData/SurveyData/'
        self.output_file_path = './results/'

    
    def read_csv(self, file_path):
        df = pd.read_csv(file_path)
        return {
            'path': file_path,
            'data': df.to_dict(orient='records')
        }
    
    def bounding_box_calculator(self, latitude, longitude, distance):
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
    
    def append_bbox(self, output_dir, data):
        for row in data:
            if 'LONGITUDE' in row and 'LATITUDE' in row and row['LONGITUDE'] != 0 and row['LATITUDE'] != 0:
                bbox = self.bounding_box_calculator(
                    row['LONGITUDE'], row['LATITUDE'], 100)
                bbox = [bbox[0], bbox[1], bbox[2], bbox[3]]
                row['bbox'] = bbox
                
        df = pd.DataFrame(data)
        output_path = os.path.join(self.output_file_path, output_dir)
        df.to_csv(output_path, index=False)

    def extract_data(self):
        file_list = os.listdir(self.ping_base_file_path)
        for f in file_list:
            file_path = os.path.join(self.ping_base_file_path, f)
            if os.path.isfile(file_path):
                data = self.read_csv(file_path)
                self.append_bbox(f, data['data'])

    def isCoordinateInBBox(self, latitude, longitude, bbox):
        latitude = float(latitude)
        longitude = float(longitude)

        lat_min = bbox[1]
        lat_max = bbox[3]
        lon_min = bbox[0]
        lon_max = bbox[2]

        return latitude >= lat_min and latitude <= lat_max and longitude >= lon_min and longitude <= lon_max

    def update_air_quality_data(self):
        air_quality_data = pd.read_csv('./results/air_quality.csv')
        air_quality_data['UTC'] = pd.to_datetime(air_quality_data['UTC'])
        ping_files = [f for f in os.listdir(
            './results') if f not in ['air_quality.csv', 'gpx_data.csv']]

        for file in ping_files:
            ping_data = pd.read_csv(f'./results/{file}')
            ping_data['actual_start_local'] = pd.to_datetime(
                ping_data['actual_start_local'], format='%d-%m-%Y %H:%M:%S')
            # Swap lat and lon
            ping_data['LATITUDE'], ping_data['LONGITUDE'] = ping_data['LONGITUDE'], ping_data['LATITUDE']

            for index, row in ping_data.iterrows():
                bbox = self.bounding_box_calculator(
                    row['LATITUDE'], row['LONGITUDE'], self.distance)
                time_start = row['actual_start_local'] - timedelta(hours=1)
                time_end = row['actual_start_local']

                filtered_data = air_quality_data[
                    (air_quality_data['Latitude'] >= bbox[0]) &
                    (air_quality_data['Latitude'] <= bbox[1]) &
                    (air_quality_data['Longitude'] >= bbox[2]) &
                    (air_quality_data['Longitude'] <= bbox[3]) &
                    (air_quality_data['UTC'] >= time_start) &
                    (air_quality_data['UTC'] <= time_end)
                ]

                avg_aqi = filtered_data.groupby('Parameter')['AQI'].mean()
                for param, aqi in avg_aqi.iteritems():
                    ping_data.loc[index, param] = aqi

            ping_data.to_csv(f'./results/updated_{file}', index=False)

if __name__ == "__main__":
    # gpx_extractor = GPX_Extractor()
    # gpx_extractor.extract_data()
    # air = AirQualityExtractor()
    # air.gpx_processor(10)

    ping = Ping_Extractor()
    # ping.extract_data()
    ping.update_air_quality_data()
