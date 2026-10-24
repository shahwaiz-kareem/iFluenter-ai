// preferences.slice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatType: "previous",
  selectedChat: "",
  initialized: false,
  avatars: [],
  envs: [],
  recentChats: {},
  accent: "us",
  difficulty: "easy",
  speechSpeed: 0,
  redemptionMs: 1400,
  captionsActive: true,
  avatar: null,
  env: null,
  voiceControl: "manual",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    initializePreferences: (state, { payload }) => {
      return { ...state, ...payload, initialized: true };
    },

    setChatType: (state, { payload }) => {
      state.chatType = payload;
    },

    setPreferences: (state, { payload }) => {
      return { ...state, ...payload };
    },

    toggleCaptionsActive: (state) => {
      state.captionsActive = !state.captionsActive;
    },
  },
});

export const selectChatType = (state) => state.preferences.chatType;
export const selectCaptionsActive = (state) => state.preferences.captionsActive;
export const selectPreferences = (state) => state.preferences;

export const {
  initializePreferences,
  setChatType,
  setPreferences,
  toggleCaptionsActive,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
