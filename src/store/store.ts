import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import {
    createMigrate,
    FLUSH,
    MigrationManifest,
    PAUSE,
    PERSIST,
    PersistConfig,
    PersistedState,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
    Storage as ReduxPersistStorage,
} from "redux-persist";
import { Data } from "./data/data";
import dataSlice from "./dataSlice";
import otherDataSlice, { OtherData } from "./otherDataSlice";
import settingsSlice, { Settings } from "./settingsSlice";
import uiSlice from "./uiSlice";
import undoable from "redux-undo";

// Storage getItem/setItem:
// 'key' is always `persist:${persistConfig.key}`.
// 'value' is always complete slice data.
function DebugStorage(slice: string): ReduxPersistStorage {
    const logStorageCalls = false;

    return {
        getItem: (key: string, ...args: Array<any>): any => {
            if (logStorageCalls) {
                console.log(`${slice}/getItem: key=${key}, args=${args}`);
            }
            return AsyncStorage.getItem(key, args[0]);
        },
        setItem: (key: string, value: any, ...args: Array<any>): any => {
            if (logStorageCalls) {
                console.log(
                    `${slice}/setItem: key=${key}, value=${value}, args=${args}`,
                );
            }
            return AsyncStorage.setItem(key, value, args[0]);
        },
        removeItem: (key: string, ...args: Array<any>): any => {
            if (logStorageCalls) {
                console.log(`${slice}/removeItem: key=${key}, args=${args}`);
            }
            return AsyncStorage.removeItem(key, args[0]);
        },
    } as ReduxPersistStorage;
}

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
    key: "data",
    migrate: createMigrate(migrationsData, { debug: false }),
    storage: DebugStorage("data"),
    version: 0,
};

const persistConfigOtherData: PersistConfig<OtherData> = {
    key: "otherData",
    storage: DebugStorage("otherData"),
    version: -1,
};

const persistConfigSettings: PersistConfig<Settings> = {
    key: "settings",
    storage: DebugStorage("settings"),
    version: -1,
};

const undoLimit = 10;
const rootReducer = combineReducers({
    data: undoable(persistReducer(persistConfigData, dataSlice), {
        limit: undoLimit,
    }),
    otherData: undoable(
        persistReducer(persistConfigOtherData, otherDataSlice),
        { limit: undoLimit },
    ),
    settings: undoable(persistReducer(persistConfigSettings, settingsSlice), {
        limit: undoLimit,
    }),
    ui: uiSlice,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                    REHYDRATE,
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
