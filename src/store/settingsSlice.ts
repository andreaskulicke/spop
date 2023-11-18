import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ColorSchemeName } from 'react-native';

export interface Settings {
    display: {
        colorTheme: ColorSchemeName;
    },
    things: {
        useCalculator?: boolean;
    },
}

// Define the initial state using that type
const initialState: Settings = {
    display: {
        colorTheme: undefined,
    },
    things: {
        useCalculator: false,
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
        setUseCalculator: (state, action: PayloadAction<boolean>) => {
            state.things.useCalculator = action.payload;
        },
    }
})

export const {
    setSettings,

    setColorTheme,
    setUseCalculator,
} = settingsSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default settingsSlice.reducer
