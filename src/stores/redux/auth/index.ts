import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/stores/redux/store'
import { ERROR_CODES } from 'shared-types';
import { AppDispatch } from '../store'
import { api } from '@/api';

export interface AuthState {
  user: any,
  isLoggedIn: boolean,
  userToken: string | null,
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  userToken: null,
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
    }
  }
})

export const { setLoggedInStatus, setUserToken } = authSlice.actions

export const login = ({ password, username }) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await api.post('/auth/login', {
        password,
        username,
      });

      if (result.token) {
        api.setToken(result.token);

        // await userStore.loadUser();
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
  }
}

export default authSlice.reducer
