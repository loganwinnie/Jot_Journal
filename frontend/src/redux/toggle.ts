import { createSlice } from "@reduxjs/toolkit";

interface ToggleInterface {
  authForm: boolean;
  entryForm: boolean;
  entry: boolean;
  sidebar: boolean;
  loading: boolean;
}

const initialState: ToggleInterface = {
  authForm: true,
  entryForm: false,
  entry: false,
  sidebar: false,
  loading: false,
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    /** Boolean: True for login form, false for signup */
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar;
    },
    toggleLoading: (state) => {
      state.loading = !state.loading;
    },
  },
});

export const { toggleSidebar, toggleLoading } = toggleSlice.actions;

export default toggleSlice.reducer;

/**getSidebarOpen:  get state of sidebar */
export const getSidebarOpen = (state: { toggle: { sidebar: boolean } }) =>
  state.toggle.sidebar;

/**getLoading:  get state of loading */
export const getLoading = (state: { toggle: { loading: boolean } }) =>
  state.toggle.loading;
