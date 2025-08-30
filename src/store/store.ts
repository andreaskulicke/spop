import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    createMigrate,
    persistReducer,
    persistStore,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dataSlice from "./dataSlice";
import otherDataSlice from "./otherDataSlice";
import settingsSlice from "./settingsSlice";
import uiSlice from "./uiSlice";
import uuid from "react-native-uuid";

const migrations = {
    0: (state: any) => {
        const newState = { ...state };
        newState.data.id = uuid.v4();
        newState.data.name = "Standart";
        newState.data.description = "";
        newState.otherData = [];
        return newState;
    },
};

const persistConfig = {
    key: "root",
    migrate: createMigrate(migrations, { debug: false }),
    storage: AsyncStorage,
    version: 0,
};

const rootReducer = combineReducers({
    data: persistReducer(persistConfig, dataSlice),
    otherData: persistReducer(persistConfig, otherDataSlice),
    settings: persistReducer(persistConfig, settingsSlice),
    ui: uiSlice,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
