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
        const data = res?.data["O3"];
        if (data && data.length > 0) {
          const lastRecord = data[data.length - 1];
          setLatitude(lastRecord?.Latitude);
          setLongitude(lastRecord?.Longitude);
        }
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
    </div>
  );
};

export default App;
