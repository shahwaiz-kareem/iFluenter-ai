import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatSessionApi = createApi({
  reducerPath: "chatSessionApi",
  tagTypes: ["chatSession"],
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/chat-session/`,
  }),
  endpoints: (builder) => ({
    getChatSessionsData: builder.query({
      query: () => ({
        url: `get-stats`,
        method: "GET",
      }),
      providesTags: ["chatSession"],
    }),

    createChatSession: builder.mutation({
      query: (body) => ({
        url: `create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["chatSession"],
    }),
  }),
});

export const { useGetChatSessionsDataQuery, useCreateChatSessionMutation } =
  chatSessionApi;
