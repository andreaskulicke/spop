import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';

export interface UiState {
    version: string;
    itemsList: {
        items: {
            expanded: boolean;
        };
        without: {
            expanded: boolean;
        };
        latestInArea: {
            expanded: boolean;
        };
        latest: {
            expanded: boolean;
        };
    };
}

// Define the initial state using that type
const initialState: UiState = {
    version: "1.0.0",
    itemsList: {
        items: {
            expanded: true,
        },
        without: {
            expanded: true,
        },
        latestInArea: {
            expanded: false,
        },
        latest: {
            expanded: false,
        },
    }
}

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setUiItemsListItems: (state, action: PayloadAction<{ expanded: boolean }>) => {
            state.itemsList.items.expanded = action.payload.expanded;
        },
        setUiItemsListWithout: (state, action: PayloadAction<{ expanded: boolean }>) => {
            state.itemsList.without.expanded = action.payload.expanded;
        },
        setUiItemsListLatestInArea: (state, action: PayloadAction<{ expanded: boolean }>) => {
            state.itemsList.latestInArea.expanded = action.payload.expanded;
        },
        setUiItemsListLatest: (state, action: PayloadAction<{ expanded: boolean }>) => {
            state.itemsList.latest.expanded = action.payload.expanded;
        },
    }
})

export const {
    setUiItemsListItems,
    setUiItemsListWithout,
    setUiItemsListLatestInArea,
    setUiItemsListLatest,
} = uiSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default uiSlice.reducer

export function selectUiItemsList(state: RootState): UiState["itemsList"] {
    return state.ui.itemsList;
}
