import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [data, setData] = useState({});
  const [latitude, setLatitude] = useState(51.505);
  const [longitude, setLongitude] = useState(-0.09);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://127.0.0.1:5000/aqi");
      setData(result.data);
      setLatitude(result.data["O3"][result.data["O3"].length - 1].UserLatitude);
      setLongitude(result.data["O3"][result.data["O3"].length - 1].UserLongitude);
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  function SetViewOnClick({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());

    return null;
  }

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#413ea0",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
    "#8884d8",
    "#82ca9d",
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    function formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const formattedDate = date.toLocaleString();
      return formattedDate;
    }
    function getColorName(CategoryNumber) {
      switch (CategoryNumber) {
        case 1:
          return "#82ca9d";
        case 2:
          return "#ffc658";
        case 3:
          return "#ff7300";
        case 4:
          return "#ff6666";
        case 5:
          return "#ff0000";
        case 6:
          return "#8884d8";
        default:
          return "#8822cc";
      }
    }
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white w-72 p-3 text-xs rounded-xl">
          <div className="flex gap-2 h-8 items-center">
            <div className="">AQI </div>
            <div className="w-full justify-between flex items-center">
              <div
                style={{ color: getColorName(data.CategoryNumber) }}
                className="font-bold text-2xl"
              >
                {data.AQI}
              </div>
              <div
                className="text-xs"
                style={{ color: getColorName(data.CategoryNumber) }}
              >
                {data.CategoryName}
              </div>
            </div>
          </div>
          <div className="label">{`${formatTimestamp(
            data.Timestamp
          )}`}</div>
          <div className="grid grid-cols-2 w-full py-1 gap-2">
            <div className="flex flex-col p-1 items-center bg-gray-50 rounded-xl shadow-md shadow-gray-300 w-full">
              <div className="text-xs">Latitude</div>
              <div className="text-lg font-bold">{data.UserLatitude}</div>
            </div>
            <div className="flex flex-col p-1 items-center bg-gray-50 rounded-xl shadow-md shadow-gray-300 w-full">
              <div className="text-xs">Longitude</div>
              <div className="text-lg font-bold">{data.UserLongitude}</div>
            </div>
            <div className="flex flex-col p-1 items-center bg-gray-50 rounded-xl shadow-md shadow-gray-300 w-full">
              <div className="text-xs">Reporting Area</div>
              <div className="text-lg font-bold w-full text-center truncate">{data.ReportingArea}</div>
            </div>
            <div className="flex flex-col p-1 items-center bg-gray-50 rounded-xl shadow-md shadow-gray-300 w-full">
              <div className="text-xs">State Code</div>
              <div className="text-lg font-bold">{data.StateCode}</div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  function mergeDataSets(dataSets) {
    const mergedData = {};

    Object.keys(dataSets).forEach((key) => {
      dataSets[key].forEach((dataPoint) => {
        const date = dataPoint.Timestamp;

        if (!mergedData[date]) {
          mergedData[date] = { Timestamp: date };
        }

        mergedData[date][key] = dataPoint.AQI;
      });
    });

    return Object.values(mergedData);
  }

  const mergedData = mergeDataSets(data);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="text-center text-5xl font-semibold text-gray-800">
        Air Quality Index
      </div>
      <div className="w-full text-center text-sm mt-5">
        Visualizes real-time Air Quality Index (AQI) data for various
        pollutants, providing users with a clear understanding of air quality in
        their area
      </div>
      <div className="flex flex-col justify-center mt-5 rounded-xl overflow-hidden p-5 bg-white shadow-lg shadow-gray-300">
        <div className="text-xl font-bold mb-2">User Location</div>
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          style={{ height: "60vh", width: "100%" }}
          key={`${latitude},${longitude}`}
        >
          <SetViewOnClick coords={[latitude, longitude]} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[latitude, longitude]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <Circle
            center={[latitude, longitude]}
            radius={2000}
            pathOptions={{
              color: "#8884d880",
              fillColor: "#8884d8",
              dashArray: "5,5",
            }}
          />
        </MapContainer>
      </div>
      <div className="grid grid-cols-1 gap-4 px-2 py-5">
        {Object.keys(data).map((key, index) => (
          <div
            key={key}
            className="w-full bg-gray-50 py-2 rounded-xl shadow-lg shadow-gray-300"
          >
            <h2
              className={`text-xl -mb-5 text-${colors[index]} font-semibold text-center`}
            >
              {key} exposure over time
            </h2>
            <div className="flex justify-center">
              <ResponsiveContainer width={1000} height={400}>
                <AreaChart
                  data={data[key]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={`color${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="10%"
                        stopColor={colors[index]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="90%"
                        stopColor={colors[index]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="Date"
                    tickLine={{ stroke: "transparent" }}
                    stroke={`${colors[index]}70`}
                  />
                  <YAxis
                    tickLine={{ stroke: "transparent" }}
                    stroke={`${colors[index]}70`}
                    tick={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="AQI"
                    stroke={colors[index]}
                    fillOpacity={1}
                    fill={`url(#color${index})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
