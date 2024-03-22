import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./user"
import { apiSlice } from '../api/apiSlice';

configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        user: userReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware()
    .concat(apiSlice.middleware), devTools: true
})

export default configureStore