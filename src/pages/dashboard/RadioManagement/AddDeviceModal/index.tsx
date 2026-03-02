import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import { CustomInput } from "../../../../components/ui/CustomInput";
import { CustomSelect } from "../../../../components/ui/CustomSelect";
import { CustomButton } from "../../../../components/ui/CustomButton";

import { useAppSelector } from "../../../../store/hooks";
import { selectIsDarkMode } from "../../../../store/slices/Themeslice";

import { useAddDeviceMutation } from "../../../../store/api/radioManagementApi";

interface AddDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: DeviceFormValues) => void;
  initialValues?: DeviceFormValues;
  mode?: "add" | "edit" | "view";
}

export interface DeviceFormValues {
  radioName: string;
  imei: string;
  radioId: string;
  profile: string;
  icon: string;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  mode = "add",
}) => {
  const [formValues, setFormValues] = useState<DeviceFormValues>(
    initialValues || {
      radioName: "",
      imei: "",
      radioId: "",
      profile: "",
      icon: "",
    }
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof DeviceFormValues, string>>
  >({});

  const isDarkMode = useAppSelector(selectIsDarkMode);

  const [addDevice] = useAddDeviceMutation();

  const profileOptions = [
    { value: "teflon_267", label: "Teflon 267" },
    { value: "alpha_100", label: "Alpha 100" },
    { value: "bravo_200", label: "Bravo 200" },
    { value: "charlie_300", label: "Charlie 300" },
    { value: "delta_400", label: "Delta 400" },
  ];

  const iconOptions = [
    { value: "portable_radio", label: "Portable Radio" },
    { value: "base_station", label: "Base Station" },
    { value: "mobile_radio", label: "Mobile Radio" },
    { value: "repeater", label: "Repeater" },
    { value: "handheld", label: "Handheld" },
  ];

  const handleInputChange = (field: keyof DeviceFormValues, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DeviceFormValues, string>> = {};

    if (!formValues.radioName.trim()) {
      newErrors.radioName = "Radio name is required";
    }
    if (!formValues.imei.trim()) {
      newErrors.imei = "IMEI is required";
    }
    if (!formValues.radioId.trim()) {
      newErrors.radioId = "Radio ID is required";
    }
    if (!formValues.profile) {
      newErrors.profile = "Profile is required";
    }
    if (!formValues.icon) {
      newErrors.icon = "Icon is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        onSubmit?.(formValues);
        console.log("Form values:", formValues);
        const resp = await addDevice(formValues as DeviceFormValues);
        if (resp) {
          message.success("Device added successfully");
          handleClose();
        }
      }
    } catch (err) {
      console.log(err);
      message.error("Failed to add device");
    }
  };

  const handleClose = () => {
    setFormValues(
      initialValues || {
        radioName: "",
        imei: "",
        radioId: "",
        profile: "",
        icon: "",
      }
    );
    setErrors({});
    onClose();
  };

  const getTitle = () => {
    if (mode === "view") return formValues.radioName || "View Device";
    if (mode === "edit") return "Edit Device";
    return "Add New Device";
  };

  const getSubtitle = () => {
    if (mode === "view") return "View Device";
    if (mode === "edit") return "Edit Device Details";
    return "Add a new radio device to the system";
  };

  const isViewMode = mode === "view";

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
      className={`${isDarkMode ? "dark" : ""} `}
      closable={false}
    >
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } `}
            >
              {getTitle()}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{getSubtitle()}</p>
          </div>
          <Button
            type="text"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <CustomInput
          label="Radio Name"
          placeholder="Enter radio name"
          value={formValues.radioName}
          onChange={(e) => handleInputChange("radioName", e.target.value)}
          error={errors.radioName}
          disabled={isViewMode}
        />

        <CustomInput
          label="IMEI"
          placeholder="Enter IMEI number"
          value={formValues.imei}
          onChange={(e) => handleInputChange("imei", e.target.value)}
          error={errors.imei}
          disabled={isViewMode}
        />

        <CustomInput
          label="Radio ID"
          placeholder="Enter radio ID"
          value={formValues.radioId}
          onChange={(e) => handleInputChange("radioId", e.target.value)}
          error={errors.radioId}
          disabled={isViewMode}
        />

        <CustomSelect
          label="Profile"
          placeholder="Select profile"
          options={profileOptions}
          value={formValues.profile}
          onChange={(value) => handleInputChange("profile", value as string)}
          error={errors.profile}
          disabled={isViewMode}
        />

        <CustomSelect
          label="Icon"
          placeholder="Select icon"
          options={iconOptions}
          value={formValues.icon}
          onChange={(value) => handleInputChange("icon", value as string)}
          error={errors.icon}
          disabled={isViewMode}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
        <Button size="large" onClick={handleClose}>
          Cancel
        </Button>
        {!isViewMode && (
          <CustomButton
            label={mode === "edit" ? "Update" : "OK"}
            onClick={handleSubmit}
          />
        )}
      </div>
    </Modal>
  );
};

export default AddDeviceModal;
