import React from "react";
import CallsManagement from "./CallsManagement";
import AlertsAndTeams from "./AlertsAndTeams";
import CommunicationsApp from "./CommunicationsApp";
import Map from "./Map";
import { useAppSelector } from "../../../store/hooks";
import { selectIsDarkMode } from "../../../store/slices/Themeslice";

const Dashboard: React.FC = () => {
  const isDarkMode = useAppSelector(selectIsDarkMode);

  return (
    <div
      className={`transition-colors ${
        isDarkMode ? "bg-background" : "bg-white"
      }`}
      style={{ height: "calc(100vh - 90px)" }} // Explicit height for the container
    >
      <div
        className="grid grid-cols-5 grid-rows-[65%_35%]" // 65% map, 35% calls
        style={{ height: "100%" }}
      >
        <div className="col-span-4 col-start-1 row-start-1 overflow-hidden">
          <Map />
        </div>
        <div className="col-span-4 col-start-1 row-start-2 overflow-hidden">
          <CallsManagement />
        </div>
        <div
          className={`
            row-span-2 row-start-1 col-start-5
            flex flex-col overflow-hidden
            border-l
            ${isDarkMode ? "border-[#313337]" : "border-[#EEEFF1]"}
          `}
        >
          <AlertsAndTeams />
          <CommunicationsApp />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
