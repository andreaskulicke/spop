import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';

export interface StorageState {
    id: string;
    name: string;
    active?: boolean;
}

export interface StoragesState {
    storages: StorageState[];
}

// Define the initial state using that type
const initialState: StoragesState = {
    storages: [
        {
            id: "Kü1",
            name: "Speisekammer",
        },
        {
            id: "Kü2",
            name: "Kühlschrank",
        },
        {
            id: "Keller1",
            name: "Abstellraum",
        },
        {
            id: "Keller2",
            name: "Tiefkühlschrank",
        },
        {
            id: "Wasch",
            name: "Waschküche",
        },
    ],
}

export const storagesSlice = createSlice({
    name: "storages",
    initialState,
    reducers: {
        addStorage: (state, action: PayloadAction<string>) => {
            state.storages.push({
                id: action.payload,
                name: "Neu",
            });
        },
        deleteStorage: (state, action: PayloadAction<string>) => {
            const index = state.storages.findIndex(x => x.id === action.payload);
            if (index !== -1) {
                state.storages.splice(index, 1);
            }
        },
        setStorages: (state, action: PayloadAction<StoragesState>) => {
            state.storages = action.payload.storages;
        },
        setStorageName: (state, action: PayloadAction<{ id: string, name: string }>) => {
            const storage = state.storages.find(x => x.id === action.payload.id);
            if (storage) {
                storage.name = action.payload.name;
            }
        },
        setActiveStorage: (state, action: PayloadAction<string>) => {
            for (const storage of state.storages) {
                storage.active = false;
                if (storage.id === action.payload) {
                    storage.active = true;
                }
            }
        },
    }
})

export const {
    addStorage,
    deleteStorage,
    setActiveStorage,
    setStorageName,
    setStorages,
} = storagesSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default storagesSlice.reducer

export const allStorage: StorageState = {
    id: "_",
    name: "Alle",
}

export function selectStorage(id: string): (state: RootState) => StorageState | undefined {
    return (state: RootState) => {
        const item = state.storages.storages.find(x => x.id === id);
        return item;
    };
}

export function selectActiveStorage(state: RootState): StorageState {
    let storage = state.storages.storages.find(x => x.active);
    if (!storage) {
        storage = allStorage;
    }
    return storage;
}
