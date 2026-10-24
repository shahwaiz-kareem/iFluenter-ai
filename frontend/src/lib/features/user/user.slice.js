// user.slice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isFetched: false,
  name: "",
  email: "",
  isVerified: false,
  roles: ["user"],
  proficiencyLevel: "beginner",
  ageRange: "21-30",
  theme: "dark",
  practiceFrequency: "daily",
  goals: "goal_1",
  signupSource: "Email",
  visitSource: "other",
  isOnboarded: false,
  nativeLanguage: "",
  subscriptionExpiry: null,
  lastLogin: null,
  loginCount: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
  },
});

export const selectUser = (state) => state.user;

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
