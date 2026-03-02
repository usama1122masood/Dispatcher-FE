import { Suspense, useEffect, useRef } from "react";
import RemoteApp from "remoteApp/App";
import RemoteAppErrorBoundary from "../../../../utils/RemoteAppErrorBoundary";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsDarkMode } from "../../../../store/slices/Themeslice";

import { useGetRadioDevicesQuery } from "../../../../store/api/radioManagementApi";
import {useGetCallStatusQuery} from "../../../../store/api/dashboardApi/index";
import { POLLING_INTERVAL } from "../../../../utils/global";

// Sample Radio Devices Data matching backend RadioData interface

type RadioStatus = "online" | "warning" | "error";

interface RadioData {
  key: string;
  name: string;
  sector: string;
  status: RadioStatus;
  signalStrength: string;
  battery: string;
  frequency: string;
  location: string;
  lastSeen: string;
  lat: number;
  lon: number;
}

const sampleRadioDevices: RadioData[] = [
  {
    key: "radio-001",
    name: "Alpha-1",
    sector: "North-A",
    status: "online",
    signalStrength: "95%",
    battery: "87%",
    frequency: "2.4GHz",
    location: "Sector North-A, Grid 12",
    lastSeen: "2 mins ago",
    lat: 33.6464,
    lon: 72.999,
  },
  {
    key: "radio-002",
    name: "Bravo-2",
    sector: "East-B",
    status: "warning",
    signalStrength: "45%",
    battery: "23%",
    frequency: "5.8GHz",
    location: "Sector East-B, Grid 8",
    lastSeen: "5 mins ago",
    lat: 33.6484,
    lon: 73.001,
  },
  {
    key: "radio-003",
    name: "Charlie-3",
    sector: "South-C",
    status: "online",
    signalStrength: "88%",
    battery: "92%",
    frequency: "2.4GHz",
    location: "Sector South-C, Grid 15",
    lastSeen: "1 min ago",
    lat: 33.6404,
    lon: 72.997,
  },
  {
    key: "radio-004",
    name: "Delta-4",
    sector: "West-D",
    status: "error",
    signalStrength: "0%",
    battery: "5%",
    frequency: "5.8GHz",
    location: "Sector West-D, Grid 3",
    lastSeen: "45 mins ago",
    lat: 33.6444,
    lon: 72.994,
  },
  {
    key: "radio-005",
    name: "Echo-5",
    sector: "Central-E",
    status: "online",
    signalStrength: "78%",
    battery: "68%",
    frequency: "2.4GHz",
    location: "Sector Central-E, Grid 10",
    lastSeen: "3 mins ago",
    lat: 33.6474,
    lon: 73.003,
  },
  {
    key: "radio-006",
    name: "Foxtrot-6",
    sector: "North-F",
    status: "warning",
    signalStrength: "52%",
    battery: "34%",
    frequency: "5.8GHz",
    location: "Sector North-F, Grid 6",
    lastSeen: "8 mins ago",
    lat: 33.6494,
    lon: 72.996,
  },
  {
    key: "radio-007",
    name: "Golf-7",
    sector: "East-G",
    status: "online",
    signalStrength: "91%",
    battery: "95%",
    frequency: "2.4GHz",
    location: "Sector East-G, Grid 14",
    lastSeen: "30 secs ago",
    lat: 33.6424,
    lon: 73.005,
  },
  {
    key: "radio-008",
    name: "Hotel-8",
    sector: "South-H",
    status: "error",
    signalStrength: "12%",
    battery: "8%",
    frequency: "5.8GHz",
    location: "Sector South-H, Grid 2",
    lastSeen: "1 hour ago",
    lat: 33.6384,
    lon: 72.992,
  },
  {
    key: "radio-009",
    name: "India-9",
    sector: "West-I",
    status: "online",
    signalStrength: "82%",
    battery: "76%",
    frequency: "2.4GHz",
    location: "Sector West-I, Grid 11",
    lastSeen: "4 mins ago",
    lat: 33.6454,
    lon: 73.007,
  },
  {
    key: "radio-010",
    name: "Juliet-10",
    sector: "Central-J",
    status: "warning",
    signalStrength: "38%",
    battery: "19%",
    frequency: "5.8GHz",
    location: "Sector Central-J, Grid 5",
    lastSeen: "12 mins ago",
    lat: 33.6504,
    lon: 73.0,
  },
];

const Map = () => {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const previousThemeRef = useRef(isDarkMode);

  const { data: devices = [] } = useGetRadioDevicesQuery(undefined, {
    pollingInterval: POLLING_INTERVAL, // 5 seconds
    skipPollingIfUnfocused: true, // stops when tab is inactive
  });
const {data : callsattus} = useGetCallStatusQuery();
console.log('call status',callsattus);
  // Notify remote app when theme changes or on initial mount
  useEffect(() => {
    // Send initial theme on mount, or notify if theme changed
    const shouldNotify = previousThemeRef.current !== isDarkMode;
    if (shouldNotify) {
      previousThemeRef.current = isDarkMode;
    }

    // Always send theme info (for initial mount and changes)
    // Dispatch custom event for same-origin micro-frontends
    const themeChangeEvent = new CustomEvent("remoteAppThemeChange", {
      detail: { isDarkMode, mode: isDarkMode ? "dark" : "light" },
      bubbles: true,
    });
    window.dispatchEvent(themeChangeEvent);

    // Use postMessage for cross-origin or iframe communication
    // This ensures the remote app receives the theme change notification
    window.postMessage(
      {
        type: "THEME_CHANGE",
        source: "radio-dispatcher-host",
        payload: {
          isDarkMode,
          mode: isDarkMode ? "dark" : "light",
        },
      },
      "*", // In production, specify the exact origin for security
    );
  }, [isDarkMode]);

  return (
    <div className={`h-full w-full`}>
      <RemoteAppErrorBoundary>
        <Suspense
          fallback={
            <div
              className={`p-8 text-center ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Loading map module...
            </div>
          }
        >
          <RemoteApp
            radioDevices={devices}
            // radioDevices={sampleRadioDevices}
            isDarkMode={isDarkMode}
            isRadioDispatcherMicroUI={true}
          />
        </Suspense>
      </RemoteAppErrorBoundary>
    </div>
  );
};

export default Map;
