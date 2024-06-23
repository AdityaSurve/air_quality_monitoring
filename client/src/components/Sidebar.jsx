import React from "react";
import Icons from "./Icons";
import AirNowImage from "./AirNow.png";

const Link = ({ name, active, setActive }) => {
  return (
    <div
      className={`rounded-lg hover:bg-gray-50 hover:bg-opacity-15 ${
        active === name ? "text-[#44DDA0]" : "text-white"
      } px-4 py-3 cursor-pointer flex items-center gap-3 transition-all duration-200`}
      onClick={() => {
        setActive(name);
      }}
    >
      <Icons
        name={name}
        width={20}
        height={20}
        color={active === name ? "#44DDA0" : "white"}
      />
      {name}
    </div>
  );
};

const Sidebar = ({ active, setActive }) => {
  return (
    <div className="w-[22rem] overflow-x-hidden relative bg-[#141414] overflow-y-auto h-full">
      <div className="text-2xl gap-2 py-16 w-full flex items-center justify-center">
        <div className="font-extrabold flex items-center gap-1 text-[#44DDA0]">
          AIR
        </div>
        <div>QUALITY</div>
      </div>
      <div className="h-[0.5px] w-full bg-gray-500 bg-opacity-20" />
      <div className="flex flex-col w-full px-5 py-12 gap-2">
        <Link name="Dashboard" active={active} setActive={setActive} />
        <Link name="Location" active={active} setActive={setActive} />
        <Link name="Pollution Report" active={active} setActive={setActive} />
      </div>
      <div className="h-16" />
      <div className="w-full flex items-center justify-center p-4">
        <div className="bg-gray-500 flex w-full bg-opacity-10 rounded-lg p-4">
          <div className="text-xs w-full text-gray-500 text-center">
            Task based on the AirNow API
          </div>
          <div className="w-full flex items-center justify-center">
            <img
              onClick={() => {
                window.open("https://www.airnow.gov.in/");
              }}
              src={AirNowImage}
              className="w-20 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
