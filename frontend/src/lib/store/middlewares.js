"use client";
import { isRejectedWithValue } from "@reduxjs/toolkit";

export const apiMiddleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action.payload.status === 401 || action.payload.status === 403) {
      window.location.href = "/sign-in";
    }
  }

  return next(action);
};
