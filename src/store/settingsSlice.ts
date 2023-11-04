import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ColorSchemeName } from 'react-native';

export interface SettingsState {
    colorTheme?: ColorSchemeName;
}

// Define the initial state using that type
const initialState: SettingsState = {
}

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setColorTheme: (state, action: PayloadAction<ColorSchemeName>) => {
            state.colorTheme = action.payload;
        },
    }
})

export const {
    setColorTheme,
} = settingsSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default settingsSlice.reducer
