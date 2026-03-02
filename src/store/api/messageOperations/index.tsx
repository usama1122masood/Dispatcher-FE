import { apiSlice } from "../apiSlice";



export interface SendMessageRequest {
  radioId: number; // Changed from string to number
  messageType: "UNICAST" | "BROADCAST" | "GROUP";
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: string;
  errorCode: null | string;
}

export interface MessageData {
  sourceId: number;
  destId: number | null;
  time: string;
  msgType: string;
  message: string;
  id?: number;
  direction?: string;
  createdAt?: string;
  isRead?: boolean;
}



interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
  errorCode: null | string;
}

const recursiveExtractMessages = (data: any): MessageData[] => {
  if (!data) return [];
  if (Array.isArray(data.messages)) return data.messages;
  if (data.data) return recursiveExtractMessages(data.data);
  return [];
};

export const MessageOperationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: (body) => ({
        url: '/api/tlv/message/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MessageOperations'],
    }),
    sendEmergencyMessage: builder.mutation<SendMessageResponse, Omit<SendMessageRequest, 'message'> & { message?: string }>({
      query: (body) => ({
        url: '/api/tlv/message/send',
        method: 'POST',
        body: {
          ...body,
          message: body.message || 'EMERGENCY: Immediate assistance required!',
        },
      }),
      invalidatesTags: ['MessageOperations'],
    }),
    getMessageInbox: builder.query<MessageData[], number>({
      query: (index) => ({
        url: '/api/tlv/query/message-status',
        method: 'POST',
        body: { index },
      }),
      transformResponse: (response: ApiResponse) => recursiveExtractMessages(response.data),
      providesTags: ['MessageOperations'],
    }),

    getMessageOutbox: builder.query<MessageData[], void>({
      query: () => '/api/tlv/query/message-outbox',
      transformResponse: (response: ApiResponse) => recursiveExtractMessages(response.data),
      providesTags: ['MessageOperations'],
    }),
  }),
});



export const {
  useSendMessageMutation,
  useSendEmergencyMessageMutation,
  useGetMessageInboxQuery,
  useGetMessageOutboxQuery,
} = MessageOperationsApi;