import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  tagTypes: ["Chat"],
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/chat/`,
  }),
  endpoints: (builder) => ({
    getChats: builder.query({
      query: ({ pageNo, pageLimit, excludeList, chatMode }) => ({
        url: `?pageNo=${pageNo}&pageLimit=${pageLimit}&excludeList=${excludeList}&chatMode=${chatMode}`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    upsertChat: builder.mutation({
      query: (body) => ({
        url: `upsert`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),
    deleteChat: builder.mutation({
      query: (body) => ({
        url: `delete`,
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const {
  useGetChatsQuery,
  useLazyGetChatsQuery,
  useUpsertChatMutation,
  useDeleteChatMutation,
} = chatApi;
