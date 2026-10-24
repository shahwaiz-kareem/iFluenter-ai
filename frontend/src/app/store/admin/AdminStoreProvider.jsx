"use client";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { adminUserApi } from "@/lib/features/services/admin/userApi.admin.js";

export default function UserStoreProvider({ children }) {
  const store = configureStore({
    reducer: {
      [adminUserApi.reducerPath]: adminUserApi.reducer,
      // user: authReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(adminUserApi.middleware),
  });

  return <Provider store={store}>{children}</Provider>;
}
