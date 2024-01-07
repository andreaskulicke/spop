import { ColorSchemeName } from 'react-native';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';
import { ThemeName, themes, ThemeType } from './themes/themes';

export interface Settings {
    version: string;
    display: {
        colorTheme: ColorSchemeName;
        theme: ThemeName;
    },
}

// Define the initial state using that type
const initialState: Settings = {
    version: "1.0.0",
    display: {
        colorTheme: undefined,
        theme: "default",
    },
}

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettings: (state, action: PayloadAction<Settings>) => {
            state = action.payload;
        },

        setColorTheme: (state, action: PayloadAction<ColorSchemeName>) => {
            state.display.colorTheme = action.payload;
        },
        setTheme: (state, action: PayloadAction<ThemeName>) => {
            state.display.theme = action.payload;
        },
    }
})

export const {
    setSettings,

    setColorTheme,
    setTheme,
} = settingsSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default settingsSlice.reducer

export function selectTheme(isDark: boolean): (state: RootState) => ThemeType {
    return (state: RootState) => {
        const t = themes.find(x => x.id === state.settings.display.theme) ?? themes[0];
        return isDark ? t.dark : t.light;
    };
}
