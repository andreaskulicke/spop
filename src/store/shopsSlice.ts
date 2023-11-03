import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';

export interface ShopState {
    id: string;
    name: string;
    active?: boolean;
}

export interface ShopsState {
    shops: ShopState[];
}

// Define the initial state using that type
const initialState: ShopsState = {
    shops: [
        {
            id: "polster",
            name: "Polster",
        },
        {
            id: "aldi",
            name: "Aldi",
        },
        {
            id: "rewe",
            name: "Rewe",
        },
        {
            id: "edeka",
            name: "Edeka",
        },
        {
            id: "rossmann",
            name: "Rossmann",
        },
    ],
}

export const shopsSlice = createSlice({
    name: "shops",
    initialState,
    reducers: {
        setActiveShop: (state, action: PayloadAction<string>) => {
            for (const shop of state.shops) {
                shop.active = false;
                if (shop.id === action.payload) {
                    shop.active = true;
                }
            }
        },
    }
})

export const {
    setActiveShop,
} = shopsSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default shopsSlice.reducer

export const allShop: ShopState = {
    id: "_",
    name: "Alle",
}

export function selectActiveShop(state: RootState): ShopState {
    let shop = state.shops.shops.find(x => x.active);
    if (!shop) {
        shop = allShop;
    }
    return shop;
}
