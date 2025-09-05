import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

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
    settings: {
        data: {
            expanded: boolean;
        };
    };
    showUndo?: boolean;
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
    },
    settings: {
        data: {
            expanded: false,
        },
    },
};

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        resetUi: (state, action: PayloadAction<void>) => {
            return initialState;
        },
        setUi: (state, action: PayloadAction<UiState>) => {
            return action.payload;
        },

        setUiItemsListItems: (
            state,
            action: PayloadAction<{ expanded: boolean }>,
        ) => {
            state.itemsList.items.expanded = action.payload.expanded;
        },
        setUiItemsListWithout: (
            state,
            action: PayloadAction<{ expanded: boolean }>,
        ) => {
            state.itemsList.without.expanded = action.payload.expanded;
        },
        setUiItemsListLatestInArea: (
            state,
            action: PayloadAction<{ expanded: boolean }>,
        ) => {
            state.itemsList.latestInArea.expanded = action.payload.expanded;
        },
        setUiItemsListLatest: (
            state,
            action: PayloadAction<{ expanded: boolean }>,
        ) => {
            state.itemsList.latest.expanded = action.payload.expanded;
        },

        setUiSettingsData: (
            state,
            action: PayloadAction<{ expanded: boolean }>,
        ) => {
            state.settings.data.expanded = action.payload.expanded;
        },

        setUiShowUndo: (state, action: PayloadAction<boolean>) => {
            state.showUndo = action.payload;
        },
    },
});

export const {
    resetUi,
    setUi,

    setUiItemsListItems,
    setUiItemsListWithout,
    setUiItemsListLatestInArea,
    setUiItemsListLatest,

    setUiSettingsData,

    setUiShowUndo,
} = uiSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default uiSlice.reducer;

export function selectUiItemsList(state: RootState): UiState["itemsList"] {
    return state.ui.itemsList;
}

export function selectUiSettingsDataExpanded(state: RootState): boolean {
    return state.ui.settings.data.expanded;
}

export function selectUiShowUndo(state: RootState): boolean {
    return !!state.ui.showUndo;
}
