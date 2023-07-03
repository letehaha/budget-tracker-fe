import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { api, initApiCaller } from '@/api'
import { validateToken, logout } from '@/stores/redux/auth'

export interface RootState {
  isAppInitialized: boolean,
}

const initialState: RootState = {
  isAppInitialized: false,
}

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setAppInitialized: (state, action: PayloadAction<boolean>) => {
      state.isAppInitialized = action.payload
    },
  }
})

export const { setAppInitialized } = rootSlice.actions

export const initializeApp = createAsyncThunk('root/init', async(_, { dispatch }) => {
  initApiCaller({ logout: () => dispatch(logout()) })

  await dispatch(validateToken())

  dispatch(setAppInitialized(true))
})

export default rootSlice.reducer
