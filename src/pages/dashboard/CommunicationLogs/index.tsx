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
import EditLogModal, { type LogFormValues } from "./EditLogModal";
import { useAppSelector } from "../../../store/hooks";
import { selectIsDarkMode } from "../../../store/slices/Themeslice";

import {
  useGetcommunicationLogsQuery,
  useGetCommunicationLogsStatsQuery,
} from "../../../store/api/communicationLogs/indes";
import { POLLING_INTERVAL } from "../../../utils/global";

interface CommunicationLog {
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

const CommunicationLogs: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedLog, setSelectedLog] = useState<CommunicationLog | null>(null);
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const { data: communicationLogs = [], isLoading } =
    useGetcommunicationLogsQuery(undefined, {
      pollingInterval: POLLING_INTERVAL, // 5 seconds
      skipPollingIfUnfocused: true, // stops when tab is inactive
    });

  const {
    data: stats = {
      totalCommunications: 0,
      callsCount: 0,
      messagesCount: 0,
      activeChannels: "",
      missedFailed: 0,
      missedCalls: 0,
      failedSms: 0,
      emergencyAlerts: 0,
      emergencyUnit: "",
    },
  } = useGetCommunicationLogsStatsQuery(undefined, {
    pollingInterval: POLLING_INTERVAL, // 5 seconds
    skipPollingIfUnfocused: true, // stops when tab is inactive
  });

  const handleEditLog = (record: CommunicationLog) => {
    setSelectedLog(record);
    setIsEditModalOpen(true);
  };

  const getMenuItems = (record: CommunicationLog): MenuProps["items"] => [
    {
      key: "view",
      label: "View",
      icon: <EyeOutlined />,
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => handleEditLog(record),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const columns: ColumnsType<CommunicationLog> = [
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
      title: "From",
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
      render: (text) => <span className="text-gray-600">{text}</span>,
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

  // Filter data based on active filter
  const filteredData = communicationLogs.filter((item: CommunicationLog) => {
    let matchesFilter = true;

    if (activeFilter === "calls") {
      matchesFilter = item.type === "Call";
    } else if (activeFilter === "sms") {
      matchesFilter = item.type === "Message" && item.deviceType === "phone";
    } else if (activeFilter === "emails") {
      matchesFilter = item.type === "Message" && item.deviceType === "email";
    }

    const matchesSearch =
      item.device.toLowerCase().includes(searchText.toLowerCase()) ||
      item.from.toLowerCase().includes(searchText.toLowerCase()) ||
      item.to.toLowerCase().includes(searchText.toLowerCase()) ||
      item.details.toLowerCase().includes(searchText.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleEditSubmit = (values: LogFormValues) => {
    console.log("Updated log:", values);
    // Here you would typically make an API call to update the log
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-background-light" : "bg-gray-50"
      }  p-6`}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Communications Logs
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all communications logs
            </p>
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
            <div className="text-lg text-[var(--ant-color-primary)] font-medium mb-1">
              Total Communications
            </div>
            <div className="flex items-baseline gap-2">
              <div
                className={`text-3xl font-semibold ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}
              >
                {stats.totalCommunications}
              </div>
              <div className="text-sm text-gray-500">
                {stats.callsCount} Calls, {stats.messagesCount} Messages
              </div>
            </div>
          </div>
          <div
            className={`${
              isDarkMode
                ? "bg-background-light border border-[#484c51]"
                : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-lg text-[var(--ant-color-primary)] font-medium mb-1">
              Active Channels
            </div>
            <div
              className={`text-3xl font-semibold ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}
            >
              {stats.activeChannels}
            </div>
          </div>
          <div
            className={`${
              isDarkMode
                ? "bg-background-light border border-[#484c51]"
                : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-danger text-lg font-medium mb-1">
              Missed / Failed Communications
            </div>
            <div className="flex items-baseline gap-2">
              <div
                className={`text-3xl font-semibold ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}
              >
                {stats.missedFailed}
              </div>
              <div className="text-sm text-gray-500">
                {stats.missedCalls} missed calls, {stats.failedSms} failed sms
              </div>
            </div>
          </div>
          <div
            className={`${
              isDarkMode
                ? "bg-background-light border border-[#484c51]"
                : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-[var(--ant-color-primary)] text-lg font-medium mb-1">
              High-Priority / Emergency Alerts
            </div>
            <div className="flex items-baseline gap-2">
              <div
                className={`text-3xl font-semibold ${isDarkMode ? "text-neutral-300" : "text-neutral-700"}`}
              >
                {stats.emergencyAlerts}
              </div>
              <div className="text-sm text-gray-500">{stats.emergencyUnit}</div>
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
              type={activeFilter === "emails" ? "primary" : "default"}
              onClick={() => setActiveFilter("emails")}
            >
              Emails
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

      {/* Edit Log Modal */}
      <EditLogModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLog(null);
        }}
        onSubmit={handleEditSubmit}
        initialValues={
          selectedLog
            ? {
                radioName: selectedLog.from,
                imei: selectedLog.device,
                radioId: selectedLog.to,
                profile: "teflon_267",
                icon: "portable_radio",
              }
            : undefined
        }
      />
    </div>
  );
};

export default CommunicationLogs;
