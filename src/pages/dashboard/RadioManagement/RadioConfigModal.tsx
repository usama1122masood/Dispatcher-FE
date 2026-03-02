import React, { useState } from "react";
import { Modal, Select, Radio, Switch, Button, message } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../../store/hooks";
import { selectIsDarkMode } from "../../../store/slices/Themeslice";
import {
  useSetChannelMutation,
  useSetPowerLevelMutation,
  useSetEncryptionMutation,
} from "../../../store/api/radioConfigApi";

// Define RadioDevice interface locally
interface RadioDevice {
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

interface RadioConfigModalProps {
  open: boolean;
  onClose: () => void;
  device: RadioDevice | null;
}

const RadioConfigModal: React.FC<RadioConfigModalProps> = ({
  open,
  onClose,
  device,
}) => {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const [selectedChannel, setSelectedChannel] = useState<number>(1);
  const [powerLevel, setPowerLevel] = useState<number>(2); // 0=Low, 1=Medium, 2=Hard
  const [encryptionEnabled, setEncryptionEnabled] = useState<boolean>(false);

  // Renamed mutation functions to avoid conflict
  const [setChannelConfig, { isLoading: isChannelLoading }] = useSetChannelMutation();
  const [setPowerLevelConfig, { isLoading: isPowerLoading }] = useSetPowerLevelMutation();
  const [setEncryptionConfig, { isLoading: isEncryptionLoading }] = useSetEncryptionMutation();

  if (!device) return null;

  // Generate channel options (1-40)
  const channelOptions = Array.from({ length: 40 }, (_, i) => ({
    label: `Channel ${i + 1}`,
    value: i + 1,
  }));

  const handleApplyConfig = async () => {
    try {
      // Apply Channel Configuration
      await setChannelConfig({
        configType: "CHANNEL_SET",
        channel: selectedChannel,
      }).unwrap();

      // Apply Power Level Configuration
      await setPowerLevelConfig({
        configType: "POWER_LEVEL",
        powerLevel: powerLevel,
      }).unwrap();

      // Apply Encryption Configuration
      await setEncryptionConfig({
        configType: "ENCRYPTION",
        encryptionEnabled: encryptionEnabled,
      }).unwrap();

      message.success("Radio configuration updated successfully!");
      onClose();
    } catch (error: any) {
      console.error("Configuration error:", error);
      message.error(error?.data?.message || "Failed to update configuration");
    }
  };

  const handleManageKeys = () => {
    message.info("Manage Encryption Keys feature coming soon");
  };

  const handleZeroize = () => {
    Modal.confirm({
      title: "Zeroize Radio",
      content: "This will permanently clear all secure data from the radio. This action cannot be undone. Are you sure?",
      okText: "Yes, Zeroize",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        message.warning("Zeroize feature is pending implementation");
      },
    });
  };

  const isLoading = isChannelLoading || isPowerLoading || isEncryptionLoading;

  return (
    <Modal
      title="Radio Configuration"
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      className={isDarkMode ? "dark-modal" : ""}
    >
      <div className="space-y-6 py-4">
        {/* Power Channel */}
        <div>
          <label
            className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Power Channel
          </label>
          <Select
            value={selectedChannel}
            onChange={setSelectedChannel}
            options={channelOptions}
            className="w-full"
            size="large"
            showSearch
          />
        </div>

        {/* Power Level */}
        <div>
          <label
            className={`block text-sm font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Power Level
          </label>
          <Radio.Group
            value={powerLevel}
            onChange={(e) => setPowerLevel(e.target.value)}
            className="flex gap-4"
          >
            <Radio value={0}>Silent</Radio>
            <Radio value={1}>Low</Radio>
            <Radio value={2}>Medium</Radio>
            <Radio value={3}>High</Radio>
          </Radio.Group>
        </div>

        {/* Security */}
        <div>
          <label
            className={`block text-sm font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Security
          </label>
          
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Encryption Enabled
            </span>
            <Switch
              checked={encryptionEnabled}
              onChange={setEncryptionEnabled}
            />
          </div>

          <Button
            block
            size="large"
            onClick={handleManageKeys}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200"
          >
            Manage Encryption Keys
          </Button>
        </div>

        {/* Zeroize */}
        <div>
          <label
            className={`block text-sm font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Zeroize
          </label>
          
          <Button
            block
            danger
            size="large"
            icon={<WarningOutlined />}
            onClick={handleZeroize}
          >
            Zeroize Radio
          </Button>
          
          <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
            Permanently clears secure data from the radio
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            size="large"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleApplyConfig}
            className="flex-1"
            loading={isLoading}
          >
            Apply Configuration
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RadioConfigModal;