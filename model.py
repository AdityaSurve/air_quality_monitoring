from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import csv


class AirQualityExtractor:
    def __init__(self):
        self.driver = None
        self.service = None
        self.wait_time = 5

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
        csv_file_path = 'output.csv'
        csv_header = ["DateObserved", "HourObserved", "LocalTimeZone", "ReportingArea", "StateCode",
                      "Latitude", "Longitude", "ParameterName", "AQI", "CategoryNumber", "CategoryName"]
        file_exists = os.path.isfile(csv_file_path)
        with open(csv_file_path, 'a', newline='') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=csv_header)
            if not file_exists:
                writer.writeheader()
            writer.writerows(data)

    def scrape_data(self, latitude, longitude, distance, date):
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


if __name__ == '__main__':
    extractor = AirQualityExtractor()
    print("*"*10 + " Extracting Data " + "*"*10)
    extractor.create_driver()
    extractor.scrape_data(
        latitude=34.0522, longitude=-118.2437, distance=25, date='2021-10-01'
    )
    extractor.close_driver()
    print("*"*10 + " Data Extracted " + "*"*10)
