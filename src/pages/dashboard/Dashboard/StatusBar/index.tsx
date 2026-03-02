import React, { useState, useEffect } from "react";
import { WifiOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsDarkMode } from "../../../../store/slices/Themeslice";

import { useGetStatusBarQuery } from "../../../../store/api/dashboardApi";
import { POLLING_INTERVAL } from "../../../../utils/global";

interface StatusBarProps {
  userName?: string;
  systemStatus?: "healthy" | "warning" | "error";
  usbStatus?: boolean;
  mapServiceStatus?: boolean;
  audioStatus?: boolean;
}

// const StatusBar: React.FC<StatusBarProps> = ({
//   userName = 'John Dispatcher',
//   systemStatus = 'healthy',
//   usbStatus = true,
//   mapServiceStatus = true,
//   audioStatus = true,
// }) => {
//   const isDarkMode = useAppSelector(selectIsDarkMode);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (date: Date) => {
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     const seconds = date.getSeconds().toString().padStart(2, '0');
//     return `${hours}:${minutes}:${seconds}`;
//   };

//   const getSystemStatusStyles = () => {
//     switch (systemStatus) {
//       case 'healthy':
//         return {
//           bg: isDarkMode ? 'bg-green-900/30' : 'bg-green-50',
//           border: isDarkMode ? 'border-green-700' : 'border-green-200',
//           text: isDarkMode ? 'text-green-400' : 'text-green-600',
//         };
//       case 'warning':
//         return {
//           bg: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50',
//           border: isDarkMode ? 'border-yellow-700' : 'border-yellow-200',
//           text: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
//         };
//       case 'error':
//         return {
//           bg: isDarkMode ? 'bg-red-900/30' : 'bg-red-50',
//           border: isDarkMode ? 'border-red-700' : 'border-red-200',
//           text: isDarkMode ? 'text-red-400' : 'text-red-600',
//         };
//       default:
//         return {
//           bg: isDarkMode ? 'bg-green-900/30' : 'bg-green-50',
//           border: isDarkMode ? 'border-green-700' : 'border-green-200',
//           text: isDarkMode ? 'text-green-400' : 'text-green-600',
//         };
//     }
//   };

//   const statusStyles = getSystemStatusStyles();

//   return (
//     <div className={`
//       flex items-center justify-between px-6 py-2 border-t h-10 transition-colors
//       ${isDarkMode
//         ? 'bg-gray-800 border-gray-700'
//         : 'bg-gray-50 border-gray-200'
//       }
//     `}>
//       {/* Left Section - Status Indicators */}
//       <div className="flex items-center gap-6">
//         {/* USB Connected */}
//         {usbStatus && (
//           <div className="flex items-center gap-1.5">
//             <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
//             <span className={`text-xs font-normal whitespace-nowrap ${
//               isDarkMode ? 'text-gray-300' : 'text-gray-600'
//             }`}>
//               USB Connected
//             </span>
//           </div>
//         )}

//         {/* Map Service */}
//         {mapServiceStatus && (
//           <div className="flex items-center gap-1.5">
//             <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
//             <span className={`text-xs font-normal whitespace-nowrap ${
//               isDarkMode ? 'text-gray-300' : 'text-gray-600'
//             }`}>
//               Map Service: Online
//             </span>
//           </div>
//         )}

//         {/* Audio Status */}
//         {audioStatus && (
//           <div className="flex items-center gap-1.5">
//             <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
//             <span className={`text-xs font-normal whitespace-nowrap ${
//               isDarkMode ? 'text-gray-300' : 'text-gray-600'
//             }`}>
//               Audio: Ready
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Right Section - User Info & Time */}
//       <div className="flex items-center gap-4">
//         {/* Signal Icon */}
//         <WifiOutlined className={`text-base ${
//           isDarkMode ? 'text-gray-400' : 'text-gray-600'
//         }`} />

//         {/* System Status Badge */}
//         <div className={`
//           flex items-center px-3 py-1 rounded-xl h-6 border transition-colors
//           ${statusStyles.bg} ${statusStyles.border}
//         `}>
//           <span className={`text-xs font-medium whitespace-nowrap ${statusStyles.text}`}>
//             System Healthy
//           </span>
//         </div>

//         {/* User Name */}
//         <span className={`text-xs font-medium whitespace-nowrap ${
//           isDarkMode ? 'text-white' : 'text-gray-900'
//         }`}>
//           {userName}
//         </span>

