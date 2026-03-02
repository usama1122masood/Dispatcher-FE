import type { UserFormValues } from "../../../pages/dashboard/Settings/AddUserModal";
import { apiSlice } from "../apiSlice";

export interface userManagementLogsStats {
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

export const userManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<void, void>({
      query: () => '/api/tlv/user_role/list',
      providesTags: ['userManagement'],
    }),
    getUserAndConnection: builder.query<void, void>({
      query: () => '/api/tlv/check-connections',
      providesTags: ['userManagement'],
    }),
    addUser: builder.mutation<void, UserFormValues>({
      query: (payload) => ({
        url: '/api/tlv/user-profiles',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['userManagement'],
    })
  }),
});

export const {
    useGetUsersQuery,
    useGetUserAndConnectionQuery,
    useAddUserMutation
} = userManagementApi;