import React, { useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Select,
  Row,
  Col,
  Space,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PhoneOutlined,
  TeamOutlined,
  SoundOutlined,
  PlayCircleOutlined,
  ExportOutlined,
  AudioOutlined,
  SoundFilled,
  StopOutlined,
  WarningOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsDarkMode } from "../../../../store/slices/Themeslice";
import {
  useStartCallMutation,
  useStopCallMutation,
} from "../../../../store/api/callOperations";
import { useGetCallRecordsQuery } from "../../../../store/api/dashboardApi";
import { ConfirmationModal } from "../../../../components/ui/ConfirmationModal";
import { CustomButton } from "../../../../components/ui/CustomButton";
import { POLLING_INTERVAL } from "../../../../utils/global";
import { PushToTalkSection } from "../../../../components/ui/PushToTalk";

const { TabPane } = Tabs;
const { Option } = Select;
const { Text } = Typography;

interface CallRecord {
  key: string;
  time: string;
  radioId: string;
  type: string;
  typeColor: string;
  description: string;
}

type CallType = "PRIVATE" | "GROUP" | "BROADCAST";

interface ActiveCall {
  id: number;
  callType: CallType;
}

const getRecentActivityIconByType = (type: string) => {
  console.debug({ type });
  switch (type) {
    case "Alert":
      return <WarningOutlined />;
    case "Message":
      return <MessageOutlined />;
    default:
      return <PhoneOutlined />;
  }
};

