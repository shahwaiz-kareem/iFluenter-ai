import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  allChatsFetched: false,
  isModalOpen: true,
  isDrawerOpen: false,
  animation: "standing",
  animations: {},
  assetsStatus: { status: "", value: 0, msg: "", assetType: "" },
  assetsKeys: { avatar: "", env: "" },
  sessionCreated: false,
  isTTSActive: false,
  micPermissionStatus: "unknown",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSessionCreated: (state, action) => {
      state.sessionCreated = action.payload;
    },
    setAnimation: (state, action) => {
      state.animation = action.payload;
    },

    setAssetsKeys: (state, action) => {
      state.assetsKeys = { ...state.assetsKeys, ...action.payload };
    },

    setAnimations: (state, action) => {
      state.animations = { ...state.animations, ...action.payload };
    },

    setIsTTSActive: (state, action) => {
      state.isTTSActive = action.payload;
    },

    setAllChatsFetched: (state, action) => {
      state.allChatsFetched = action.payload;
    },
    setAssetsStatus: (state, action) => {
      state.assetsStatus = { ...state.assetsStatus, ...action.payload };
    },

    setChats: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.chats = [...state.chats, ...action.payload];
      } else {
        state.chats = action.payload.chats;
      }
    },

    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setIsDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
    setMicPermissionStatus: (state, action) => {
      state.micPermissionStatus = action.payload;
    },
  },
});

export const selectAnimation = (state) => state.chat.animation;
export const selectChats = (state) => state.chat.chats;
export const selectAllChatsFetched = (state) => state.chat.allChatsFetched;
export const selectAnimations = (state) => state.chat.animations;
export const selectAssetsStatus = (state) => state.chat.assetsStatus;
export const selectIsModalOpen = (state) => state.chat.isModalOpen;
export const selectIsDrawerOpen = (state) => state.chat.isDrawerOpen;
export const selectAssetsKeys = (state) => state.chat.assetsKeys;
export const selectIsTTSActive = (state) => state.chat.isTTSActive;
export const selectSessionCreated = (state) => state.chat.sessionCreated;
export const selectMicPermissionStatus = (state) =>
  state.chat.micPermissionStatus;

export const {
  setAnimation,
  setSessionCreated,
  setAnimations,
  setChats,
  setAllChatsFetched,
  setAssetsStatus,
  setIsModalOpen,
  setIsDrawerOpen,
  setAssetsKeys,
  setIsTTSActive,
  setMicPermissionStatus,
} = chatSlice.actions;
export default chatSlice.reducer;
