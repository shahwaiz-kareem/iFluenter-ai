import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ProgressApi = createApi({
  reducerPath: "ProgressApi",
  tagTypes: ["Progress"],
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/`,
  }),
  endpoints: (builder) => ({
    getSessionProgress: builder.query({
      query: () => "chat-session/get-stats",
      providesTags: ["Progress"],
    }),
  }),
});

export const { useGetSessionProgressQuery } = ProgressApi;
