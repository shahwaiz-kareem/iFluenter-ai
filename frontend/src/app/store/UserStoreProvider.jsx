"use client";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "@/lib/features/services/userApi";
import userReducer from "@/lib/features/user/user.slice";
import { apiMiddleware } from "@/lib/store/middlewares";
import { useRef } from "react";

export default function UserStoreProvider({ children }) {
  const storeRef = useRef();

  if (!storeRef.current) {
    storeRef.current = configureStore({
      reducer: {
        [userApi.reducerPath]: userApi.reducer,
        user: userReducer,
      },
      devTools: process.env.NODE_ENV !== "production",
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware, apiMiddleware),
    });
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
