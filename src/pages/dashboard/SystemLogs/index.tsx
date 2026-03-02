import React, { useState } from "react";

// antd
import { Table, Tag, Dropdown, Button, Space } from "antd";
import type { MenuProps } from "antd";
import {
  MoreOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

// ui components
import { CustomSearch } from "../../../components/ui/CustomInput";
import { useAppSelector } from "../../../store/hooks";
import { selectIsDarkMode } from "../../../store/slices/Themeslice";

import {
  useGetsystemLogsQuery,
  useGetSystemLogsStatsQuery,
} from "../../../store/api/systemLogsApi";
import { POLLING_INTERVAL } from "../../../utils/global";

interface SystemLog {
  key: string;
  device: string;
  deviceType: "phone" | "email";
  type: "Call" | "Message";
  from: string;
  to: string;
  duration: string;
  channel: string;
  status: "completed" | "missed" | "failed" | "delivered";
  details: string;
}

const SystemLogs: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("systemLogs");
  const [searchText, setSearchText] = useState<string>("");
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const { data: systemLogs = [], isLoading } = useGetsystemLogsQuery(
    undefined,
    {
      pollingInterval: POLLING_INTERVAL, // 5 seconds
      skipPollingIfUnfocused: true, // stops when tab is inactive
    }
  );

  const {
    data: stats = {
      totalSystemEvents: 0,
      activeServices: "",
      errors: 0,
      warnings: 0,
      criticalEvents: 0,
      criticalUnit: "",
    },
  } = useGetSystemLogsStatsQuery(undefined, {
    pollingInterval: POLLING_INTERVAL, // 5 seconds
    skipPollingIfUnfocused: true, // stops when tab is inactive
  });

  const getMenuItems = (): MenuProps["items"] => [
    {
      key: "view",
      label: "View",
      icon: <EyeOutlined />,
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const columns: ColumnsType<SystemLog> = [
    {
      title: "Devices",
      dataIndex: "device",
      key: "device",
      sorter: (a, b) => a.device.localeCompare(b.device),
      render: (text, record) => (
        <Space>
          {record.deviceType === "phone" ? (
            <PhoneOutlined className="text-gray-500" />
          ) : (
            <MailOutlined className="text-gray-500" />
          )}
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => a.type.localeCompare(b.type),
      render: (text, record) => (
        <Space>
          {record.type === "Call" ? (
            <PhoneOutlined className="text-gray-500" />
          ) : (
            <MailOutlined className="text-gray-500" />
          )}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Devices",
      dataIndex: "from",
      key: "from",
      sorter: (a, b) => a.from.localeCompare(b.from),
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
      sorter: (a, b) => a.to.localeCompare(b.to),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      sorter: (a, b) => a.duration.localeCompare(b.duration),
    },
    {
      title: "Channel",
      dataIndex: "channel",
      key: "channel",
      sorter: (a, b) => a.channel.localeCompare(b.channel),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        const config = {
          completed: { color: "success", icon: "●", text: "Completed Call" },
          missed: { color: "warning", icon: "●", text: "Missed Call" },
          failed: { color: "error", icon: "●", text: "Failed" },
          delivered: { color: "success", icon: "●", text: "Delivered" },
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
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (text) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_) => (
        <Dropdown menu={{ items: getMenuItems() }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Filter data based on active filter
  const filteredData = systemLogs.filter((item: SystemLog) => {
    let matchesFilter = true;

    if (activeFilter === "calls") {
      matchesFilter = item.type === "Call";
    } else if (activeFilter === "sms") {
      matchesFilter = item.type === "Message" && item.deviceType === "phone";
    } else if (activeFilter === "alerts") {
      matchesFilter = item.status === "failed" || item.status === "missed";
    }

    const matchesSearch =
      item.device.toLowerCase().includes(searchText.toLowerCase()) ||
      item.from.toLowerCase().includes(searchText.toLowerCase()) ||
      item.to.toLowerCase().includes(searchText.toLowerCase()) ||
      item.details.toLowerCase().includes(searchText.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-background-light text-white" : "bg-gray-50"
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
              System Logs
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage all system logs</p>
          </div>
          <div className="flex gap-2 items-center mb-4">
            <CustomSearch
              noMarginBottom
              placeholder="Search"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`${
              isDarkMode ? "bg-background border border-[#484c51]" : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-[var(--ant-color-primary)] text-lg font-medium mb-1">
              Total System Events
            </div>
            <div className={`text-3xl font-semibold ${isDarkMode?"text-neutral-300":"text-neutral-700"}`}>
              {stats.totalSystemEvents}
            </div>
          </div>
          <div
            className={`${
              isDarkMode ? "bg-background border border-[#484c51]" : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-[var(--ant-color-primary)] text-lg font-medium mb-1">
              Active Components / Services
            </div>
            <div className={`text-base font-medium ${isDarkMode?"text-neutral-300":"text-neutral-700"}`}>
              {stats.activeServices}
            </div>
          </div>
          <div
            className={`${
              isDarkMode ? "bg-background border border-[#484c51]" : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-danger text-lg font-medium mb-1">
              Errors / Warnings
            </div>
            <div className={`text-base font-medium ${isDarkMode?"text-neutral-300":"text-neutral-700"}`}>
              {stats.errors} errors, {stats.warnings} warnings
            </div>
          </div>
          <div
            className={`${
              isDarkMode ? "bg-background border border-[#484c51]" : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-[var(--ant-color-primary)] text-lg font-medium mb-1">
              Recent Critical Events
            </div>
            <div className="flex items-baseline gap-2">
              <div className={`text-3xl font-semibold ${isDarkMode?"text-neutral-300":"text-neutral-700"}`}>
                {stats.criticalEvents}
              </div>
              <div className="text-sm text-gray-500">{stats.criticalUnit}</div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-4 flex justify-end">
          <Space>
            <Button
              type={activeFilter === "systemLogs" ? "primary" : "default"}
              onClick={() => setActiveFilter("systemLogs")}
            >
              System Logs
            </Button>
            <Button
              type={activeFilter === "calls" ? "primary" : "default"}
              onClick={() => setActiveFilter("calls")}
            >
              Calls
            </Button>
            <Button
              type={activeFilter === "sms" ? "primary" : "default"}
              onClick={() => setActiveFilter("sms")}
            >
              SMS
            </Button>
            <Button
              type={activeFilter === "alerts" ? "primary" : "default"}
              onClick={() => setActiveFilter("alerts")}
            >
              Alerts
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
            className={`radio-management-table`}
          />
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
