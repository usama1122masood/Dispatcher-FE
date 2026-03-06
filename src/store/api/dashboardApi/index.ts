import { apiSlice } from "../apiSlice";

export interface DashboardStats {
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

export interface CallRecord {
  key: string;
  time: string;
  radioId: string;
  type: string;
  typeColor: string;
  description: string;
  callType: string;
  partnerId: number | null;
  duration: number; // in seconds
  status: "INCOMING" | "OUTGOING";
}

export interface CallStatusResponse {
  success: boolean;
  message: string;
  data: {
    currentStatus: {
      radioId: number;
      callType: string;
      callTypeCode: string;
      partnerId: number;
    };
    callRecords: Array<{
      id: number;
      radioId: number;
      initiative: string;
      callEndTime: string;
      partnerId: number | null;
      createdAt: string;
      updatedAt: string | null;
    }>;
    recordCount: number;
  };
  errorCode: string | null;
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getRecentActivity: builder.query<Activity[], void>({
      query: () => '/dashboard/activity',
      providesTags: ['Dashboard'],
    }),
    getAlerts: builder.query<any, void>({
      query: () => '/api/tlv/alerts/list',
      providesTags: ['Alerts', 'Dashboard'],
    }),
    deleteAlertById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/tlv/alerts/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Alerts'],
    }),
    getTeams: builder.query<void, void>({
      query: () => '/api/tlv/team/list',
      providesTags: ['Dashboard'],
    }),
    getStatusBar: builder.query<void, void>({
      query: () => '/api/tlv/system-status',
      providesTags: ['Dashboard'],
    }),
    getCallStatus: builder.query<CallStatusResponse, number>({
      query: (radioId) => `/api/tlv/query/call-status?radioId=${9}`,
      providesTags: ['Dashboard', 'CallStatus'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetAlertsQuery,
  useDeleteAlertByIdMutation,
  useGetTeamsQuery,
  useGetStatusBarQuery,
  useGetCallStatusQuery,
} = dashboardApi;