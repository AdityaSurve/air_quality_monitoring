import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import PollutionChart from "./Chart";
import { Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = ({ data, latitude, longitude }) => {
  function SetViewOnClick({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());
  }

  const tabData = [
    {
      id: 1,
      name: "NO2",
      description:
        " Nitrogen Dioxide (NO2) is a harmful gas emitted by vehicles and power plants. It can cause respiratory problems and contribute to the formation of smog.",
    },
    {
      id: 2,
      name: "O3",
      description:
        "Ozone (O3) is a gas that can form in any climate and is known to cause breathing problems and other health issues.",
    },
    {
      id: 3,
      name: "PM2.5",
      description:
        "Particulate Matter (PM2.5) are tiny particles suspended in the air. They can penetrate deep into the lungs and cause health issues such as heart attacks, respiratory disease, and premature death.",
    },
    {
      id: 4,
      name: "PM10",
      description:
        " Particulate Matter (PM10) are slightly larger particles that can still be inhaled and cause health problems.",
    },
    {
      id: 5,
      name: "SO2",
      description:
        "Sulfur Dioxide (SO2) is a gas produced by burning fossil fuels. It can cause acid rain and respiratory problems.",
    },
  ];

  return (
    <div className="w-full gap-4 h-fit overflow-y-auto flex flex-col justify-center items-center">
      <div className="w-full p-6 flex flex-col gap-2 shadow-md shadow-[#00000040] rounded-xl bg-[#141414]">
        <div className="w-full items-center justify-between flex">
          <div className="text-lg font-semibold">Your Location</div>
          <div className="flex justify-center items-center gap-4">
            <div className="text-xs text-gray-400">Updated every minute</div>
          </div>
        </div>
        <div className="w-full h-full p-2 bg-gray-700 bg-opacity-20 rounded-lg">
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: "56vh", width: "100%" }}
            key={`${latitude},${longitude}`}
          >
            <SetViewOnClick coords={[latitude, longitude]} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
      </div>
      <div className="w-full p-6 flex flex-col gap-2 shadow-md shadow-[#00000040] rounded-xl bg-[#141414]">
        <div className="w-full items-center justify-between flex">
          <div className="text-lg font-semibold">Pollution Exposure</div>
          <div className="flex justify-center items-center gap-4">
            <div className="text-xs text-gray-400">
              Based on the locations you visit
            </div>
          </div>
        </div>
        <div className="w-full h-full p-2 bg-gray-700 bg-opacity-20 rounded-lg">
          <PollutionChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
