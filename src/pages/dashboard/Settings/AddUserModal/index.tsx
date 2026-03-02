import React, { useState } from "react";
import { Modal, Button, Radio, Checkbox, Space, message } from "antd";
import {
  CustomTextArea,
  CustomInput,
} from "../../../../components/ui/CustomInput";

import { useAddUserMutation } from "../../../../store/api/userManagementApi";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: UserFormValues) => void;
  initialValues?: UserFormValues;
  mode?: "add" | "edit";
}

export interface UserFormValues {
  name: string;
  description: string;
  status: "active" | "inactive";
  permissions: string[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  initialValues,
  mode = "add",
}) => {
  const [formValues, setFormValues] = useState<UserFormValues>(
    initialValues || {
      name: "",
      description: "",
      status: "active",
      permissions: [],
    }
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormValues, string>>
  >({});

  const [addUser] = useAddUserMutation();

  const permissionOptions = [
    { label: "View Logs", value: "view_logs" },
    { label: "Edit Logs", value: "edit_logs" },
    { label: "Manage Users", value: "manage_users" },
    { label: "Delete Logs", value: "delete_logs" },
  ];

  const handleInputChange = (field: keyof UserFormValues, value: any) => {
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
    const newErrors: Partial<Record<keyof UserFormValues, string>> = {};

    if (!formValues.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formValues.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formValues.permissions.length === 0) {
      newErrors.permissions = "At least one permission is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (validateForm()) {
        const resp = await addUser(formValues);
        if (resp) {
          message.success("User added successfully");
          handleClose();
        }
        handleClose();
      }
    } catch (err) {
      console.log(err);
      message.error("Failed to add user");
    }
  };

  const handleClose = () => {
    setFormValues(
      initialValues || {
        name: "",
        description: "",
        status: "active",
        permissions: [],
      }
    );
    setErrors({});
    onClose();
  };

  const handlePermissionsChange = (checkedValues: string[]) => {
    handleInputChange("permissions", checkedValues);
  };

  // Update form values when initialValues change
  React.useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
      closable={false}
    >
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">
              {mode === "edit" ? formValues.name : "Add New User"}
            </h2>
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

      <div className="space-y-6">
        {/* Name Field */}
        <CustomInput
          label="Name"
          placeholder="Name"
          value={formValues.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
        />

        {/* Description Field */}
        <CustomTextArea
          label="Description"
          placeholder="Description"
          value={formValues.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          error={errors.description}
          rows={3}
        />

        {/* Status Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-3">
            Status
          </label>
          <Radio.Group
            value={formValues.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
          >
            <Space direction="horizontal" size="large">
              <Radio value="active">Active</Radio>
              <Radio value="inactive">Inactive</Radio>
            </Space>
          </Radio.Group>
        </div>

        {/* Permissions Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-3">
            Permissions
          </label>
          <Checkbox.Group
            options={permissionOptions}
            value={formValues.permissions}
            onChange={handlePermissionsChange}
            className="flex flex-col gap-3"
          />
          {errors.permissions && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.permissions}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
        <Button size="large" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default AddUserModal;
