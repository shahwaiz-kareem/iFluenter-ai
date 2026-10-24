import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messageApi = createApi({
  reducerPath: "messageApi",
  tagTypes: ["Message"],
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/message/`,
  }),
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: ({ chatId, pageNo, pageLimit, msgsBeforeDate }) => ({
        url: `?chatId=${chatId}&pageNo=${pageNo}&pageLimit=${pageLimit}&msgsBeforeDate=${msgsBeforeDate}`,
        method: "GET",
      }),
      providesTags: ["Message"],
    }),

    getFeedback: builder.mutation({
      query: (body) => ({
        url: `feedback`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const { useLazyGetMessagesQuery, useGetFeedbackMutation } = messageApi;
