import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from './store'

interface ToggleInterface {
  login: boolean;
  signup: boolean;
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
  login: false,
  signup: false,
  entry: false,
  sidebar: false,
  loading: false,
};

const toggleSlice = createSlice({
  name: 'toggle',
  initialState,
  reducers: {
    toggleLogin: (state) => {
      state.login = !state.login;
    },
    toggleSignup: (state) => {
      state.signup = !state.signup;
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

export const {
  toggleLogin,
  toggleEntry,
  toggleSidebar,
  toggleSignup,
  toggleLoading,
} = toggleSlice.actions;

export default toggleSlice.reducer;

export const getLoginOpen = (state: { toggle: { login: boolean } }) =>
  state.toggle.login;
export const getSignupOpen = (state: { toggle: { signup: boolean } }) =>
  state.toggle.signup;
export const getEntryOpen = (state: { toggle: { entry: boolean } }) =>
  state.toggle.entry;
export const getSidebarOpen = (state: { toggle: { sidebar: boolean } }) =>
  state.toggle.sidebar;
export const getLoading = (state: { toggle: { loading: boolean } }) =>
  state.toggle.loading;
