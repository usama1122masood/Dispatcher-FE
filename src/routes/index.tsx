

import { useEffect , useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Client } from "@stomp/stompjs";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import MainLayout from "../components/layout/MainLayout";
import RadioManagement from "../pages/dashboard/RadioManagement";
import Communications from "../pages/dashboard/Communications";
import CommunicationLogs from "../pages/dashboard/CommunicationLogs";
import SystemLogs from "../pages/dashboard/SystemLogs";
import Settings from "../pages/dashboard/Settings";
import AboutUs from "../pages/dashboard/AboutUs";

const AppRoutes: React.FC = () => {

  const [notifications, setNotifications] = useState<string[]>([]);

  const routes = [
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/radio-management",
      element: <RadioManagement />,
    },
    {
      path: "/communications",
      element: <Communications />,
    },
    {
      path: "/communications-logs",
      element: <CommunicationLogs />,
    },
    {
      path: "/system-logs",
      element: <SystemLogs />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/about-us",
      element: <AboutUs />,
    },
  ];

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://192.168.21.151:8080/tvlNotification",
      onConnect: () => {
        console.log("CONNECTED");
        stompClient.subscribe("/topic/tvlNotification", (msg) => {
          console.log("RECEIVED:", msg.body);
          setNotifications((prev) => [...prev, msg.body]);
        });
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {routes?.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<MainLayout setNotifications={setNotifications} notifications={notifications}>{route.element}</MainLayout>}
          />
        ))}

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;