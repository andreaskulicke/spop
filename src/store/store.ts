import { configureStore } from '@reduxjs/toolkit'
import itemsSlice from './itemsSlice'
import storagesSlice from './storagesSlice'

export const store = configureStore({
    reducer: {
        items: itemsSlice,
        storages: storagesSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
