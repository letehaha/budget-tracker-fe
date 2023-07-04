import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { ERROR_CODES } from 'shared-types';
import { api } from '@/api';
import { loadUserData } from '@/stores/redux/user'

export interface AuthState {
  isLoggedIn: boolean,
  userToken: string | null,
  isTokenChecked: boolean,
}

const initialState: AuthState = {
  isLoggedIn: false,
  userToken: null,
  isTokenChecked: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedInStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload
    },
    setUserToken: (state, action: PayloadAction<string>) => {
      state.userToken = action.payload
    },
    setTokenChecked: (state, action: PayloadAction<boolean>) => {
      state.isTokenChecked = action.payload
    }
  }
})

export const { setLoggedInStatus, setUserToken, setTokenChecked } = authSlice.actions

export const login = createAsyncThunk('auth/login', async (
  { password, username }: { password: string, username: string },
  { dispatch }
) => {
  try {
    const result = await api.post('/auth/login', {
      password,
      username,
    })

    if (result.token) {
      api.setToken(result.token)
      await dispatch(loadUserData())

      // await categoriesStore.loadCategories();

      dispatch(setUserToken(result.token))
      localStorage.setItem('user-token', result.token);
      dispatch(setLoggedInStatus(true))
    }

    return result
  } catch (e) {
    const possibleErrorCodes = [
      ERROR_CODES.notFound,
      ERROR_CODES.invalidCredentials,
    ];

    if (possibleErrorCodes.includes(e.data.code)) {
      throw e.data;
    }
  }
})

export const validateToken = createAsyncThunk('auth/validateToken', async (_, { dispatch }) => {
  const token = localStorage.getItem('user-token')

  if (!token) return dispatch(setTokenChecked(true))

  try {
    api.setToken(token)
    await api.get('/auth/validate-token')
    setLoggedInStatus(true)
  } catch (err) {
    setLoggedInStatus(false)
  } finally {
    dispatch(setTokenChecked(true))
  }
})

export const logout = createAsyncThunk('auth/logout', async(_, { dispatch }) => {
  api.setToken('');
  localStorage.setItem('user-token', '');
})

export default authSlice.reducer
