import { useState, useEffect } from "react";
import { Layout, Avatar, Dropdown, Badge, Drawer, List, Tag } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  MoonOutlined,
  SunOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  toggleTheme,
  selectIsDarkMode,
} from "../../../store/slices/Themeslice";
import { useGetUserAndConnectionQuery } from "../../../store/api/userManagementApi";
import { POLLING_INTERVAL } from "../../../utils/global";

const { Header: AntHeader } = Layout;

interface HeaderProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  notificationCount?: number;
  isConnected?: boolean;
  notifications?: any;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  setNotifications?: any;
  onLogoutClick?: () => void;
}

interface Notification {
  type: "ERROR" | "ALERT" | "WARN" | "INFO";
  message: string;
  timestamp?: string;
}

const Header = ({
  userAvatar,
  onProfileClick,
  notifications,
  setNotifications,
  onSettingsClick,
  onLogoutClick,
}: HeaderProps) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const { data = { LoggedInUser: "", isConnected: "" } } =
    useGetUserAndConnectionQuery(undefined, {
      pollingInterval: POLLING_INTERVAL, // 5 seconds
      skipPollingIfUnfocused: true, // stops when tab is inactive
    });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "profile":
        onProfileClick?.();
        break;
      case "settings":
        onSettingsClick?.();
        break;
      case "logout":
        onLogoutClick?.();
        break;
    }
  };

  const handleNotificationClick = () => {
    setNotificationDrawerOpen(true);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ERROR":
        return <CloseCircleOutlined className="text-red-500" />;
      case "ALERT":
        return <WarningOutlined className="text-orange-500" />;
      case "WARN":
        return <WarningOutlined className="text-yellow-500" />;
      case "INFO":
        return <InfoCircleOutlined className="text-blue-500" />;
      default:
        return <CheckCircleOutlined className="text-green-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "ERROR":
        return "error";
      case "ALERT":
        return "warning";
      case "WARN":
        return "warning";
      case "INFO":
        return "processing";
      default:
        return "default";
    }
  };

  const parsedNotifications: Notification[] = notifications
    ? notifications
        .map((notif: string) => {
          try {
            const parsed = JSON.parse(notif);
            return {
              ...parsed,
              timestamp: new Date().toLocaleTimeString(),
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean)
    : [];

  const userMenuItems: any = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  return (
    <>
      <div
        className={`
          px-6 flex items-center justify-between 
          shadow-sm h-16 transition-colors duration-200
          border-b
           ${isDarkMode ? "border-[#313337]" : "border-[#EEEFF1]"}
          ${isDarkMode ? "bg-background text-white" : "bg-white text-gray-900"}
        `}
      >
        <h1
          className={`text-xl font-semibold m-0 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <img
            src={isDarkMode ? "/logo-white.png" : "/logo.png"}
            alt="Logo"
            className="h-8"
          />
        </h1>

        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                data?.isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span
              className={`text-sm ${
                data?.isConnected
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {data?.isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div
            className={`text-sm whitespace-nowrap mx-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {formatDateTime(currentTime)}
          </div>

          <Badge count={notifications?.length ?? 0} size="small">
            <div
              className={`
                w-10 h-10 flex items-center justify-center rounded-full 
                cursor-pointer transition-colors duration-200
                ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
              `}
              onClick={handleNotificationClick}
            >
              <BellOutlined
                className={`text-xl ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </div>
          </Badge>

          <div
            className={`
              w-10 h-10 flex items-center justify-center rounded-full 
              cursor-pointer transition-colors duration-200
              ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}
            `}
            onClick={handleThemeToggle}
          >
            {isDarkMode ? (
              <SunOutlined className="text-xl text-yellow-400" />
            ) : (
              <MoonOutlined className="text-xl text-gray-600" />
            )}
          </div>

          <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div
              className={`
                flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg 
                transition-colors duration-200
                ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
              `}
            >
              <Avatar
                size={36}
                icon={<UserOutlined />}
                src={userAvatar}
                className="bg-blue-500"
              />
              <span
                className={`text-sm font-medium ${
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
              >
                {data?.LoggedInUser ?? "User"}
              </span>
            </div>
          </Dropdown>
        </div>
      </div>

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className={isDarkMode ? "text-white" : "text-gray-900"}>
              Notifications
            </span>
            <CloseOutlined
              className="cursor-pointer"
              onClick={() => setNotificationDrawerOpen(false)}
            />
          </div>
        }
        placement="right"
        onClose={() => setNotificationDrawerOpen(false)}
        open={notificationDrawerOpen}
        width={400}
        closable={false}
        className={isDarkMode ? "dark-drawer" : ""}
        styles={{
          body: {
            padding: 18,
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
          },
          header: {
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
            borderBottom: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
          },
        }}
      >
        <div className="flex justify-end">
          <span
            onClick={() => setNotifications([])}
            className={`m-0 underline cursor-pointer text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Remove All
          </span>
        </div>
        <List
          dataSource={parsedNotifications}
          locale={{ emptyText: "No notifications" }}
          renderItem={(item: Notification, index: number) => (
            <List.Item
              className={`
                px-4 py-3 border-b transition-colors duration-200
                ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-50"
                }
              `}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="mt-1">{getNotificationIcon(item.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <Tag
                      color={getNotificationColor(item.type)}
                      className="m-0"
                    >
                      {item.type}
                    </Tag>
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {item.timestamp}
                    </span>
                  </div>
                  <p
                    className={`m-0 text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {item.message}
                  </p>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};

export default Header;
