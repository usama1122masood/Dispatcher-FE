import React, { useState } from "react";
import { Table, Tag, Dropdown, Button, Space } from "antd";
import type { MenuProps } from "antd";
import {
  MoreOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { CustomButton } from "../../../components/ui/CustomButton";
import { CustomSearch } from "../../../components/ui/CustomInput";
import NewCommunicationModal from "./NewCommunicationModal";
import { useAppSelector } from "../../../store/hooks";
import { selectIsDarkMode } from "../../../store/slices/Themeslice";

import {
  useGetCommunicationsQuery,
  useGetCommunicationStatsQuery,
} from "../../../store/api/communicationApi";
import { POLLING_INTERVAL } from "../../../utils/global";

interface CommunicationRecord {
  key: string;
  device: string;
  deviceType: "phone" | "email";
  radioId: string;
  timeDate: string;
  lastStatus: "completed" | "missed" | "failed" | "delivered";
  details: string;
}

const Communications: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const { data: communicationRecords = [], isLoading } =
    useGetCommunicationsQuery(undefined, {
      pollingInterval: POLLING_INTERVAL, // 5 seconds
      skipPollingIfUnfocused: true, // stops when tab is inactive
    });

  const {
    data: stats = {
      totalToday: 0,
      activeCalls: 0,
      missedFailed: 0,
      successRate: "0%",
    },
  } = useGetCommunicationStatsQuery(undefined, {
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
      key: "duplicate",
      label: "Duplicate",
      icon: <CopyOutlined />,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const columns: ColumnsType<CommunicationRecord> = [
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
      title: "Radio ID",
      dataIndex: "radioId",
      key: "radioId",
      sorter: (a, b) => a.radioId.localeCompare(b.radioId),
    },
    {
      title: "Time & Date",
      dataIndex: "timeDate",
      key: "timeDate",
      sorter: (a, b) => a.timeDate.localeCompare(b.timeDate),
    },
    {
      title: "Last Status",
      dataIndex: "lastStatus",
      key: "lastStatus",
      sorter: (a, b) => a.lastStatus.localeCompare(b.lastStatus),
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
      render: () => (
        <Dropdown menu={{ items: getMenuItems() }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Filter data based on active filter
  const filteredData = communicationRecords.filter(
    (item: CommunicationRecord) => {
      let matchesFilter = true;

      if (activeFilter === "calls") {
        matchesFilter = item.deviceType === "phone";
      } else if (activeFilter === "sms") {
        matchesFilter =
          item.deviceType === "phone" && item.lastStatus === "delivered";
      } else if (activeFilter === "emails") {
        matchesFilter = item.deviceType === "email";
      }

      const matchesSearch =
        item.device?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.radioId?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.details?.toLowerCase().includes(searchText.toLowerCase());

      return matchesFilter && matchesSearch;
    }
  );

  const handleNewCommunication = (data: any, type: "call" | "sms") => {
    console.log(`New ${type}:`, data);
    // Here you would typically make an API call
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
            <h1
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }  `}
            >
              Communications
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all communications
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

            <Button type="primary" size="large" onClick={() => setIsModalOpen(true)}>
              <PlusOutlined />
              New
            </Button>
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
              Total Communications Today
            </div>
            <div className={`text-3xl font-semibold ${isDarkMode?"text-neutral-300":"text-neutral-700"}`}>
              {stats.totalToday}
            </div>
          </div>
          <div
            className={`${
              isDarkMode ? "bg-background-light border border-[#484c51]" : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-lg text-[var(--ant-color-primary)] font-medium mb-1">
              Active / Ongoing Calls
            </div>
            <div className={`text-3xl font-semibold ${isDarkMode?"text-neutral-300":"text-neutral-700"}`}>
              {stats.activeCalls}
            </div>
          </div>
          <div
            className={`${
              isDarkMode ? "bg-background-light border border-[#484c51]" : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-danger text-lg font-medium mb-1">
              Missed / Failed Communications
            </div>
            <div className={`text-3xl font-semibold ${isDarkMode?"text-neutral-300":"text-neutral-700"}`}>
              {stats.missedFailed}
            </div>
          </div>
          <div
            className={`${
              isDarkMode ? "bg-background-light border border-[#484c51]" : "bg-white"
            }  rounded-lg p-4 shadow-sm`}
          >
            <div className="text-[var(--ant-color-primary)] text-lg font-medium mb-1">
              Delivery Success Rate
            </div>
            <div className={`text-3xl font-semibold ${isDarkMode?"text-neutral-300":"text-neutral-700"}`}>
              {stats.successRate}
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
            loading={isLoading}
            dataSource={filteredData}
            pagination={{
              position: ["bottomCenter"],
              defaultPageSize: 10,
              showSizeChanger: false,
            }}
            className={`radio-management-table`}
          />
        </div>
      </div>
      <NewCommunicationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewCommunication}
      />
    </div>
  );
};

export default Communications;
