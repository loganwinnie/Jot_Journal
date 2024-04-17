/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logoutUser } from "../redux/user";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env?.BACKEND_URL || "http://localhost:8000",
  credentials: "omit",
  prepareHeaders: (headers, { getState }: any) => {
    const token: string = getState().user.token?.access_token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const logoutIfUnauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logoutUser(undefined));
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: logoutIfUnauth,
  endpoints: () => ({}),
});
