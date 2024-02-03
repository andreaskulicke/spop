import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'
import dataSlice from './dataSlice'
import settingsSlice from './settingsSlice'
import thunk from 'redux-thunk';
import uiSlice from './uiSlice';

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
};

const persisterDataReducer = persistReducer(persistConfig, dataSlice);
const persisterSettingsReducer = persistReducer(persistConfig, settingsSlice);

const rootReducer = combineReducers({
    data: persisterDataReducer,
    settings: persisterSettingsReducer,
    ui: uiSlice,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk],
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
