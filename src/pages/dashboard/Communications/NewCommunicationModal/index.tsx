import React, { useState, useRef } from "react";
import { Modal, Tabs, Button, Slider, Switch, message } from "antd";
import { Input } from "antd";
import {
  SoundOutlined,
  AudioOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { CustomInput } from "../../../../components/ui/CustomInput";
import { CustomSelect } from "../../../../components/ui/CustomSelect";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsDarkMode } from "../../../../store/slices/Themeslice";
import {
  useSendMessageMutation,
  useSendEmergencyMessageMutation,
} from "../../../../store/api/messageOperations";

interface NewCommunicationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: CallData | SmsData, type: "call" | "sms") => void;
}

interface CallData {
  volumeLevel: number;
  microphoneEnabled: boolean;
  mode: "tx" | "rx";
  duration: number;
}

interface SmsFormData {
  radioId: string; // Keep as string for input
  messageType: "UNICAST" | "BROADCAST" | "GROUP";
  messageCategory: "normal" | "emergency";
}

interface SmsData {
  radioId: string;
  messageType: "UNICAST" | "BROADCAST" | "GROUP";
  messageCategory: "normal" | "emergency";
  message: string;
}

const NewCommunicationModal: React.FC<NewCommunicationModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<string>("call");
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const messageTextAreaRef = useRef<any>(null);

  // Call state
  const [volumeLevel, setVolumeLevel] = useState<number>(50);
  const [microphoneEnabled, setMicrophoneEnabled] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<"tx" | "rx">("tx");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();
  const [sendEmergencyMessage, { isLoading: isSendingEmergency }] =
    useSendEmergencyMessageMutation();

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SmsFormData>({
    defaultValues: {
      radioId: "",
      messageType: "UNICAST",
      messageCategory: "normal",
    },
  });

  const messageCategory = watch("messageCategory");

  const handleClose = () => {
    setActiveTab("call");
    setVolumeLevel(50);
    setMicrophoneEnabled(false);
    setSelectedMode("tx");
    setIsRecording(false);
    setDuration(0);
    reset();
    if (messageTextAreaRef.current) {
      messageTextAreaRef.current.value = "";
    }
    onClose();
  };

  const validateCall = (): boolean => {
    return true;
  };

  const onSmsSubmit = async (data: SmsFormData) => {
    const messageValue =
      messageTextAreaRef.current?.resizableTextArea?.textArea?.value || "";

    if (messageCategory === "normal" && !messageValue.trim()) {
      message.error("Message is required");
      return;
    }

    if (messageValue.length > 500) {
      message.error("Message cannot exceed 500 characters");
      return;
    }

    // Validate and convert radioId to number
    const radioIdNumber = parseInt(data.radioId, 10);
    if (isNaN(radioIdNumber)) {
      message.error("Radio ID must be a valid number");
      return;
    }

    try {
      const smsData = {
        radioId: radioIdNumber, // Convert to number
        messageType: data.messageType,
        message: messageValue,
      };

      let response;
      if (data.messageCategory === "emergency") {
        response = await sendEmergencyMessage({
          radioId: radioIdNumber, // Convert to number
          messageType: data.messageType,
          message: messageValue || "EMERGENCY: Immediate assistance required!",
        }).unwrap();
      } else {
        response = await sendMessage(smsData).unwrap();
      }

      if (response.success) {
        message.success(response.message);
        handleClose();
      }
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to send message");
    }
  };

  const handleSubmit = async () => {
    if (activeTab === "call") {
      if (validateCall()) {
        const callData: CallData = {
          volumeLevel,
          microphoneEnabled,
          mode: selectedMode,
          duration,
        };
        onSubmit?.(callData, "call");
        handleClose();
      }
    } else {
      handleFormSubmit(onSmsSubmit)();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const CallTab = () => (
    <div className="py-8">
      <div className="flex flex-col items-center mb-8">
        <button
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 scale-110"
              : "bg-red-400 hover:bg-red-500"
          }`}
          onMouseDown={() => setIsRecording(true)}
          onMouseUp={() => setIsRecording(false)}
          onMouseLeave={() => setIsRecording(false)}
        >
          <AudioOutlined className="text-white text-5xl" />
        </button>
        <span
          className={`font-medium mt-4 text-lg ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}
        >
          Push to Talk
        </span>
      </div>

      <div className="flex items-center justify-center gap-8 mb-8">
        <div className="flex items-center gap-3 w-48">
          <SoundOutlined
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          />
          <Slider
            value={volumeLevel}
            onChange={setVolumeLevel}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-3">
          <AudioOutlined
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          />
          <Switch checked={microphoneEnabled} onChange={setMicrophoneEnabled} />
        </div>

        <div className="flex gap-2">
          <Button
            type={selectedMode === "tx" ? "primary" : "default"}
            onClick={() => setSelectedMode("tx")}
            className={
              selectedMode === "tx" ? "bg-blue-500 hover:bg-blue-600" : ""
            }
          >
            TX
          </Button>
          <Button
            type={selectedMode === "rx" ? "primary" : "default"}
            onClick={() => setSelectedMode("rx")}
            className={
              selectedMode === "rx" ? "bg-blue-500 hover:bg-blue-600" : ""
            }
          >
            RX
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 px-12">
        <span
          className={`font-medium text-lg ${
            isDarkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          {formatTime(duration)}
        </span>
        <div className="flex-1 max-w-md">
          <Slider
            value={duration}
            max={60}
            onChange={setDuration}
            tooltip={{ formatter: (value) => formatTime(value || 0) }}
          />
        </div>
        <span
          className={`font-medium text-lg ${
            isDarkMode ? "text-gray-200" : "text-gray-900"
          }`}
        >
          -1:00
        </span>
      </div>

      <div className="flex justify-center mt-4">
        <Button
          type="primary"
          shape="circle"
          icon={<PlayCircleOutlined />}
          size="large"
          className="bg-blue-500 hover:bg-blue-600"
        />
      </div>
    </div>
  );

  const SmsTab = () => (
    <div className="py-6">
      <Controller
        name="radioId"
        control={control}
        rules={{
          required: "Radio ID is required",
          pattern: {
            value: /^[0-9]+$/,
            message: "Radio ID must be a valid number",
          },
        }}
        render={({ field }) => (
          <CustomInput
            label="Radio ID"
            placeholder="Enter Radio ID (e.g., 12345)"
            isDarkMode={isDarkMode}
            {...field}
            error={errors.radioId?.message}
            required
            type="number"
          />
        )}
      />

      <Controller
        name="messageType"
        control={control}
        rules={{
          required: "Message type is required",
        }}
        render={({ field }) => (
          <CustomSelect
            label="Message Type"
            placeholder="Select message type"
            isDarkMode={isDarkMode}
            {...field}
            error={errors.messageType?.message}
            required
            options={[
              { label: "Unicast", value: "UNICAST" },
              { label: "Broadcast", value: "BROADCAST" },
              { label: "Group", value: "GROUP" },
            ]}
          />
        )}
      />

      <Controller
        name="messageCategory"
        control={control}
        rules={{
          required: "Category is required",
        }}
        render={({ field }) => (
          <CustomSelect
            label="Category"
            placeholder="Select category"
            isDarkMode={isDarkMode}
            {...field}
            required
            options={[
              { label: "Normal Message", value: "normal" },
              { label: "Emergency Message", value: "emergency" },
            ]}
          />
        )}
      />

      <div className="relative mb-4">
        <label
          className={`block text-sm font-medium mb-2 ${
            isDarkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Message
          {messageCategory === "normal" && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
        <Input.TextArea
          ref={messageTextAreaRef}
          placeholder={
            messageCategory === "emergency"
              ? "Optional: Custom emergency message (default: EMERGENCY: Immediate assistance required!)"
              : "Type your message..."
          }
          className={`${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-600 hover:border-blue-500 focus:border-blue-500"
              : ""
          }`}
          rows={8}
          maxLength={500}
        />
        <div
          className={`absolute bottom-3 right-3 text-sm ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          0/500
        </div>
      </div>
    </div>
  );

  const tabItems = [
    {
      key: "call",
      label: "Call",
      children: <CallTab />,
    },
    {
      key: "sms",
      label: "Sms",
      children: <SmsTab />,
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
      centered
      closable={false}
      className={`new-communication-modal ${
        isDarkMode ? "[&_.ant-modal-content]:bg-gray-800" : ""
      }`}
    >
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            New
          </h2>
          <Button
            type="text"
            onClick={handleClose}
            className={
              isDarkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-400 hover:text-gray-600"
            }
          >
            ✕
          </Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          centered
          className="custom-tabs"
        />
      </div>

      <div
        className={`flex justify-end gap-3 pt-4 border-t mt-6 ${
          isDarkMode ? "border-gray-700" : ""
        }`}
      >
        <Button size="large" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          loading={isSendingMessage || isSendingEmergency}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Send
        </Button>
      </div>
    </Modal>
  );
};

export default NewCommunicationModal;