//         {/* Time */}
//         <div className="flex items-center gap-1.5">
//           <ClockCircleOutlined className={`text-sm ${
//             isDarkMode ? 'text-gray-400' : 'text-gray-500'
//           }`} />
//           <span className={`text-xs font-normal tabular-nums whitespace-nowrap ${
//             isDarkMode ? 'text-gray-300' : 'text-gray-600'
//           }`}>
//             {formatTime(currentTime)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

export interface StatusBarData {
  usb: { status: string; indicator: "green" | "yellow" | "red" };
  mapService: { status: string; indicator: "green" | "yellow" | "red" };
  audio: { status: string; indicator: "green" | "yellow" | "red" };
  system: { status: string; indicator: "green" | "yellow" | "red" };
  user: string;
  time?: string; // optional, can be overridden by live clock
}

export const defaultStatus: StatusBarData = {
  usb: { status: "Connected", indicator: "green" },
  mapService: { status: "Online", indicator: "green" },
  audio: { status: "Ready", indicator: "green" },
  system: { status: "Healthy", indicator: "green" },
  user: "John Dispatcher",
};

interface StatusBarProps {
  data?: StatusBarData;
}

const StatusBar: React.FC<StatusBarProps> = () => {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const [currentTime, setCurrentTime] = useState(new Date());

  const {
    data = {
      system: { status: "", indicator: "green" },
      usb: { status: "", indicator: "green" },
      mapService: { status: "", indicator: "green" },
      audio: { status: "", indicator: "green" },
      user: "",
    },
  } = useGetStatusBarQuery(undefined, {
    pollingInterval: POLLING_INTERVAL, // 5 seconds
    skipPollingIfUnfocused: true, // stops when tab is inactive
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

  const getIndicatorColor = (indicator: "green" | "yellow" | "red") => {
    switch (indicator) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "red":
        return "bg-red-500";
    }
  };

  const getSystemBadgeStyles = (
    status: string,
    indicator: "green" | "yellow" | "red" = "yellow"
  ) => {
    // Tailwind classnames must be static strings (not template strings), so we must interpolate manually
    // We'll use standard tailwind color classes for known indicators
    let bg = "";
    let border = "";
    let text = "";

    if (indicator === "green") {
      bg = isDarkMode ? "bg-green-900/30" : "bg-green-50";
      border = isDarkMode ? "border-green-700" : "border-green-200";
      text = isDarkMode ? "text-green-400" : "text-green-600";
    } else if (indicator === "yellow") {
      bg = isDarkMode ? "bg-yellow-900/30" : "bg-yellow-50";
      border = isDarkMode ? "border-yellow-700" : "border-yellow-200";
      text = isDarkMode ? "text-yellow-400" : "text-yellow-600";
    } else if (indicator === "red") {
      bg = isDarkMode ? "bg-red-900/30" : "bg-red-50";
      border = isDarkMode ? "border-red-700" : "border-red-200";
      text = isDarkMode ? "text-red-400" : "text-red-600";
    }

    return { bg, border, text, status };
  };

  const systemStyles = getSystemBadgeStyles(
    data?.system?.status,
    data?.system?.indicator as any
  );

  return (
    <div
      className={`
      flex items-center justify-between px-6 py-2 border-t h-10 transition-colors
      ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }
    `}
    >
      {/* Left Section - Map dynamically */}
      <div className="flex items-center gap-6">
        {Object.entries({
          usb: data.usb,
          mapService: data.mapService,
          audio: data.audio,
        }).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${getIndicatorColor(
                value?.indicator as any
              )}`}
            />
            <span
              className={`text-xs font-normal whitespace-nowrap ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {key === "mapService"
                ? "Map Service"
                : key.charAt(0).toUpperCase() + key.slice(1)}
              : {value?.status}
            </span>
          </div>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <WifiOutlined
          className={`text-base ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        />

        {/* System Badge */}
        <div
          className={`flex items-center px-3 py-1 rounded-xl h-6 border transition-colors ${systemStyles.bg} ${systemStyles.border}`}
        >
          <span
            className={`text-xs font-medium whitespace-nowrap ${systemStyles.text}`}
          >
            System {data?.system?.status}
          </span>
        </div>

        {/* User */}
        <span
          className={`text-xs font-medium whitespace-nowrap ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {data.user}
        </span>

        {/* Time */}
        <div className="flex items-center gap-1.5">
          <ClockCircleOutlined
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs font-normal tabular-nums whitespace-nowrap ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
