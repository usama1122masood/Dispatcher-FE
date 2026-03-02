import React from "react";
import { Avatar, Badge, Tag } from "antd";
import { TeamOutlined, SoundOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../../../../store/hooks";
import { selectIsDarkMode } from "../../../../../store/slices/Themeslice";

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

interface CommunicationsListProps {
  chats: ChatItem[];
  onSelectChat: (chat: ChatItem) => void;
  selectedChatId?: string;
}

const CommunicationsList: React.FC<CommunicationsListProps> = ({
  chats,
  onSelectChat,
  selectedChatId,
}) => {
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#52c41a";
      case "busy":
        return "#ff4d4f";
      case "offline":
        return "#8c8c8c";
      default:
        return "#8c8c8c";
    }
  };

  // Determine if chat is a group or has special tags
  const isGroup = (name: string) => name.includes("ALPHA") || name.includes("BRAVO") || name.includes("CHARLIE") || name.includes("DELTA") || name.includes("ECHO");
  const isEmergency = (name: string) => name.includes("CHARLIE");
  const isBroadcast = (message: string) => message.toLowerCase().includes("all") || message.toLowerCase().includes("checkpoint");

  return (
    <div className="w-full">
      {chats.length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          No messages yet
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`flex items-start gap-3 px-6 py-3 cursor-pointer transition-colors ${
              selectedChatId === chat.id
                ? isDarkMode
                  ? "bg-[#2a2d31]"
                  : "bg-blue-50"
                : isDarkMode
                ? "hover:bg-[#2a2d31]"
                : "hover:bg-gray-50"
            }`}
          >
            {/* Avatar with status badge */}
            <div className="relative flex-shrink-0">
              <Avatar
                size={40}
                style={{
                  backgroundColor: "#1677ff",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {chat.avatar}
              </Avatar>
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: getStatusColor(chat.status),
                  borderColor: isDarkMode ? "#1a1d21" : "#ffffff",
                }}
              />
            </div>

            {/* Chat content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold text-sm ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {chat.name}
                  </span>
                  
                  {/* Group badge */}
                  {isGroup(chat.name) && (
                    <Tag
                      icon={<TeamOutlined />}
                      color="gold"
                      style={{ margin: 0, fontSize: "11px", padding: "0 6px" }}
                    >
                      Group
                    </Tag>
                  )}

                  {/* All/Broadcast badge */}
                  {isBroadcast(chat.message) && (
                    <Tag
                      icon={<SoundOutlined />}
                      color="green"
                      style={{ margin: 0, fontSize: "11px", padding: "0 6px" }}
                    >
                      All
                    </Tag>
                  )}

                  {/* Emergency badge */}
                  {isEmergency(chat.name) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </div>

                <span
                  className={`text-xs flex-shrink-0 ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {chat.time}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p
                  className={`text-sm truncate ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                  style={{ maxWidth: "85%" }}
                >
                  {chat.message}
                </p>
                
                {chat.unread && chat.unread > 0 && (
                  <Badge
                    count={chat.unread}
                    style={{
                      backgroundColor: "#1677ff",
                      boxShadow: "none",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommunicationsList;