import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  useDarkMode: false,
};

const userPreferences = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    toggleDarkMode(state, action: PayloadAction<boolean>) {
      state.useDarkMode = action.payload;
    },
  },
});

const { toggleDarkMode } = userPreferences.actions;

export const actions = {
  toggleDarkMode,
};

export const namespace = userPreferences.name;

export const reducer = userPreferences.reducer;
