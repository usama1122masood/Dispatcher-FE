import React, { useState } from "react";
import { Form, Radio, Select, Input, Button, message, Space, Avatar, Alert } from "antd";
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
      let payload: any = {
        messageType,
        message: values.message,
      };

      if (messageType === "UNICAST") {
        payload.radioId = values.recipient;
      } else if (messageType === "MULTICAST") {
        payload.radioIds = values.recipients;
      }
      // For BROADCAST, only messageType and message are needed

      console.log("Sending message with payload:", payload);

      const result = await sendMessage(payload).unwrap();
      
      message.success("Message sent successfully!");
      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error("Send message error:", error);
      message.error(error?.data?.message || "Failed to send message");
    }
  };

  // Format radio devices for Select options
  const radioOptions = radioDevices.map((device: any) => {
    // Extract numeric ID from device key (e.g., "device_9" -> 9)
    const deviceId = device.key ? parseInt(device.key.replace("device_", "")) : null;
    
    return {
      label: (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#1677ff' }}>
            {device.name?.[0] || deviceId || "R"}
          </Avatar>
          <span>Radio {deviceId} - {device.name || device.key}</span>
        </Space>
      ),
      value: deviceId,
    };
  }).filter((option: any) => option.value !== null); // Filter out invalid IDs

  const handleMessageTypeChange = (e: any) => {
    const newType = e.target.value;
    setMessageType(newType);
    
    // Clear recipient fields when changing type
    if (newType === "BROADCAST") {
      form.setFieldsValue({ recipient: undefined, recipients: undefined });
    }
  };

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
          onChange={handleMessageTypeChange}
          buttonStyle="solid"
          size="large"
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
            size="large"
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
          rules={[
            { required: true, message: "Please select at least one recipient" },
            {
              validator: (_, value) => {
                if (value && value.length < 2) {
                  return Promise.reject(new Error("Please select at least 2 recipients for multicast"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Select
            mode="multiple"
            showSearch
            placeholder="Select multiple radio devices"
            size="large"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label?.toString() ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={radioOptions}
            maxTagCount="responsive"
          />
        </Form.Item>
      )}

      {/* Broadcast Info */}
      {messageType === "BROADCAST" && (
        <Alert
          message="Broadcast Message"
          description="This message will be sent to all radio devices on the current channel."
          type="info"
          showIcon
          className="mb-4"
        />
      )}

      {/* Message Input */}
      <Form.Item
        label="Message"
        name="message"
        rules={[
          { required: true, message: "Please enter a message" },
          { max: 160, message: "Message must be less than 160 characters" },
          { min: 1, message: "Message cannot be empty" },
        ]}
      >
        <TextArea
          rows={4}
          placeholder="Type your message here..."
          showCount
          maxLength={160}
          size="large"
        />
      </Form.Item>

      {/* Action Buttons */}
      <Form.Item className="mb-0">
        <Space className="w-full justify-end">
          <Button size="large" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            size="large" 
            htmlType="submit" 
            loading={isLoading}
          >
            {messageType === "BROADCAST" ? "Broadcast Message" : "Send Message"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default NewMessageForm;