import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import JournalAPI  from '../api'

interface UserInterface {
    email: string
    first_name: string
    last_name: string
    password: string
    created_at: string
}

interface UserState {
    user: null | UserInterface
    token: null | {
        access_token: string
        token_type: string
    } | null
}


const initialState: UserState = {user: null, token: null}


const userSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
     setUser: (state, action) => {
        const {user, token} = action.payload
        state.user = user
        state.token = token
        JournalAPI.token = token.access_token
     },
     logoutUser: (state, action) => {
        state.user = null
        state.token = null
        JournalAPI.token = null
     }
    },
  })

export const {setUser, logoutUser} = userSlice.actions

export default userSlice.reducer

export const getUser = (state) => state.auth.user
export const getToken = (state) => state.auth.token

