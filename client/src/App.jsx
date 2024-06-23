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
import "leaflet/dist/leaflet.css";
import StackedBar from "./components/Chart";
import Sidebar from "./components/Sidebar";
import MainModule from "./components/MainModule";

const App = () => {
  const [data, setData] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const getData = () => {
    axios
      .get("http://127.0.0.1:5000/aqi")
      .then((res) => {
        setData(res.data);
        setLatitude(res?.data["O3"][0]?.Latitude);
        setLongitude(res?.data["O3"][0]?.Longitude);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const [active, setActive] = useState("Dashboard");

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0F0F0F] text-white font-pops">
      <Sidebar active={active} setActive={setActive} />
      <MainModule
        active={active}
        data={data}
        latitude={latitude}
        longitude={longitude}
      />
      {/* <div className="w-full flex h-full overflow-auto  flex-col items-center justify-center p-5 gap-4">
        <div className="text-center text-5xl font-semibold text-gray-800">
          Air Quality Index
        </div>
        <div className="w-full text-center text-sm mt-5">
          Visualizes real-time Air Quality Index (AQI) data for various
          pollutants, providing users with a clear understanding of air quality
          in their area
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
        <StackedBar data={mainData} />
      </div> */}
    </div>
  );
};

export default App;
