import React, { useState } from "react";
import { Form, Radio, Select, Input, Button, message, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useGetRadioDevicesQuery } from "../../../../../store/api/radioManagementApi";
import { useSendMessageMutation } from "../../../../../store/api/messageOperations";

const { TextArea } = Input;

interface NewMessageFormProps {
  onClose: () => void;
}

const NewMessageForm: React.FC<NewMessageFormProps> = ({ onClose }) => {
  const [form] = Form.useForm();
  const [messageType, setMessageType] = useState<"UNICAST" | "MULTICAST" | "BROADCAST">("UNICAST");
  
  const { data: radioDevices = [] } = useGetRadioDevicesQuery();
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSubmit = async (values: any) => {
    try {
      const payload: any = {
        messageType,
        message: values.message,
      };

      if (messageType === "UNICAST") {
        payload.radioId = values.recipient;
      } else if (messageType === "MULTICAST") {
        payload.radioIds = values.recipients;
      }

      await sendMessage(payload).unwrap();
      message.success("Message sent successfully!");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to send message");
      console.error("Send message error:", error);
    }
  };

  // Format radio devices for Select options
  const radioOptions = radioDevices.map((device: any) => ({
    label: (
      <Space>
        <Avatar size="small" style={{ backgroundColor: '#1677ff' }}>
          {device.name?.[0] || device.key?.[0] || "R"}
        </Avatar>
        <span>{device.name || `Radio ${device.key}`}</span>
      </Space>
    ),
    value: parseInt(device.key.replace("device_", "")),
  }));

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ messageType: "UNICAST" }}
    >
      {/* Message Type Selection */}
      <Form.Item label="Message Type" name="messageType">
        <Radio.Group
          value={messageType}
          onChange={(e) => setMessageType(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="UNICAST">Direct Message</Radio.Button>
          <Radio.Button value="MULTICAST">Group Multicast</Radio.Button>
          <Radio.Button value="BROADCAST">Broadcast</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {/* Recipient Selection - Only for UNICAST */}
      {messageType === "UNICAST" && (
        <Form.Item
          label="Recipient"
          name="recipient"
          rules={[{ required: true, message: "Please select a recipient" }]}
        >
          <Select
            showSearch
            placeholder="Select a radio device"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label?.toString() ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={radioOptions}
          />
        </Form.Item>
      )}

      {/* Multiple Recipients Selection - Only for MULTICAST */}
      {messageType === "MULTICAST" && (
        <Form.Item
          label="Recipients"
          name="recipients"
          rules={[{ required: true, message: "Please select at least one recipient" }]}
        >
          <Select
            mode="multiple"
            showSearch
            placeholder="Select radio devices"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label?.toString() ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={radioOptions}
          />
        </Form.Item>
      )}

      {/* Broadcast Info */}
      {messageType === "BROADCAST" && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            This message will be sent to all radio devices on the current channel.
          </p>
        </div>
      )}

      {/* Message Input */}
      <Form.Item
        label="Message"
        name="message"
        rules={[
          { required: true, message: "Please enter a message" },
          { max: 160, message: "Message must be less than 160 characters" },
        ]}
      >
        <TextArea
          rows={4}
          placeholder="Type your message here..."
          showCount
          maxLength={160}
        />
      </Form.Item>

      {/* Action Buttons */}
      <Form.Item className="mb-0">
        <Space className="w-full justify-end">
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create and Message
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default NewMessageForm;