import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';
import { allStorage } from './storagesSlice';

export interface ItemState {
    id: string;
    name: string;
    amount?: string;
    checked?: boolean;
    storages: { storageId: string; }[];
}

export interface ItemsState {
    items: ItemState[];
}

// Define the initial state using that type
const initialState: ItemsState = {
    items: [
        {
            id: "Gurken",
            name: "Gurken",
            amount: "2 Teile",
            storages: [{ storageId: "Kühlschrank" }],
        },
        {
            id: "Tomaten",
            name: "Tomaten",
            storages: [],
        },
    ],
}

export const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<ItemsState>) => {
            state.items = action.payload.items;
        },
        addItem: (state, action: PayloadAction<{ item: ItemState, storageId: string }>) => {
            const item = state.items.find(x => x.id === action.payload.item.id);
            if (item) {
                item.checked = true;
                if ((action.payload.storageId !== allStorage.id)
                    && !item.storages.find(x => x.storageId === action.payload.storageId)) {
                    item.storages.push({ storageId: action.payload.storageId });
                }
            } else {
                const newItem = {
                    ...action.payload.item,
                    checked: true,
                };
                if ((action.payload.storageId !== allStorage.id)
                    && !newItem.storages.find(x => x.storageId === action.payload.storageId)) {
                    newItem.storages.push({ storageId: action.payload.storageId });
                }
                state.items.push(newItem);
            }
        },
        changeItemAmount: (state, action: PayloadAction<{ itemId: string, amount: string }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                item.amount = action.payload.amount;
            }
        },
        checkItem: (state, action: PayloadAction<{ itemId: string, check: boolean }>) => {
            const index = state.items.findIndex(x => x.id === action.payload.itemId);
            if (index !== -1) {
                const item = state.items.splice(index, 1)[0];
                state.items.unshift(item);
                item.checked = action.payload.check;
            }
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex(x => x.id === action.payload);
            if (index !== -1) {
                state.items.splice(index, 1);
            }
        },
        setItemName: (state, action: PayloadAction<{ itemId: string, name: string }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                item.name = action.payload.name;
            }
        },
        toggleItemStorage: (state, action: PayloadAction<{ itemId: string, storageId: string }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                const storageIndex = item.storages.findIndex(x => x.storageId === action.payload.storageId);
                if (storageIndex === -1) {
                    item.storages.push({ storageId: action.payload.storageId });
                } else {
                    item.storages.splice(storageIndex, 1);
                }
            }
        },
    }
})

export const {
    addItem,
    changeItemAmount,
    checkItem,
    deleteItem,
    setItemName,
    setItems,
    toggleItemStorage,
} = itemsSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default itemsSlice.reducer

export function selectItem(id: string): (state: RootState) => ItemState | undefined {
    return (state: RootState) => {
        const item = state.items.items.find(x => x.id === id);
        return item;
    };
}
