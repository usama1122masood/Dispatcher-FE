import { apiSlice } from "../apiSlice";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  address?: string;
}

export interface UpdateProfileRequest {
  phone: string;
  address: string;
  role: string;
  department: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (data) => ({
        url: '/user/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateProfileMutation,
  useDeleteUserMutation,
} = userApi;