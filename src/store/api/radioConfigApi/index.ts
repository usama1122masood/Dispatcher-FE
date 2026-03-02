import { apiSlice } from "../apiSlice";

export interface ChannelSetRequest {
  configType: "CHANNEL_SET";
  channel: number;
}

export interface PowerLevelRequest {
  configType: "POWER_LEVEL";
  powerLevel: number;
}

export interface EncryptionRequest {
  configType: "ENCRYPTION";
  encryptionEnabled: boolean;
}

export interface ConfigResponse {
  success: boolean;
  message: string;
  data: string;
  errorCode: null | string;
}

export const radioConfigApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    setChannel: builder.mutation<ConfigResponse, ChannelSetRequest>({
      query: (body) => ({
        url: "/api/tlv/config/channel",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RadioDevices"],
    }),

    setPowerLevel: builder.mutation<ConfigResponse, PowerLevelRequest>({
      query: (body) => ({
        url: "/api/tlv/config/power",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RadioDevices"],
    }),

    setEncryption: builder.mutation<ConfigResponse, EncryptionRequest>({
      query: (body) => ({
        url: "/api/tlv/config/encryption",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RadioDevices"],
    }),
  }),
});

export const {
  useSetChannelMutation,
  useSetPowerLevelMutation,
  useSetEncryptionMutation,
} = radioConfigApi;