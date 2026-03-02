import { apiSlice } from "../apiSlice";


export interface CallSummaryStats {
  totalToday: number;
  activeCalls: number;
  missedFailed: number;
  successRate: string; // e.g. "97.4%"
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export const communicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommunications: builder.query<void, void>({
      query: () => "/api/tlv/communication_record/list",
      providesTags: ["communication"],
    }),
    getCommunicationStats: builder.query<CallSummaryStats, void>({
      query: () => "/api/tlv/active-communication-stats",
      providesTags: ["communication"],
    }),
  }),
});

export const { useGetCommunicationsQuery, useGetCommunicationStatsQuery } =
  communicationApi;
