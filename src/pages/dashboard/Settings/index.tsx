import React, { useState, useMemo, useCallback } from "react";
import {
  Tabs,
  Button,
  Upload,
  Avatar,
  Table,
  Tag,
  Dropdown,
  Space,
} from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  CustomInput,
  CustomPassword,
} from "../../../components/ui/CustomInput";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import AddUserModal, { type UserFormValues } from "./AddUserModal";
import { useAppSelector } from "../../../store/hooks";
import { selectIsDarkMode } from "../../../store/slices/Themeslice";

import { useGetUsersQuery } from "../../../store/api/userManagementApi";
import { POLLING_INTERVAL } from "../../../utils/global";

interface SettingsFormData {
  accountName: string;
  password: string;
  confirmPassword: string;
  language: string;
  profileImage: string | null;
}

interface UserRole {
  key: string;
  user: string;
  description: string;
  permissions: string[];
  status: "active" | "pending" | "inactive";
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("settings");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const { data: users = [], isLoading } = useGetUsersQuery(undefined, {
    pollingInterval: POLLING_INTERVAL, // 5 seconds
    skipPollingIfUnfocused: true, // stops when tab is inactive
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SettingsFormData>({
    accountName: "Sam Smith",
    password: "",
    confirmPassword: "",
    language: "english",
    profileImage: null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SettingsFormData, string>>
  >({});

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "chinese", label: "Chinese" },
  ];

  const handleInputChange = useCallback((field: keyof SettingsFormData, value: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
      setSettingsForm((prev) => ({
        ...prev,
        profileImage: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload behavior
  }, []);

  const validateSettings = (): boolean => {
    const newErrors: Partial<Record<keyof SettingsFormData, string>> = {};

    if (!settingsForm.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }

    if (settingsForm.password && settingsForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (settingsForm.password !== settingsForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!settingsForm.language) {
      newErrors.language = "Language is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (activeTab === "settings") {
      if (validateSettings()) {
        console.log("Settings saved:", settingsForm);
        // Make API call to save settings
      }
    } else {
      // Save user roles logic
      // Make API call to save user roles
    }
  };

  const handleCancel = () => {
    setSettingsForm({
      accountName: "Sam Smith",
      password: "",
      confirmPassword: "",
      language: "english",
      profileImage: null,
    });
    setProfileImage(null);
    setErrors({});
  };

  const handleAddUser = (values: UserFormValues) => {
    console.log("New user added:", values);
    // Here you would typically make an API call to add the user
  };

  const getMenuItems = useCallback((): MenuProps["items"] => [
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
    {
      key: "duplicate",
      label: "Duplicate Role",
      icon: <CopyOutlined />,
    },
  ], []);

  const userRolesColumns: ColumnsType<UserRole> = useMemo(() => [
    {
      title: "Users",
      dataIndex: "user",
      key: "user",
      sorter: (a, b) => a.user.localeCompare(b.user),
      render: (text) => (
        <Space>
          <UserOutlined className="text-gray-500" />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: string[]) => (
        <Space wrap>
          {permissions.map((permission, index) => (
            <Tag key={index} color="pink">
              {permission}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: string) => {
        const config = {
          active: { color: "success", icon: "●", text: "Active" },
          pending: { color: "warning", icon: "●", text: "Pending" },
          inactive: { color: "error", icon: "●", text: "Inactive" },
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
      title: "",
      key: "action",
      width: 50,
      render: (_) => (
        <Dropdown menu={{ items: getMenuItems() }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ], [getMenuItems]);

  const SettingsTab = useMemo(
    () => (
      <div className="mx-auto">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-8">
          <Avatar
            size={120}
            icon={<UserOutlined />}
            src={profileImage}
            className="bg-gray-300 mb-3"
          />
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleImageUpload}
          >
            <Button
              type="primary"
              size="small"
            >
              Upload
            </Button>
          </Upload>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <CustomInput
            label="Account Name"
            placeholder="Sam Smith"
            value={settingsForm.accountName}
            onChange={(e) => handleInputChange("accountName", e.target.value)}
            error={errors.accountName}
          />

          <CustomPassword
            label="Password"
            placeholder="••••••••••••••••••"
            value={settingsForm.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
          />

          <CustomPassword
            label="Confirm Password"
            placeholder="••••••••••••••••••"
            value={settingsForm.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
          />

          <CustomSelect
            label="Language"
            placeholder="Select language"
            options={languageOptions}
            value={settingsForm.language}
            onChange={(value) => handleInputChange("language", value as string)}
            error={errors.language}
          />
        </div>
      </div>
    ),
    [settingsForm, errors, profileImage, handleImageUpload, handleInputChange]
  );

  const UserRolesTab = useMemo(
    () => (
      <div className="py-6">
        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddUserModalOpen(true)}
          >
            Add User
          </Button>
        </div>

        <Table
          columns={userRolesColumns}
          dataSource={users}
          loading={isLoading}
          pagination={{
            position: ["bottomCenter"],
            defaultPageSize: 10,
            showSizeChanger: false,
          }}
          className="user-roles-table"
        />
      </div>
    ),
    [users, isLoading, userRolesColumns]
  );

  const tabItems = useMemo(
    () => [
      {
        key: "settings",
        label: "Settings",
        children: SettingsTab,
      },
      {
        key: "userRoles",
        label: "User Roles & Permissions",
        children: UserRolesTab,
      },
    ],
    [SettingsTab, UserRolesTab]
  );

  return (
    <div
      className={`min-h-screen p-6  ${isDarkMode ? "bg-background-light" : "bg-white"}`}
    >
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1
                className={`text-2xl font-semibold  ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Settings
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage all settings</p>
            </div>
            <Button
              type="text"
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="settings-tabs"
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <Button size="large" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
        mode="add"
      />
    </div>
  );
};

export default Settings;
