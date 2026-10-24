import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  messages: [],
  recentMessages: [],
  allMsgsFetched: false,
  pageNo: 1,
  messageFocusIndex: { messageType: "", index: 0 },
  chatIdChanged: false,
  status: "",
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessageFocusIndex: (state, action) => {
      state.messageFocusIndex = {
        ...state.messageFocusIndex,
        ...action.payload,
      };
    },
    setAllMsgsFetched: (state, action) => {
      state.allMsgsFetched = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setChatIdChanged: (state, action) => {
      state.chatIdChanged = action.payload;
    },
    setPageNo: (state, action) => {
      state.pageNo = action.payload;
    },
    incrementPageNo: (state) => {
      state.pageNo = state.pageNo + 1;
    },

    // inside your message.slice.ts
    setMessages: (state, action) => {
      const newMessages = action.payload;
      const existingIds = new Set(state.messages.map((m) => m._id));
      const uniqueNewMessages = newMessages.filter(
        (m) => !existingIds.has(m._id)
      );

      state.messages = [...uniqueNewMessages, ...state.messages];
    },
    setRecentMessage: (state, action) => {
      state.recentMessages = [...state.recentMessages, action.payload];
    },
    focusRecentMsg: (state) => {
      state.messageFocusIndex = {
        messageType: "recent",
        index: state.recentMessages.length,
      };
    },
    clearAllMessages: (state) => {
      state.messages = [];
      state.recentMessages = [];
    },
  },
});

export const selectMessages = (state) => state.message.messages;
export const selectRecentMessages = (state) => state.message.recentMessages;
export const selectMessageFocusIndex = (state) =>
  state.message.messageFocusIndex;
export const selectAllMsgsFetched = (state) => state.message.allMsgsFetched;
export const selectPageNo = (state) => state.message.pageNo;
export const selectChatIdChanged = (state) => state.message.chatIdChanged;
export const selectStatus = (state) => state.message.status;

export const {
  setMessages,
  clearAllMessages,
  setChatIdChanged,
  setMessageFocusIndex,
  setRecentMessage,
  setAllMsgsFetched,
  setPageNo,
  incrementPageNo,
  focusRecentMsg,
  setStatus,
} = messageSlice.actions;
export default messageSlice.reducer;
