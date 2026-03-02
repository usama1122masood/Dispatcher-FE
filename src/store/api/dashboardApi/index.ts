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

export interface callstatus{
  success: boolean;
  message:string;
  data:{}
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
    getCallRecords: builder.query<void, void>({
      query: () => '/api/tlv/call/record',
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
     getCallStatus: builder.query<callstatus, void>({
      query: () => '/api/tlv/query/call-status?radioId=9',
      providesTags: ['Dashboard'],
    })
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  useGetAlertsQuery,
  useDeleteAlertByIdMutation,
  useGetTeamsQuery,
  useGetCallRecordsQuery,
  useGetStatusBarQuery,
  useGetCallStatusQuery,
} = dashboardApi;