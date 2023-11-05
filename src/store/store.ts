import { configureStore } from '@reduxjs/toolkit'
import categoriesSlice from './categoriesSlice'
import itemsSlice from './itemsSlice'
import settingsSlice from './settingsSlice'
import shopsSlice from './shopsSlice'
import storagesSlice from './storagesSlice'

export const store = configureStore({
    reducer: {
        categories: categoriesSlice,
        items: itemsSlice,
        settings: settingsSlice,
        shops: shopsSlice,
        storages: storagesSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
