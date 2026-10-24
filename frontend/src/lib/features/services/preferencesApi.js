import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const preferencesApi = createApi({
  reducerPath: "preferencesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/preferences/",
  }),
  tagTypes: ["Preferences"],
  endpoints: (builder) => ({
    getPreferences: builder.query({
      query: ({ chatMode }) => `/?chatMode=${chatMode}`,
      providesTags: ["Preferences"],
      transformResponse: (response) => ({
        ...response,
        avatars: [
          response?.avatar,
          ...response?.avatars.filter(
            (item) => item._id !== response?.avatar?._id
          ),
        ].filter((item) => item !== undefined && item !== null),
        envs: [
          response?.env,
          ...response?.envs.filter((item) => item._id !== response?.env?._id),
        ].filter((item) => item !== undefined && item !== null),
      }),
    }),
    upsertPreferences: builder.mutation({
      query: (body) => ({
        url: "upsert",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Preferences"],
    }),
  }),
});

export const {
  useLazyGetPreferencesQuery,
  useGetPreferencesQuery,
  useUpsertPreferencesMutation,
} = preferencesApi;
