import { Card } from "antd";
import type { ChatMessage } from "../../../pages/dashboard/Dashboard/CommunicationsApp/ChatInterface";
import { useAppSelector } from "../../../store/hooks";
import { selectIsDarkMode } from "../../../store/slices/Themeslice";

export type MessageStatusType = 'sent' | 'delivered' | 'read' | 'failed';

interface Props {
    message: ChatMessage;
}

export const ChatBubble = ({ message }: Props) => {

    const { message: messageText, time, sender } = message;
    const isDarkMode = useAppSelector(selectIsDarkMode);

    const formatTime = (timeStr: string) => {
        if (!timeStr || typeof timeStr !== 'string') return "";
        try {
            const date = new Date(timeStr);
            if (!isNaN(date.getTime())) {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            }
            // If it's HHmm format (4 digits)
            if (timeStr.length === 4 && /^\d+$/.test(timeStr)) {
                return `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
            }
            return timeStr;
        } catch (e) {
            return timeStr || "";
        }
    };


    return (

        // <div className="chat-bubble flex flex-col w-full font-sans max-w-[200px] min-h-16 [&[data-author='recipient']]:bg-secondary [&:has(+_&[data-author='me'])]:rounded-md overflow-hidden" data-author={sender}>
        //     {message.sender !== "me" && <span className={`text-sm capitalize ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold pt-2 px-2`}>{message.sender}</span>}
        //     <p className="text-sm text-body px-2 py-2">{messageText}</p>
        //     <div className={`flex items-center text-[0.7rem] ${isDarkMode ? 'text-gray-400' : 'text-neutral-500'} mt-auto [.chat-bubble[data-author='me']_&]:text-neutral-300 justify-between px-2`}>
        //         {/* <span>{status}</span> */}
        //         <span className="ml-auto">{new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
        //     </div>
        // </div>
        <Card className="chat-bubble flex flex-col w-full font-sans max-w-[200px] min-h-16 [&[data-author='recipient']]:bg-secondary overflow-hidden" data-author={sender}>
            <span className={`text-sm capitalize ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold pt-2 px-2`}>
                {message.authorId ? `Radio ${message.authorId}` : sender}
            </span>
            <p className="text-sm text-body px-2 py-2">{messageText}</p>

            <div className={`flex items-center text-[0.7rem] ${isDarkMode ? 'text-gray-400' : 'text-neutral-500'} mt-auto [.chat-bubble[data-author='me']_&]:text-[var(--ant-color-primary-text)] justify-between px-2`}>
                {/* <span>{status}</span> */}
                <span className="ml-auto">{formatTime(time)}</span>
            </div>
        </Card>

    )
}