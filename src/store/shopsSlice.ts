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
        addShop: (state, action: PayloadAction<string>) => {
            state.shops.push({
                id: action.payload,
                name: "Neu",
            });
        },
        deleteShop: (state, action: PayloadAction<string>) => {
            const index = state.shops.findIndex(x => x.id === action.payload);
            if (index !== -1) {
                state.shops.splice(index, 1);
            }
        },
        setActiveShop: (state, action: PayloadAction<string>) => {
            for (const shop of state.shops) {
                shop.active = false;
                if (shop.id === action.payload) {
                    shop.active = true;
                }
            }
        },
        setShopName: (state, action: PayloadAction<{ id: string, name: string }>) => {
            const shop = state.shops.find(x => x.id === action.payload.id);
            if (shop) {
                shop.name = action.payload.name;
            }
        },
    }
})

export const {
    addShop,
    deleteShop,
    setActiveShop,
    setShopName,
} = shopsSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default shopsSlice.reducer

export const allShop: ShopState = {
    id: "_",
    name: "Alle",
}

export function selectShop(id: string): (state: RootState) => ShopState | undefined {
    return (state: RootState) => {
        const item = state.shops.shops.find(x => x.id === id);
        return item;
    };
}

export function selectActiveShop(state: RootState): ShopState {
    let shop = state.shops.shops.find(x => x.active);
    if (!shop) {
        shop = allShop;
    }
    return shop;
}
