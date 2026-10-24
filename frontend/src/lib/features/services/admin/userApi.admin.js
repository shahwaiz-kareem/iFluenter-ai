import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminUserApi = createApi({
  reducerPath: "adminUserApi",
  tagTypes: ["adminUser"],
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/admin/user`,
  }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ userId }) => ({
        url: `user?userId=${userId}`,
        method: "GET",
      }),
    }),

    getUsers: builder.query({
      query: ({ pageNo, pageLimit, sortBy }) => ({
        url: `users?pageNo=${pageNo}&pageLimit=${pageLimit}&sortBy=${sortBy}`,
        method: "GET",
      }),
      providesTags: ["adminUser"],
    }),
    searchUser: builder.query({
      query: ({ searchKey, searchValue, pageLimit, pageNo }) => ({
        url: `search?searchKey=${searchKey}&searchValue=${searchValue}&pageNo=${pageNo}&pageLimit=${pageLimit}`,
        method: "GET",
      }),
      providesTags: ["adminUser"],
    }),

    updateUser: builder.mutation({
      query: (body) => ({
        url: `update`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["adminUser"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useLazySearchUserQuery,
  useLazyGetUsersQuery,
  useSearchUserQuery,
  useUpdateUserMutation,
} = adminUserApi;
