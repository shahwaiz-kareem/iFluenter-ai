import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Profile"],
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/user`,
  }),
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (withExtra) => ({
        url: `profile`,
        method: "GET",
        headers: { "with-extra": withExtra ? "true" : "false" },
      }),
      providesTags: ["Profile"],
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: `login`,
        method: "POST",
        body,
      }),
    }),
    registerUser: builder.mutation({
      query: (body) => ({
        url: `register`,
        method: "POST",
        body,
      }),
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: `update`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    verifyEmail: builder.mutation({
      query: (body) => ({
        url: "verify-email",
        method: "POST",
        body,
      }),
    }),
    resendOtp: builder.mutation({
      query: () => ({
        url: "verify-email",
        method: "POST",
        body: {
          otp: null,
        },
        headers: {
          "request-action": "resend",
        },
      }),
    }),
    sendUserResetLink: builder.mutation({
      query: (body) => ({
        url: "reset-password-link",
        method: "POST",
        body,
      }),
    }),
    resetPasswordConfirm: builder.mutation({
      query: ({ _id, token, body }) => ({
        url: `reset-password-confirm/?_id=${_id}&token=${token}`,
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: `change-password`,
        method: "POST",
        body,
      }),
    }),
    resetEmail: builder.mutation({
      query: (body) => ({
        url: `reset-email`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: `logout`,
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useVerifyEmailMutation,
  useSendUserResetLinkMutation,
  useResendOtpMutation,
  useResetPasswordConfirmMutation,
  useChangePasswordMutation,
  useResetEmailMutation,
  useLogoutUserMutation,
} = userApi;
