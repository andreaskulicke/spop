import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import {
    FLUSH,
    MigrationManifest,
    PAUSE,
    PERSIST,
    PURGE,
    PersistConfig,
    PersistedState,
    REGISTER,
    REHYDRATE,
    createMigrate,
    persistReducer,
    persistStore,
} from "redux-persist";
import { Data } from "./data/data";
import dataSlice from "./dataSlice";
import otherDataSlice, { OtherData } from "./otherDataSlice";
import settingsSlice, { Settings } from "./settingsSlice";
import uiSlice from "./uiSlice";

const migrationsData: MigrationManifest = {
    0: (state: PersistedState): PersistedState => {
        const newState: PersistedState & Data = { ...state } as PersistedState &
            Data;
        newState.id = uuid.v4();
        newState.name = "Standart";
        newState.description = "";
        return newState;
    },
};

const persistConfigData: PersistConfig<Data> = {
    key: "root",
    migrate: createMigrate(migrationsData, { debug: false }),
    storage: AsyncStorage,
    version: 0,
};

const persistConfigOtherData: PersistConfig<OtherData> = {
    key: "root",
    storage: AsyncStorage,
    version: -1,
};

const persistConfigSettings: PersistConfig<Settings> = {
    key: "root",
    storage: AsyncStorage,
    version: -1,
};

const rootReducer = combineReducers({
    data: persistReducer(persistConfigData, dataSlice),
    otherData: persistReducer(persistConfigOtherData, otherDataSlice),
    settings: persistReducer(persistConfigSettings, settingsSlice),
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

export function isRootState(state: any): state is RootState {
    return (state as RootState).data !== undefined;
}
