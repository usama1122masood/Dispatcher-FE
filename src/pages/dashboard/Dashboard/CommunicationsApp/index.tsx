import React, { useState, useMemo } from "react";
import { Tabs, Button, Modal } from "antd";
import { MessageOutlined, PhoneOutlined, MailOutlined, PlusOutlined } from "@ant-design/icons";
import CommunicationsList from "./CommunicationsList";
import ChatInterface from "./ChatInterface";
import NewMessageForm from "./CommunicationsList/NewMessageForm";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsDarkMode } from "../../../../store/slices/Themeslice";

import {
  useGetMessageInboxQuery,
  useGetMessageOutboxQuery
} from "../../../../store/api/messageOperations";

export interface ChatItem {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
  status: "online" | "busy" | "offline";
  unread?: number;
  type: "message" | "call" | "email";
  createdAt?: string;
}

const CommunicationsApp: React.FC = () => {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { data: inboxMessages } = useGetMessageInboxQuery(9, {
    pollingInterval: 3000,
  });
  const { data: outboxMessages } = useGetMessageOutboxQuery(undefined, {
    pollingInterval: 3000,
  });

  const chats = useMemo(() => {
    const contactsMap = new Map<string, ChatItem>();
    const CURRENT_USER_ID = 9;

    const processMessage = (msg: any) => {
      if (!msg) return;
      const sourceId = msg.sourceId;
      const destId = msg.destId;

      let contactId: string | null = null;
      let contactName: string | null = null;

      let contactIdNum: number | null = null;
      if (sourceId !== CURRENT_USER_ID && sourceId !== undefined && sourceId !== null) {
        contactIdNum = sourceId;
      } else if (destId !== CURRENT_USER_ID && destId !== null && destId !== undefined) {
        contactIdNum = destId;
      }

      if (contactIdNum !== null) {
        contactId = contactIdNum.toString();
        contactName = `Radio ${contactId}`;
      }

      if (contactId !== null && !contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          id: contactId,
          name: contactName || contactId,
          message: msg.message || "",
          time: msg.time || "",
          avatar: (contactId[0] || "?"),
          status: "online",
          type: "message",
          createdAt: msg.createdAt,
        });
      } else if (contactId !== null) {
        const existing = contactsMap.get(contactId)!;
        const msgTime = msg.createdAt ? new Date(msg.createdAt).getTime() : 0;
        const existingTime = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;

        if (msgTime > existingTime || (!msg.createdAt && msg.time && (!existing.time || msg.time >= existing.time))) {
          existing.message = msg.message || "";
          existing.time = msg.time || "";
          existing.createdAt = msg.createdAt;
        }
      }

      if (destId === null) {
        const msgTime = msg.createdAt ? new Date(msg.createdAt).getTime() : 0;

        contactsMap.forEach((existingChat) => {
          const existingTime = existingChat.createdAt ? new Date(existingChat.createdAt).getTime() : 0;
          if (msgTime > existingTime || (!msg.createdAt && msg.time && (!existingChat.time || msg.time >= existingChat.time))) {
            existingChat.message = msg.message || "";
            existingChat.time = msg.time || "";
            existingChat.createdAt = msg.createdAt;
          }
        });
      }
    };

    if (Array.isArray(inboxMessages)) {
      inboxMessages.forEach(processMessage);
    }
    if (Array.isArray(outboxMessages)) {
      outboxMessages.forEach(processMessage);
    }

    const result = Array.from(contactsMap.values());
    return result.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return (b.time || "").localeCompare(a.time || "");
    });
  }, [inboxMessages, outboxMessages]);

  // Filter chats based on active tab
  const filteredChats = useMemo(() => {
    if (activeTab === "all") {
      return chats;
    }
    return chats.filter(chat => {
      if (activeTab === "messages") return chat.type === "message";
      if (activeTab === "calls") return chat.type === "call";
      if (activeTab === "emails") return chat.type === "email";
      return true;
    });
  }, [chats, activeTab]);

  const handleSelectChat = (chat: ChatItem) => {
    setSelectedChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const handleNewMessage = () => {
    setIsNewMessageModalOpen(true);
  };

  const handleCloseNewMessage = () => {
    setIsNewMessageModalOpen(false);
  };

  const tabItems = [
    {
      key: "all",
      label: "All",
    },
    {
      key: "messages",
      label: (
        <span className="flex items-center gap-2">
          <MessageOutlined /> Messages
        </span>
      ),
    },
    {
      key: "calls",
      label: (
        <span className="flex items-center gap-2">
          <PhoneOutlined /> Calls
        </span>
      ),
    },
    {
      key: "emails",
      label: (
        <span className="flex items-center gap-2">
          <MailOutlined /> Emails
        </span>
      ),
    },
  ];

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-[#1a1d21]' : 'bg-white'}`}>
      {!selectedChat?.id ? (
        <div className="h-full flex flex-col">
          {/* Header with Title */}
          <div className={`px-6 py-4 ${isDarkMode ? 'bg-[#1a1d21]' : 'bg-white'}`}>
            <h1 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Communications
            </h1>

            {/* Tabs */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              className="communications-tabs"
              style={{ marginBottom: 0 }}
            />
          </div>

          {/* All Messages Header with New Message Button */}
          <div className={`flex items-center justify-between px-6 py-3 border-b ${
            isDarkMode ? 'border-[#2a2d31] bg-[#1a1d21]' : 'border-gray-200 bg-white'
          }`}>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              All Messages
            </span>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleNewMessage}
            >
              New Message
            </Button>
          </div>

          {/* Messages List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <CommunicationsList
              chats={filteredChats ?? []}
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChat?.id}
            />
          </div>
        </div>
      ) : (
        <ChatInterface chat={selectedChat} onBack={handleBackToList} />
      )}

      {/* New Message Modal */}
      <Modal
        title="New Message"
        open={isNewMessageModalOpen}
        onCancel={handleCloseNewMessage}
        footer={null}
        width={600}
        centered
      >
        <NewMessageForm onClose={handleCloseNewMessage} />
      </Modal>
    </div>
  );
};

export default CommunicationsApp;