import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";

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

    combinedData.sort((a, b) => a.Timestamp - b.Timestamp);
    combinedData.reverse();
    combinedData = combinedData.slice(0, 5);
    combinedData.reverse();
    setCombinedData(combinedData);
  }, [data]);

  const AddMarkersAndLines = () => {
    const map = useMap();

    useEffect(() => {
      map.eachLayer((layer) => {
        if (!(layer instanceof L.TileLayer)) {
          map.removeLayer(layer);
        }
      });

      for (let i = 0; i < combinedData.length; i++) {
        const location = combinedData[i];
        L.marker([location.Latitude, location.Longitude]).addTo(map);

        if (i < combinedData.length - 1) {
          const nextLocation = combinedData[i + 1];
          const latlngs = [
            [location.Latitude, location.Longitude],
            [nextLocation.Latitude, nextLocation.Longitude],
          ];
          const polyline = L.polyline(latlngs, { color: "blue" }).addTo(map);
          L.polylineDecorator(polyline, {
            patterns: [
              {
                offset: "100%",
                repeat: 0,
                symbol: L.Symbol.arrowHead({
                  pixelSize: 10,

                  polygon: false,
                  pathOptions: { stroke: true },
                }),
              },
            ],
          }).addTo(map);
        }
      }
    }, [combinedData]);

    return null;
  };

  const distanceTravelledCalculator = () => {
    let distance = 0;
    for (let i = 0; i < combinedData.length - 1; i++) {
      const location = combinedData[i];
      const nextLocation = combinedData[i + 1];
      const lat1 = location.Latitude;
      const lon1 = location.Longitude;
      const lat2 = nextLocation.Latitude;
      const lon2 = nextLocation.Longitude;
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      distance += d;
      distance = distance * 0.621371;
    }
    return distance;
  };

  return (
    <div className="w-full gap-4 h-fit overflow-y-auto flex flex-col justify-center items-center">
      <div className="w-full p-4 flex flex-col gap-2 shadow-md shadow-[#00000040] rounded-xl bg-[#141414]">
        <div className="w-full items-center justify-between flex">
          <div className="text-lg font-semibold">Your track history</div>
          <div className="flex justify-center items-center gap-4">
            <div className="text-xs text-gray-400">
              Travelled{" "}
              <span className="font-bold italic text-base text-[#44DDA0]">
                {" "}
                {distanceTravelledCalculator().toFixed(2)}
              </span>{" "}
              miles
            </div>
          </div>
        </div>
        <div className="w-full h-full p-2 bg-gray-700 bg-opacity-20 rounded-lg">
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: "45vh", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <AddMarkersAndLines />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Location;
