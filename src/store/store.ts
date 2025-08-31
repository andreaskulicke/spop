import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    MigrationManifest,
    PAUSE,
    PERSIST,
    PURGE,
    PersistedState,
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
import { Data } from "./data/data";

const dataMigrations: MigrationManifest = {
    0: (state: PersistedState): PersistedState => {
        const newState: PersistedState & Data = { ...state } as PersistedState &
            Data;
        newState.id = uuid.v4();
        newState.name = "Standart";
        newState.description = "";
        return newState;
    },
};

const dataPersistConfig = {
    key: "root",
    migrate: createMigrate(dataMigrations, { debug: false }),
    storage: AsyncStorage,
    version: 0,
};

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    version: -1,
};

const rootReducer = combineReducers({
    data: persistReducer(dataPersistConfig, dataSlice),
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
