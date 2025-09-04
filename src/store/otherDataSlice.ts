import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { Data } from "./data/data";
import { initialDataState } from "./dataSlice";

export interface OtherData {
    lists: Data[];
}

// Define the initial state using that type
const initialState: OtherData = { lists: [] };

export const initialOtherDataState = initialState;

export const otherDataSlice = createSlice({
    name: "otherData",
    initialState,
    reducers: {
        resetOtherData: (state, action: PayloadAction<void>) => {
            return initialState;
        },
        setOtherData: (state, action: PayloadAction<OtherData>) => {
            return action.payload;
        },
        setShoppingLists: (state, action: PayloadAction<Data[]>) => {
            state.lists = action.payload;
        },

        addShoppingList: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.lists.push({
                ...initialDataState,
                id: id,
                name: "Neue Liste",
            });
        },
        deleteShoppingList: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const index = state.lists.findIndex((x) => x.id === id);
            if (index !== -1) {
                state.lists.splice(index, 1);
            }
        },
        setShoppingListName: (
            state,
            action: PayloadAction<{ id: string; name: string }>,
        ) => {
            const shoppingList = state.lists.find(
                (x) => x.id === action.payload.id,
            );
            if (shoppingList) {
                shoppingList.name = action.payload.name;
            }
        },
        setShoppingListDescription: (
            state,
            action: PayloadAction<{
                id: string;
                description: string | undefined;
            }>,
        ) => {
            const shoppingList = state.lists.find(
                (x) => x.id === action.payload.id,
            );
            if (shoppingList) {
                shoppingList.description = action.payload.description;
            }
        },
        updateActiveShoppingList: (
            state,
            action: PayloadAction<{ id: string; data: Data }>,
        ) => {
            const index = state.lists.findIndex(
                (x) => x.id === action.payload.id,
            );
            if (index !== -1) {
                state.lists.splice(index, 1);
            }
            state.lists.unshift(action.payload.data);
        },
    },
});

export const {
    resetOtherData,
    setOtherData,
    setShoppingLists,
    addShoppingList,
    deleteShoppingList,
    setShoppingListName,
    setShoppingListDescription,
    updateActiveShoppingList,
} = otherDataSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default otherDataSlice.reducer;

export const selectShoppingLists = (state: RootState): Data[] => {
    return state.otherData.lists ?? [];
};

export const selectShoppingList = createSelector(
    [selectShoppingLists, (state: RootState, id: string) => id],
    (shoppingLists: Data[], id: string) => {
        const shoppingList = shoppingLists.find((x) => x.id === id);
        return shoppingList;
    },
);
