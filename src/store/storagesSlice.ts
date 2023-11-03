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
        setStorages: (state, action: PayloadAction<StoragesState>) => {
            state.storages = action.payload.storages;
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

export const { setActiveStorage, setStorages } = storagesSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default storagesSlice.reducer

export const allStorage: StorageState = {
    id: "_",
    name: "Alle",
}

export function selectActiveStorage(state: RootState): StorageState {
    let storage = state.storages.storages.find(x => x.active);
    if (!storage) {
        storage = allStorage;
    }
    return storage;
}
