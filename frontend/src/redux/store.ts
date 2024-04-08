import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import entryReducer from "./entry";
import { apiSlice } from "../api/apiSlice";
import toggleReducer from "./toggle";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userReducer,
    toggle: toggleReducer,
    entry: entryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
