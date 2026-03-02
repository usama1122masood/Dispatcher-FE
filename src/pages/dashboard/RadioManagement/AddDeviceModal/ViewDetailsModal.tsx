import React from "react";
import { Modal, Descriptions } from "antd";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsDarkMode } from "../../../../store/slices/Themeslice";



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

interface ViewDetailsModalProps {
  open: boolean;
  onClose: () => void;
  device: RadioDevice | null;
}


const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({
  open,
  onClose,
  device,
}) => {
  const isDarkMode = useAppSelector(selectIsDarkMode);

  if (!device) return null;

  return (
    <Modal
      title="View Details"
      open={open}
      onCancel={onClose}
      footer={[
        <button
          key="cancel"
          onClick={onClose}
          className={`px-4 py-2 rounded ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-900"
          }`}
        >
          Cancel
        </button>,
        <button
          key="ok"
          onClick={onClose}
          className="px-4 py-2 ml-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          OK
        </button>,
      ]}
      width={600}
      className={isDarkMode ? "dark-modal" : ""}
    >
      <div className="space-y-6 py-4">
        {/* Radio Specifications */}
        <div>
          <h3
            className={`text-sm font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Radio specifications
          </h3>
          <div className="space-y-2">
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              XYZ details
            </div>
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              XYZ details
            </div>
          </div>
        </div>

        {/* Model */}
        <div>
          <h3
            className={`text-sm font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Model
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            XYZ Models
          </p>
        </div>

        {/* Firmware Version */}
        <div>
          <h3
            className={`text-sm font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Firmware version
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            5.2
          </p>
        </div>

        {/* Serial Number */}
        <div>
          <h3
            className={`text-sm font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Serial number
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            666262161616616
          </p>
        </div>

        {/* Current Status */}
        <div>
          <h3
            className={`text-sm font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Current status
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            XYZ details
          </p>
        </div>

        {/* Configuration Settings */}
        <div>
          <h3
            className={`text-sm font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Configuration settings
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            ABC details
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ViewDetailsModal;