import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Location from "./Location";
import PollutionReport from "./PollutionReport";
import Icons from "./Icons";

const MainModule = ({ data, active, latitude, longitude }) => {
  const getSection = () => {
    switch (active) {
      case "Dashboard":
        return (
          <Dashboard data={data} latitude={latitude} longitude={longitude} />
        );
      case "Location":
        return (
          <Location data={data} latitude={latitude} longitude={longitude} />
        );
      case "Pollution Report":
        return <PollutionReport />;
    }
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-5 gap-4">
      <div className="w-full h-28 flex justify-between items-center">
        <div className="text-3xl font-semibold">{active}</div>
        <div
          className="relative flex gap-3 items-center"
          onClick={() => {
            setShowModal(!showModal);
          }}
        >
          <div
            className={`px-2 flex relative cursor-pointer hover:bg-gray-300 hover:bg-opacity-15 items-center text-[#44DDA0] gap-2 py-2 ${
              showModal && "bg-opacity-15 bg-gray-300"
            } rounded-full w-fit`}
          >
            <Icons name="Account" width="20" height="20" color="#44DDA0" />
            <div className="text-sm font-semibold">Aditya Surve</div>
          </div>
          {showModal && (
            <div className="absolute right-0 top-full text-xs px-2 py-2 h-fit bg-[#1c1c1c] rounded-lg shadow-lg flex flex-col gap-2">
              <div
                className="flex hover:bg-gray-300 hover:bg-opacity-15 p-2 rounded-lg items-center justify-center gap-2 cursor-pointer"
                onClick={() => {
                  alert("Logged out successfully");
                  setShowModal(false);
                }}
              >
                <Icons name="logout" width="20" height="20" color="white" />
                Log out
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto">{getSection()}</div>
    </div>
  );
};

export default MainModule;
