import { configureStore } from '@reduxjs/toolkit'
import itemsSlice from './itemsSlice'
import storagesSlice from './storagesSlice'
import shopsSlice from './shopsSlice'
import settingsSlice from './settingsSlice'

export const store = configureStore({
    reducer: {
        items: itemsSlice,
        settings: settingsSlice,
        shops: shopsSlice,
        storages: storagesSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
