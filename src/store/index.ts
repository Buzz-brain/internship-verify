import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authSlice from './slices/authSlice'
import notificationSlice from './slices/notificationSlice'
import internshipSlice from './slices/internshipSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    notifications: notificationSlice,
    internships: internshipSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector