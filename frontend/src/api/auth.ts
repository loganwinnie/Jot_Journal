import { apiSlice } from "./apiSlice"

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: userInfo => ({
                url: "/auth/signup",
                method: "POST",
                body: {...userInfo},
            })
        })
    })
})