import { configureStore } from '@reduxjs/toolkit'
import dataSlice from './dataSlice'
import settingsSlice from './settingsSlice'

export const store = configureStore({
    reducer: {
        data: dataSlice,
        settings: settingsSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