const CallsManagement: React.FC = () => {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const [activeTab, setActiveTab] = useState("recent");
  const [selectedUnit, setSelectedUnit] = useState("R-101 - Unit Alpha-1");
  const [selectedChannel, setSelectedChannel] = useState("Channel");
  const [volumeLevel, setVolumeLevel] = useState(60);
  const [micLevel, setMicLevel] = useState(80);
  const [isTX, setIsTX] = useState(true);
  const [isRX, setIsRX] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [pendingCall, setPendingCall] = useState<CallType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [startCall, { isLoading: isStarting }] = useStartCallMutation();
  const [stopCall, { isLoading: isStopping }] = useStopCallMutation();

  const { data: callRecords, isLoading } = useGetCallRecordsQuery(undefined, {
    pollingInterval: POLLING_INTERVAL, // 5 seconds
    skipPollingIfUnfocused: true, // stops when tab is inactive
  });

  const extractRadioId = (unitString: string): number => {
    const match = unitString.match(/R-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const columns: ColumnsType<CallRecord> = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: "15%",
    },
    {
      title: "Radio ID",
      dataIndex: "radioId",
      key: "radioId",
      width: "15%",
      render: (text: string, record: CallRecord) => (
        <div className="flex items-center gap-2">
          {getRecentActivityIconByType(record.type)}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "15%",
      render: (text: string, record: CallRecord) => (
        <span
          className={`font-medium ${
            record.typeColor === "orange"
              ? "text-orange-500"
              : record.typeColor === "red"
                ? "text-red-500"
                : isDarkMode
                  ? "text-white"
                  : "text-gray-900"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "40%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: () => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<PlayCircleOutlined />}
            className={
              isDarkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-500 hover:text-blue-600"
            }
          />
          <Button
            type="text"
            icon={<ExportOutlined />}
            className={
              isDarkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-500 hover:text-blue-600"
            }
          />
        </div>
      ),
    },
  ];

  const handleStartCall = async (callType: CallType) => {
    if (activeCall && activeCall.callType !== callType) {
      setPendingCall(callType);
      setShowConfirmModal(true);
      return;
    }

    if (activeCall && activeCall.callType === callType) {
      message.warning(`${callType} call is already active`);
      return;
    }

    const radioId = extractRadioId(selectedUnit);
    if (!radioId) {
      message.error("Invalid radio ID selected");
      return;
    }

    try {
      const response = await startCall({
        id: radioId,
        callType,
      }).unwrap();

      if (response.success) {
        setActiveCall({
          id: 100,
          callType,
        });
        message.success(response.message);
      }
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to start call");
    }
  };

  const handleStopCall = async () => {
    if (!activeCall) return;

    try {
      const response = await stopCall({
        id: activeCall.id,
        callType: activeCall.callType,
      }).unwrap();

      if (response.success) {
        setActiveCall(null);
        message.success(response.message);
      }
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to stop call");
    }
  };

  const handleConfirmSwitch = async () => {
    if (!pendingCall || !activeCall) return;

    try {
      const stopResponse = await stopCall({
        id: activeCall.id,
        callType: activeCall.callType,
      }).unwrap();

      if (stopResponse.success) {
        message.success(stopResponse.message);
        setActiveCall(null);

        const radioId = extractRadioId(selectedUnit);
        if (!radioId) {
          message.error("Invalid radio ID selected");
          setPendingCall(null);
          setShowConfirmModal(false);
          return;
        }

        const startResponse = await startCall({
          id: radioId,
          callType: pendingCall,
        }).unwrap();

        if (startResponse.success) {
          setActiveCall({
            id: 100,
            callType: pendingCall,
          });
          message.success(startResponse.message);
        }
      }
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to switch call");
    } finally {
      setPendingCall(null);
      setShowConfirmModal(false);
    }
  };

  const handleCancelSwitch = () => {
    setPendingCall(null);
    setShowConfirmModal(false);
  };

  const getCallTypeLabel = (callType: CallType) => {
    switch (callType) {
      case "PRIVATE":
        return "Private Call";
      case "GROUP":
        return "Group Call";
      case "BROADCAST":
        return "Broadcast Call";
      default:
        return "Call";
    }
  };

  return (
    <div
      className={`transition-colors ${
        isDarkMode ? "bg-background" : "bg-white"
      }`}
    >
      <Row gutter={24} className="w-full" style={{ marginInline: 0 }}>
        <Col xs={24} lg={16}>
          <div className="min-h-[350px]">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              type="card"
              tabBarExtraContent={
                activeTab === "recent" && (
                  <Button
                    type="link"
                    icon={<SoundOutlined />}
                    className={isDarkMode ? "text-blue-400" : "text-blue-500"}
                  >
                    Recent Calls & Events
                  </Button>
                )
              }
            >
              <TabPane
                tab={
                  <span>
                    <PhoneOutlined /> Calls
                  </span>
                }
                key="calls"
              >
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <div className="flex gap-3 flex-wrap">
                    {activeCall?.callType === "PRIVATE" ? (
                      <CustomButton
                        icon={<StopOutlined />}
                        onClick={handleStopCall}
                        loading={isStopping}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Stop Private Call
                      </CustomButton>
                    ) : (
                      <CustomButton
                        icon={<PhoneOutlined />}
                        onClick={() => handleStartCall("PRIVATE")}
                        loading={isStarting}
                      >
                        Private Call
                      </CustomButton>
                    )}

                    {activeCall?.callType === "GROUP" ? (
                      <CustomButton
                        icon={<StopOutlined />}
                        onClick={handleStopCall}
                        loading={isStopping}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Stop Group Call
                      </CustomButton>
                    ) : (
                      <CustomButton
                        icon={<TeamOutlined />}
                        onClick={() => handleStartCall("GROUP")}
                        loading={isStarting}
                      >
                        Group Call
                      </CustomButton>
                    )}

                    <CustomButton
                      icon={<SoundOutlined />}
                      onClick={() => handleStartCall("BROADCAST")}
                      loading={isStarting}
                      disabled={activeCall?.callType === "BROADCAST"}
                    >
                      All Call
                    </CustomButton>
                  </div>

                  {activeCall && (
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode
                          ? "bg-gray-800 border border-gray-700"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <Text
                        className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Active Call:{" "}
                        <Text
                          strong
                          className={
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }
                        >
                          {getCallTypeLabel(activeCall.callType)}
                        </Text>
                      </Text>
                    </div>
                  )}

                  <Row gutter={16}>
                    <Col span={12}>
                      <Select
                        value={selectedUnit}
                        onChange={setSelectedUnit}
                        style={{ width: "100%" }}
                        size="large"
                      >
                        <Option value="R-101 - Unit Alpha-1">
                          R-101 - Unit Alpha-1
                        </Option>
                        <Option value="R-102 - Unit Alpha-2">
                          R-102 - Unit Alpha-2
                        </Option>
                        <Option value="R-103 - Unit Beta-1">
                          R-103 - Unit Beta-1
                        </Option>
                      </Select>
                    </Col>
                    <Col span={12}>
                      <Select
                        value={selectedChannel}
                        onChange={setSelectedChannel}
                        style={{ width: "100%" }}
                        size="large"
                      >
                        <Option value="Channel">Channel</Option>
                        <Option value="Channel 1">Channel 1</Option>
                        <Option value="Channel 2">Channel 2</Option>
                        <Option value="Channel 3">Channel 3</Option>
                      </Select>
                    </Col>
                  </Row>
                </Space>
              </TabPane>

              <TabPane tab="Recent Calls & Events" key="recent">
                <Table
                  columns={columns}
                  dataSource={callRecords ?? []}
                  size="small"
                  loading={isLoading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    position: ["bottomCenter"],
                  }}
                />
              </TabPane>
            </Tabs>
          </div>
        </Col>

        <Col xs={24} lg={8} className="flex items-center">
          <PushToTalkSection />
        </Col>
      </Row>

      <ConfirmationModal
        open={showConfirmModal}
        onConfirm={handleConfirmSwitch}
        onCancel={handleCancelSwitch}
        title="Switch Call Type"
        message={`You currently have an active ${activeCall ? getCallTypeLabel(activeCall.callType) : "call"}. Do you want to stop it and start a ${pendingCall ? getCallTypeLabel(pendingCall) : "new call"}?`}
      />
    </div>
  );
};

export default CallsManagement;
