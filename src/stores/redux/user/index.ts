import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { userApi } from '@/api'
import * as types from '@/common/types'

export interface UserState {
  user: types.UserRecord,
}

const initialState: UserState = {
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<types.UserRecord>) => {
      state.user = action.payload
    },
  }
})

export const { setUser } = userSlice.actions

export const loadUserData = createAsyncThunk('user/loadUserData', async (_, { dispatch }) => {
  try {
    const result = await userApi.loadUserData()

    dispatch(setUser(result))
  } catch (e) {}
})

export default userSlice.reducer
