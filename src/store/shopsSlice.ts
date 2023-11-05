import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';
import { initialState as initialCategoriesState } from './categoriesSlice';

export interface ShopState {
    id: string;
    name: string;
    active?: boolean;
    /** Category IDs that are present here are shown in the order of this array */
    categoryIds?: string[];
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
        setShops: (state, action: PayloadAction<ShopsState>) => {
            state.shops = action.payload.shops;
            for (const shop of state.shops) {
                if (!shop.categoryIds) {
                    shop.categoryIds = initialCategoriesState.map(x => x.id);
                }
            }
        },
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
        setShopCategoryShow: (state, action: PayloadAction<{ id: string, categoryId: string, show: boolean }>) => {
            const shop = state.shops.find(x => x.id === action.payload.id);
            if (shop) {
                const index = shop.categoryIds.findIndex(x => x === action.payload.categoryId);
                if (action.payload.show && (index === -1)) {
                    shop.categoryIds.push(action.payload.categoryId);
                }
                else if (!action.payload.show && (index !== -1)) {
                    shop.categoryIds.splice(index, 1);
                }
            }
        },
    }
})

export const {
    addShop,
    deleteShop,
    setActiveShop,
    setShopCategoryShow,
    setShopName,
    setShops,
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
