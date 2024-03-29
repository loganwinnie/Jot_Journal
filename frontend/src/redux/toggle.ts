import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from './store'

interface ToggleInterface {
  authForm: boolean;
  entry: boolean;
  sidebar: boolean;
  loading: boolean;
}

// interface ToggleState {
//     login: false
//     signup: false
//     entry: false
//     sidebar: false
// }

const initialState: ToggleInterface = {
  authForm: true,
  entry: false,
  sidebar: false,
  loading: false,
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    /** Boolean: True for login form, false for signup */
    toggleAuthForm: (state) => {
      state.authForm = !state.authForm;
    },
    toggleEntry: (state) => {
      state.entry = !state.entry;
    },
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar;
    },
    toggleLoading: (state) => {
      state.loading = !state.loading;
    },
  },
});

export const { toggleAuthForm, toggleEntry, toggleSidebar, toggleLoading } =
  toggleSlice.actions;

export default toggleSlice.reducer;

export const getLoginOpen = (state: { toggle: { authForm: boolean } }) =>
  state.toggle.authForm;
export const getEntryOpen = (state: { toggle: { entry: boolean } }) =>
  state.toggle.entry;
export const getSidebarOpen = (state: { toggle: { sidebar: boolean } }) =>
  state.toggle.sidebar;
export const getLoading = (state: { toggle: { loading: boolean } }) =>
  state.toggle.loading;
