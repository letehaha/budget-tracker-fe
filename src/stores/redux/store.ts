import { AnyAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import AuthReducer from './auth'
import RootReducer from './root'
import UserReducer from './user'

const store = configureStore({
  reducer: {
    root: RootReducer,
    auth: AuthReducer,
    user: UserReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
