import { AudioOutlined, FullscreenOutlined, LeftOutlined, PaperClipOutlined, PhoneOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Divider, Input } from "antd";
import React, { useState, useMemo, type ChangeEvent } from "react";

import { getStatusBadgeColor, getStatusTextColor, StatusBadge } from "../../../../../components/ui/Status";
import { ChatBubble, type MessageStatusType } from "../../../../../components/ui/Chat/ChatBubble";
import { useAppSelector } from "../../../../../store/hooks";
import { selectIsDarkMode } from "../../../../../store/slices/Themeslice";
import {
  useGetMessageInboxQuery,
  useGetMessageOutboxQuery,
  useSendMessageMutation,
  type MessageData
} from "../../../../../store/api/messageOperations";

export interface ChatItem {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  unread?: number;
  type: 'message' | 'call' | 'email';
}

export interface ChatMessage {
  id: string;
  message: string;
  time: string;
  status: MessageStatusType;
  sender: 'me' | 'recipient';
  authorId?: string;
  createdAt?: string;
}


interface ChatInterfaceProps {
  chat: ChatItem;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chat, onBack }) => {
  const [message, setMessage] = useState('');
  const isDarkMode = useAppSelector(selectIsDarkMode);

  // Assuming the current user's ID is 9 based on the query parameter
  const CURRENT_USER_ID = 9;
  const { data: inboxMessages } = useGetMessageInboxQuery(CURRENT_USER_ID);

  const { data: outboxMessages } = useGetMessageOutboxQuery();
  const [sendMessage] = useSendMessageMutation();

  const messages = useMemo(() => {
    const combined: ChatMessage[] = [];
    const chatIdNum = parseInt(chat.id);

    // Helper to generate a stable ID for messages if missing
    const getMsgId = (msg: MessageData, index: number) => msg.id ? msg.id.toString() : `msg-${msg.sourceId}-${msg.destId}-${msg.time}-${index}`;

    // Add inbox messages for this chat
    inboxMessages?.forEach((msg: MessageData, index: number) => {
      const involvesContact = msg.sourceId === chatIdNum || msg.destId === chatIdNum;
      const isBroadcast = msg.destId === null;

      if (involvesContact || isBroadcast) {
        combined.push({
          id: getMsgId(msg, index),
          message: msg.message,
          time: msg.time,
          status: 'sent', // Default status
          sender: msg.sourceId === CURRENT_USER_ID ? 'me' : 'recipient',
          authorId: msg.sourceId.toString(),
          createdAt: msg.createdAt,
        });
      }
    });

    // Add outbox messages for this chat or broadcast from me
    outboxMessages?.forEach((msg: MessageData, index: number) => {
      // Again, show if involves contact
      const involvesContact = msg.sourceId === chatIdNum || msg.destId === chatIdNum;
      const isBroadcast = msg.destId === null;

      if (involvesContact || isBroadcast) {
        combined.push({
          id: getMsgId(msg, index),
          message: msg.message,
          time: msg.time,
          status: 'sent', // Default status
          sender: msg.sourceId === CURRENT_USER_ID ? 'me' : 'recipient',
          authorId: msg.sourceId.toString(),
          createdAt: msg.createdAt,
        });
      }
    });


    // Sort chronologically by createdAt time, then fallback to time string if createdAt is missing
    return combined.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return (a.time || "").localeCompare(b.time || "");
    });
  }, [inboxMessages, outboxMessages, chat.id]);



  const handleSend = async () => {
    if (message.trim()) {
      try {
        await sendMessage({
          radioId: parseInt(chat.id),
          messageType: "UNICAST",
          message: message.trim(),
        }).unwrap();
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getStatusFromDataIndicator = (status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'busy':
        return 'error';
      case 'offline':
        return 'default';
      default:
        return 'default';
    }
  };

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`h-full flex flex-col`} style={{ backgroundColor: 'var(--ant-color-background)' }}>
      <div className={`px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">

          <Button icon={<LeftOutlined />} type="text" onClick={onBack} />

          <div className="relative">
            <Badge dot status={getStatusFromDataIndicator(chat.status)}>
              <Avatar size={32} style={{ backgroundColor: 'var(--ant-color-primary)', color: 'var(--ant-color-primary-text)' }}>{chat.avatar}</Avatar>
            </Badge>
          </div>

          <div>
            <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm`}>Radio ID: {chat.id}</div>
            <div className={`text-xs capitalize ${getStatusTextColor(chat.status)}`}>
              {chat.status}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button icon={<PhoneOutlined />} type="text" />
          <Button icon={<VideoCameraOutlined />} type="text" />
          <Button icon={<FullscreenOutlined />} type="text" />
        </div>
      </div>
      <Divider />

      {/* Messages Area - Placeholder */}
      {!messages.length ? (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            Chat with {chat.name}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-20 space-y-1">
          {messages.map(message => (
            <ChatBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}


      <div className="flex items-center gap-2 justify-between p-2">
        <Button icon={<PaperClipOutlined />} type="text" size="middle" />

        <div className="flex-1 relative">
          <Input
            type="text"
            value={message}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
          />
        </div>

        <Button icon={<AudioOutlined />} type="primary" size="middle" />
      </div>
    </div>
  );
};

export default ChatInterface;