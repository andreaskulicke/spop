import { ColorSchemeName } from "react-native";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { ThemeName, themes } from "./themes/themes";

export type KeepAwakeArea = "storages" | "categories" | "shops";

export interface Settings {
    version: string;
    display: {
        colorTheme: ColorSchemeName;
        theme: ThemeName;
        keepAwake: KeepAwakeArea[];
        hideShoppingListInTitle?: boolean;
    };
}

// Define the initial state using that type
const initialState: Settings = {
    version: "1.0.0",
    display: {
        colorTheme: undefined,
        theme: "default",
        keepAwake: ["storages", "shops"],
    },
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        resetSettings: () => {
            return initialState;
        },
        setSettings: (state, action: PayloadAction<Settings>) => {
            return action.payload;
        },

        setColorTheme: (state, action: PayloadAction<ColorSchemeName>) => {
            state.display.colorTheme = action.payload;
        },
        setHideShoppingListInTitle: (state, action: PayloadAction<boolean>) => {
            state.display.hideShoppingListInTitle = action.payload;
        },
        setKeepAwake: (
            state,
            action: PayloadAction<{
                area: KeepAwakeArea;
                keepAwake: boolean;
            }>,
        ) => {
            if (action.payload.keepAwake) {
                state.display.keepAwake = [
                    ...new Set(
                        (state.display.keepAwake ?? []).concat(
                            action.payload.area,
                        ),
                    ),
                ];
            } else {
                state.display.keepAwake =
                    state.display.keepAwake?.filter(
                        (x) => x !== action.payload.area,
                    ) ?? [];
            }
        },
        setTheme: (state, action: PayloadAction<ThemeName>) => {
            state.display.theme = action.payload;
        },
    },
});

export const {
    resetSettings,
    setSettings,

    setColorTheme,
    setHideShoppingListInTitle,
    setKeepAwake,
    setTheme,
} = settingsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default settingsSlice.reducer;

export const selectTheme = createSelector(
    (state: RootState) => state.settings.display.theme,
    (state: RootState, isDark: boolean) => isDark,
    (themeName: ThemeName, isDark: boolean) => {
        const t = themes.find((x) => x.id === themeName) ?? themes[0];
        return isDark ? t.dark : t.light;
    },
);

export function selectSettings(state: RootState): Settings {
    return state.settings;
}

export function selectKeepAwakeCategories(state: RootState): boolean {
    if (state.settings.display.keepAwake) {
        return !!state.settings.display.keepAwake.find(
            (x) => x === "categories",
        );
    }
    return false;
}

export function selectKeepAwakeShops(state: RootState): boolean {
    if (state.settings.display.keepAwake) {
        return !!state.settings.display.keepAwake.find((x) => x === "shops");
    }
    return true;
}

export function selectKeepAwakeStorages(state: RootState): boolean {
    if (state.settings.display.keepAwake) {
        return !!state.settings.display.keepAwake.find((x) => x === "storages");
    }
    return true;
}

export const selectKeepAwake = createSelector(
    (state: RootState) => state.settings.display.keepAwake,
    (state: RootState, area: KeepAwakeArea) => area,
    (keepAwake: KeepAwakeArea[], area: KeepAwakeArea) => {
        if (keepAwake) {
            return !!keepAwake.find((x) => x === area);
        }
        switch (area) {
            case "categories":
                return false;
            default:
                return true;
        }
    },
);
