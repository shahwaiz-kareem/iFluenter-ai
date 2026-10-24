import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./ssr-safe-storage.js";
import { preferencesApi } from "../features/services/preferencesApi.js";
import preferencesReducer from "../features/preferences/preferences.slice";
import userReducer from "../features/user/user.slice";
import chatReducer from "../features/chat/chat.slice";
import messageReducer from "../features/chat/message.slice.js";
import { messageApi } from "../features/services/messageApi.js";
import { chatApi } from "../features/services/chatApi.js";
import { userApi } from "../features/services/userApi.js";
import { apiMiddleware } from "./middlewares.js";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["preferences"],
};
const rootReducer = combineReducers({
  [preferencesApi.reducerPath]: preferencesApi.reducer,
  [messageApi.reducerPath]: messageApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  user: userReducer,
  preferences: preferencesReducer,
  chat: chatReducer,
  message: messageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(
        userApi.middleware,
        chatApi.middleware,
        preferencesApi.middleware,
        messageApi.middleware,
        apiMiddleware
      ),
  });
};

export const persistor = persistStore(makeStore());
