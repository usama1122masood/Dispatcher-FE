import { apiSlice } from "../apiSlice";

export interface CommunicationLogsStats {
  totalCommunications: number;
  callsCount: number;
  messagesCount: number;
  activeChannels: string; // comma-separated channel IDs
  missedFailed: number;
  missedCalls: number;
  failedSms: number;
  emergencyAlerts: number;
  emergencyUnit: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export const communicationLogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getcommunicationLogs: builder.query<void, void>({
      query: () => "/api/tlv/communication_logs/list",
      providesTags: ["communicationLogs"],
    }),
    getCommunicationLogsStats: builder.query<CommunicationLogsStats, void>({
      query: () => "/api/communication-stats",
      providesTags: ["communicationLogs"],
    }),
  }),
});

export const {
  useGetcommunicationLogsQuery,
  useGetCommunicationLogsStatsQuery,
} = communicationLogsApi;
