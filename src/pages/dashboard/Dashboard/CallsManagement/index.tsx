import React, { useState, useMemo, useEffect } from "react";
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
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PhoneOutlined,
  TeamOutlined,
  SoundOutlined,
  PlayCircleOutlined,
  ExportOutlined,
  StopOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsDarkMode } from "../../../../store/slices/Themeslice";
import {
  useStartCallMutation,
  useStopCallMutation,
} from "../../../../store/api/callOperations";
import { 
  useGetCallStatusQuery,
} from "../../../../store/api/dashboardApi";
import { ConfirmationModal } from "../../../../components/ui/ConfirmationModal";
import { CustomButton } from "../../../../components/ui/CustomButton";
import { POLLING_INTERVAL } from "../../../../utils/global";
import { PushToTalkSection } from "../../../../components/ui/PushToTalk";

const { TabPane } = Tabs;
const { Option } = Select;
const { Text } = Typography;

type CallType = "PRIVATE" | "GROUP" | "BROADCAST";
type CallStatus = "IDLE" | "INCOMING" | "OUTGOING";

interface CallHistoryRecord {
  key: string;
  time: string;
  radioId: string;
  type: string;
  description: string;
  duration: number;
  status: "INCOMING" | "OUTGOING";
}

const getStatusIcon = (status: CallStatus) => {
  switch (status) {
    case "INCOMING":
      return <ArrowDownOutlined className="text-green-500" />;
    case "OUTGOING":
      return <ArrowUpOutlined className="text-red-500" />;
    default:
      return <PhoneOutlined />;
  }
};

const getStatusTag = (status: CallStatus) => {
  switch (status) {
    case "INCOMING":
      return (
        <Tag color="green" icon={<ArrowDownOutlined />}>
          INCOMING
        </Tag>
      );
    case "OUTGOING":
      return (
        <Tag color="red" icon={<ArrowUpOutlined />}>
          OUTGOING
        </Tag>
      );
    default:
      return null;
  }
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

const CallsManagement: React.FC = () => {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const [activeTab, setActiveTab] = useState("history");
  const [selectedUnit, setSelectedUnit] = useState("101");
  const [selectedChannel, setSelectedChannel] = useState("Channel");
  const [pendingCall, setPendingCall] = useState<CallType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [startCall, { isLoading: isStarting }] = useStartCallMutation();
  const [stopCall, { isLoading: isStopping }] = useStopCallMutation();

  const radioId = parseInt(selectedUnit, 10);

  const { data: callStatusData, isLoading } = useGetCallStatusQuery(radioId, {
    pollingInterval: 2000,
    skipPollingIfUnfocused: true,
  });

  // Extract current status from backend
  const currentCallStatus: CallStatus = useMemo(() => {
    return (callStatusData?.data?.currentStatus?.callType as CallStatus) || "IDLE";
  }, [callStatusData]);

  // Find ongoing call from DB records
  const ongoingCall = useMemo(() => {
    return callStatusData?.data?.callRecords?.find(
      (record: any) => record.callActualEndTime === null && 
      (record.initiative === "INCOMING" || record.initiative === "OUTGOING")
    );
  }, [callStatusData]);

  // Get duration from ongoing call in DB
  const callDuration = useMemo(() => {
    return ongoingCall?.durationSeconds || 0;
  }, [ongoingCall]);

  // Check if there's an active call
  const activeCall = useMemo(() => {
    if (currentCallStatus === "IDLE") return null;
    return {
      id: radioId,
      callType: "PRIVATE" as CallType,
    };
  }, [currentCallStatus, radioId]);

  // Call history from DB records
  const callHistory: CallHistoryRecord[] = useMemo(() => {
    if (!callStatusData?.data?.callRecords) return [];

    return callStatusData.data.callRecords.map((record: any, index: number) => {
      const isIncoming = record.initiative === "INCOMING";
      const createdAt = new Date(record.createdAt);

      return {
        key: `${record.id}-${index}`,
        time: createdAt.toLocaleString(),
        radioId: `Radio ${record.radioId}`,
        type: record.initiative,
        description: record.partnerId && record.partnerId !== 0
          ? `Call with Radio ${record.partnerId}` 
          : "Broadcast call",
        duration: record.durationSeconds || 0,
        status: isIncoming ? "INCOMING" : "OUTGOING",
      };
    });
  }, [callStatusData]);

  const historyColumns: ColumnsType<CallHistoryRecord> = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: "20%",
    },
    {
      title: "Radio ID",
      dataIndex: "radioId",
      key: "radioId",
      width: "15%",
      render: (text: string, record: CallHistoryRecord) => (
        <div className="flex items-center gap-2">
          {record.status === "INCOMING" ? (
            <ArrowDownOutlined className="text-green-500" />
          ) : (
            <ArrowUpOutlined className="text-red-500" />
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "12%",
      render: (status: "INCOMING" | "OUTGOING") => (
        <Tag 
          color={status === "INCOMING" ? "green" : "red"} 
          icon={status === "INCOMING" ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: "12%",
      render: (duration: number) => (
        <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
          {formatDuration(duration)}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "28%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "13%",
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
    if (activeCall && pendingCall !== callType) {
      setPendingCall(callType);
      setShowConfirmModal(true);
      return;
    }

    if (activeCall) {
      message.warning(`${callType} call is already active`);
      return;
    }

    const currentRadioId = parseInt(selectedUnit, 10);
    if (!currentRadioId || isNaN(currentRadioId)) {
      message.error("Invalid radio ID selected");
      return;
    }

    try {
      const response = await startCall({
        id: currentRadioId,
        callType,
      }).unwrap();

      if (response.success) {
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

        const currentRadioId = parseInt(selectedUnit, 10);
        if (!currentRadioId || isNaN(currentRadioId)) {
          message.error("Invalid radio ID selected");
          setPendingCall(null);
          setShowConfirmModal(false);
          return;
        }

        const startResponse = await startCall({
          id: currentRadioId,
          callType: pendingCall,
        }).unwrap();

        if (startResponse.success) {
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
                        disabled={currentCallStatus !== "IDLE"}
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
                        disabled={currentCallStatus !== "IDLE"}
                      >
                        Group Call
                      </CustomButton>
                    )}

                    <CustomButton
                      icon={<SoundOutlined />}
                      onClick={() => handleStartCall("BROADCAST")}
                      loading={isStarting}
                      disabled={currentCallStatus !== "IDLE"}
                    >
                      All Call
                    </CustomButton>
                  </div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Select
                        value={selectedUnit}
                        onChange={setSelectedUnit}
                        style={{ width: "100%" }}
                        size="large"
                      >
                        <Option value="101">Radio 101</Option>
                        <Option value="102">Radio 102</Option>
                        <Option value="103">Radio 103</Option>
                        <Option value="104">Radio 104</Option>
                        <Option value="105">Radio 105</Option>
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

              <TabPane tab="Call History" key="history">
                <div style={{ maxHeight: '500px', overflowY: 'hidden' }}>
                  <Table
                    columns={historyColumns}
                    dataSource={callHistory}
                    size="small"
                    loading={isLoading}
                    pagination={false}
                    scroll={{ y: 450 }}
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <div className="sticky top-6">
            <PushToTalkSection />
          </div>
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