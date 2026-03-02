import { apiSlice } from "../apiSlice";
import { type DeviceFormValues } from "../../../pages/dashboard/RadioManagement/AddDeviceModal";
import type { CallService } from "../../../pages/dashboard/RadioManagement";

export interface radioManagementStats {
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

export interface RadioDeviceInfo {
  radioName: string;
  imei: string;
  radioId: string;
  profile: string;
  icon: string;
}

interface Stat {
  active: number;
  warnings: number;
  errors: number;
  avgSignal: string;
}

export const radioManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRadioDevices: builder.query<RadioDeviceInfo[], void>({
      query: () => "/api/tlv/radio/list",
      providesTags: ["radioManagement"],
      transformResponse: (response: any) => response.data || response || [],
    }),

    getRadioStats: builder.query<Stat, void>({
      query: () => "/api/mock/radio-stats",
      providesTags: ["radioManagement"],
    }),
    callService: builder.mutation<void, CallService>({
      query: (payload) => ({
        method: "POST",
        url: "/api/tlv/device/service",
        body: payload,
      }),
      invalidatesTags: ["radioManagement"],
    }),
    addDevice: builder.mutation<void, DeviceFormValues>({
      query: (payload) => ({
        method: "POST",
        url: "/api/tlv",
        body: payload,
      }),
      invalidatesTags: ["radioManagement"],
    }),
  }),
});

export const {
  useGetRadioDevicesQuery,
  useGetRadioStatsQuery,
  useCallServiceMutation,
  useAddDeviceMutation,
} = radioManagementApi;
