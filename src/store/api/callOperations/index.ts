

import { apiSlice } from "../apiSlice";

export interface CallOperationsStats {
  totalUsers: number;
  totalOrders: number;
  revenue: number;
  growth: number;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface StartCallRequest {
  id: number;
  callType: "PRIVATE" | "GROUP" | "BROADCAST";
}

export interface StartCallResponse {
  success: boolean;
  message: string;
  data: string;
  errorCode: null | string;
}

export interface StopCallRequest {
  id: number;
  callType: "PRIVATE" | "GROUP" | "BROADCAST";
}

export interface StopCallResponse {
  success: boolean;
  message: string;
  data: string;
  errorCode: null | string;
}

export const CallOperationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCallOperationsStats: builder.query<CallOperationsStats, void>({
      query: () => '/CallOperations/stats',
      providesTags: ['CallOperations'],
    }),
    getRecentActivity: builder.query<Activity[], void>({
      query: () => '/CallOperations/activity',
      providesTags: ['CallOperations'],
    }),
    startCall: builder.mutation<StartCallResponse, StartCallRequest>({
      query: (body) => ({
        url: '/api/tlv/call/start',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CallOperations'],
    }),
    stopCall: builder.mutation<StopCallResponse, StopCallRequest>({
      query: (body) => ({
        url: '/api/tlv/call/stop',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CallOperations'],
    }),
  }),
});

export const {
  useGetCallOperationsStatsQuery,
  useGetRecentActivityQuery,
  useStartCallMutation,
  useStopCallMutation,
} = CallOperationsApi;