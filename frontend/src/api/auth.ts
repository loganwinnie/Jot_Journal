import { apiSlice } from "./apiSlice"

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: userInfo => ({
                url: "/auth/signup",
                method: "POST",
                body: {...userInfo},
            })
        }),
        login: builder.mutation({
            query: userInfo => ({
                url: "/auth/token",
                method: "POST",
                body: {...userInfo},
                prepareHeaders: (headers: Headers) => {
                    headers.set("contentType", "formData")
                    return headers
                }
            })
        })
    })
})

export const {
    useLoginMutation,
    useSignupMutation,
} = authApi