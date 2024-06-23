import React, { useEffect, useState } from "react";

const Location = ({ data, latitude, longitude }) => {
  const [combinedData, setCombinedData] = useState([]);
  useEffect(() => {
    let combinedData = [];

    for (let pollutant in data) {
      data[pollutant].forEach((item) => {
        let key = `${item.Latitude},${item.Longitude},${item.Timestamp}`;
        let aqiData = { Pollutant: pollutant, AQI_Val: item.AQI };

        let existingData = combinedData.find(
          (d) => `${d.Latitude},${d.Longitude},${d.Timestamp}` === key
        );

        if (existingData) {
          existingData.Pollutants.push(aqiData);
        } else {
          combinedData.push({
            Latitude: item.Latitude,
            Longitude: item.Longitude,
            Timestamp: item.Timestamp,
            Pollutants: [aqiData],
          });
        }
      });
    }

    setCombinedData(combinedData);
  }, [data]);

  useEffect(() => console.log(combinedData), [combinedData]);

  return <div>Location</div>;
};

export default Location;
