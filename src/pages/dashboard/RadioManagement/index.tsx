import React, { useState, useMemo } from "react";
import { Table, Tag, Dropdown, Button, Space, message } from "antd";
import type { MenuProps } from "antd";
import {
  MoreOutlined,
  SignalFilled,
  EnvironmentOutlined,
  RadiusSettingOutlined,
  EyeOutlined,
  SettingOutlined,
  ApiOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import BatteryFilled from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { CustomSearch } from "../../../components/ui/CustomInput";
import { useAppSelector } from "../../../store/hooks";
import { selectIsDarkMode } from "../../../store/slices/Themeslice";
import {
  useGetRadioDevicesQuery,
  useCallServiceMutation,
} from "../../../store/api/radioManagementApi";
import AddDeviceModal, { type DeviceFormValues } from "./AddDeviceModal";
import ViewDetailsModal from "./AddDeviceModal/ViewDetailsModal";
import RadioConfigModal from "./RadioConfigModal";
import { POLLING_INTERVAL } from "../../../utils/global";

// Keep these interfaces here
export interface RadioDevice {
  key: string;
  name: string;
  sector: string;
  status: "online" | "warning" | "error";
  signalStrength: string;
  battery: string;
  frequency: string;
  location: string;
  lastSeen: string;
}

export interface CallService {
  serviceType: string;
}

const RadioManagement: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState<boolean>(false);
  const [isRadioConfigOpen, setIsRadioConfigOpen] = useState<boolean>(false);
  const [selectedDevice, setSelectedDevice] = useState<RadioDevice | null>(null);
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const { data: radioDevices = [], isLoading } = useGetRadioDevicesQuery(
    undefined,
    {
      pollingInterval: POLLING_INTERVAL,
      skipPollingIfUnfocused: true,
    }
  );

  const [callService] = useCallServiceMutation();

  const stats = useMemo(() => {
    const active = radioDevices.filter((device: RadioDevice) => device.status === "online").length;
    const warnings = radioDevices.filter((device: RadioDevice) => device.status === "warning").length;
    const errors = radioDevices.filter((device: RadioDevice) => device.status === "error").length;
    
    const signalValues = radioDevices
      .map((device: RadioDevice) => {
        const match = device.signalStrength.match(/-?\d+/);
        return match ? parseInt(match[0]) : 0;
      })
      .filter((val) => val !== 0);
    
    const avgSignal = signalValues.length > 0
      ? `${Math.round(signalValues.reduce((a, b) => a + b, 0) / signalValues.length)} dBm`
      : "-- dBm";

    return {
      active,
      warnings,
      errors,
      avgSignal,
    };
  }, [radioDevices]);

  const handleViewDetails = (device: RadioDevice) => {
    setSelectedDevice(device);
    setIsViewDetailsOpen(true);
  };

  const handleRadioConfig = (device: RadioDevice) => {
    setSelectedDevice(device);
    setIsRadioConfigOpen(true);
  };

  const getMenuItems = (device: RadioDevice): MenuProps["items"] => [
    {
      key: "view",
      label: "View Details",
      icon: <EyeOutlined />,
      onClick: () => handleViewDetails(device),
    },
    {
      key: "radio_config",
      label: "Radio Configuration",
      icon: <SettingOutlined />,
      onClick: () => handleRadioConfig(device),
    },
    {
      key: "ping",
      label: "Ping / Test Connection",
      icon: <ApiOutlined />,
      onClick: () => handleCallSerice({ serviceType: "Ping/ test Connection" }),
    },
    {
      key: "refresh",
      label: "Refresh Status",
      icon: <SyncOutlined />,
      onClick: () => handleCallSerice({ serviceType: "Refresh Status" }),
    },
    {
      key: "sync",
      label: "Sync Time",
      icon: <ClockCircleOutlined />,
      onClick: () => handleCallSerice({ serviceType: "Sync Time" }),
    },
  ];

  const columns: ColumnsType<RadioDevice> = [
    {
      title: "Devices",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <Space>
          <RadiusSettingOutlined className="text-gray-500" />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        const config = {
          online: { color: "success", icon: "●", text: "Online" },
          warning: { color: "warning", icon: "●", text: "Warning" },
          error: { color: "error", icon: "●", text: "Error" },
        };
        const { color, icon, text } = config[status as keyof typeof config];
        return (
          <Tag color={color} icon={<span>{icon}</span>}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Signal strength",
      dataIndex: "signalStrength",
      key: "signalStrength",
      sorter: (a, b) => a.signalStrength.localeCompare(b.signalStrength),
      render: (text, record, index) => {
        const signalLevel =
          record.status === "online" ? 3 : record.status === "warning" ? 2 : 1;
        return (
          <Space>
            <SignalFilled
              className={
                signalLevel === 3
                  ? "text-green-500"
                  : signalLevel === 2
                  ? "text-yellow-500"
                  : "text-red-500"
              }
            />
            <span>{index === 0 ? "Master" : text}</span>
          </Space>
        );
      },
    },
    {
      title: "Battery",
      dataIndex: "battery",
      key: "battery",
      sorter: (a, b) => a.battery.localeCompare(b.battery),
      render: (text, record) => {
        const batteryLevel =
          record.status === "online"
            ? "full"
            : record.status === "warning"
            ? "medium"
            : "low";
        return (
          <Space>
            <BatteryFilled
              className={
                batteryLevel === "full"
                  ? "text-green-500"
                  : batteryLevel === "medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }
            />
            <span>{text}</span>
          </Space>
        );
      },
    },
    {
      title: "Channel",
      dataIndex: "frequency",
      key: "frequency",
      sorter: (a, b) => a.frequency.localeCompare(b.frequency),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
      render: (text) => (
        <Space>
          <EnvironmentOutlined className="text-gray-500" />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Last Seen",
      dataIndex: "lastSeen",
      key: "lastSeen",
      sorter: (a, b) => a.lastSeen.localeCompare(b.lastSeen),
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_, record) => (
        <Dropdown menu={{ items: getMenuItems(record) }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const filteredData = radioDevices.filter((item: RadioDevice) => {
    const matchesFilter =
      activeFilter === "all" || item.status === activeFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sector.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCallSerice = async (values: CallService) => {
    try {
      const resp: any = await callService(values);

      if (resp?.data?.status === 200) {
        message.success(resp?.data?.message);
      }
    } catch (err) {
      message.error("Failed to call service");
      console.log("error -> ", err);
    }
  };

  const handleAddDevice = (values: DeviceFormValues) => {
    console.log("New device added:", values);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-background text-white" : "bg-gray-50"
      }  p-6`}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }  `}
            >
              Radio Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor and configure all radio devices
            </p>
          </div>
          <div className="flex gap-2 items-center mb-4">
            <CustomSearch
              noMarginBottom
              placeholder="Search..."
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />

            <Button type="primary" size="large" onClick={() => setIsModalOpen(true)}>
              <PlusOutlined />
              Add Device
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`${
              isDarkMode ? "bg-background-light border border-[#484c51]" : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-sm text-blue-600 font-medium mb-1">
              Active Devices
            </div>
            <div
              className={`text-3xl font-semibold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {stats.active}
            </div>
          </div>
          <div
            className={` ${
              isDarkMode ? "border border-[#484c51] bg-background-light" : "bg-white"
            } rounded-lg p-4 shadow-sm`}
          >
            <div className="text-sm text-yellow-600 font-medium mb-1">
              Warnings
            </div>
            <div
              className={`text-3xl font-semibold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {stats.warnings}
            </div>
          </div>
          <div
            className={` ${
              isDarkMode ? "border border-[#484c51] bg-background-light" : "bg-white"
            } rounded-lg p-4 shadow-sm`}
          >
            <div className="text-sm text-red-600 font-medium mb-1">Errors</div>
            <div
              className={`text-3xl font-semibold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {stats.errors}
            </div>
          </div>
          <div
            className={` rounded-lg p-4 shadow-sm ${
              isDarkMode ? "border border-[#484c51] bg-background-light" : "bg-white"
            }`}
          >
            <div className="text-sm text-gray-600 font-medium mb-1">
              Avg Signal
            </div>
            <div
              className={`text-3xl font-semibold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {stats.avgSignal}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-4 flex justify-end">
          <Space>
            <Button
              type={activeFilter === "all" ? "primary" : "default"}
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              type={activeFilter === "online" ? "primary" : "default"}
              onClick={() => setActiveFilter("online")}
            >
              Active
            </Button>
            <Button
              type={activeFilter === "warning" ? "primary" : "default"}
              onClick={() => setActiveFilter("warning")}
            >
              Warning
            </Button>
            <Button
              type={activeFilter === "error" ? "primary" : "default"}
              onClick={() => setActiveFilter("error")}
            >
              Error
            </Button>
          </Space>
        </div>

        {/* Table */}
        <div className="rounded-lg shadow-sm">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={isLoading}
            pagination={{
              position: ["bottomCenter"],
              defaultPageSize: 10,
              showSizeChanger: false,
            }}
          />
        </div>
      </div>

      <AddDeviceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDevice}
      />

      <ViewDetailsModal
        open={isViewDetailsOpen}
        onClose={() => {
          setIsViewDetailsOpen(false);
          setSelectedDevice(null);
        }}
        device={selectedDevice}
      />

      <RadioConfigModal
        open={isRadioConfigOpen}
        onClose={() => {
          setIsRadioConfigOpen(false);
          setSelectedDevice(null);
        }}
        device={selectedDevice}
      />
    </div>
  );
};

export default RadioManagement;