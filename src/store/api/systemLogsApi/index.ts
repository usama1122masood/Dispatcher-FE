import { apiSlice } from "../apiSlice";



export interface SystemEventStats {
  totalSystemEvents: number;
  activeServices: string; // comma-separated service names
  errors: number;
  warnings: number;
  criticalEvents: number;
  criticalUnit: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}


export const systemLogsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getsystemLogs: builder.query<void, void>({
      query: () => "/api/tlv/system_logs/list",
      providesTags: ["systemLogs"],
    }),
    getSystemLogsStats: builder.query<SystemEventStats, void>({
      query: () => "/api/system-stats",
      providesTags: ["systemLogs"],
    })
  }),
});

export const { useGetsystemLogsQuery , useGetSystemLogsStatsQuery } = systemLogsApi;
