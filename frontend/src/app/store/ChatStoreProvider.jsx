"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../../lib/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export default function ChatStoreProvider({ children }) {
  const storeRef = useRef();
  const persistorRef = useRef();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
}
