import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from './store'
interface UserInterface {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  created_at: string;
}

interface TokenInterface {
  access_token: string | null;
  token_type: string | null;
}

interface UserState {
  user: null | UserInterface;
  token: null | TokenInterface;
}

const initialState: UserState = {
  user: null,
  token: {
    access_token: localStorage.getItem("token"),
    token_type: "bearer",
  },
};

const userSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: UserInterface }>) => {
      const { user } = action.payload;
      state.user = user;
    },
    setToken: (state, action: PayloadAction<{ token: TokenInterface }>) => {
      const { token } = action.payload;
      state.token = token;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, logoutUser } = userSlice.actions;

export default userSlice.reducer;

export const getUser = (state: {
  user: { user: UserInterface | null; token: TokenInterface | null };
}) => state.user;
