import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';

export interface Category {
    id: string;
    name: string;
}

export interface Item {
    id: string;
    name: string;
    amount?: string;
    categoryId?: string;
    wanted?: boolean;
    shops: { shopId: string; }[];
    storages: { storageId: string; }[];
}

export interface Shop {
    id: string;
    name: string;
    active?: boolean;
    /** Category IDs that are present here are shown in the order of this array */
    categoryIds?: string[];
}

export interface Storage {
    id: string;
    name: string;
    active?: boolean;
}

export interface Data {
    categories: Category[];
    items: Item[];
    shops: Shop[];
    storages: Storage[];
}

// Define the initial state using that type
const initialState: Data = {
    categories: [
        {
            id: "vegetables",
            name: "Gemüse",
        },
        {
            id: "sweets",
            name: "Süßigkeiten",
        },
    ],
    items: [
        {
            id: "Gurken",
            name: "Gurken",
            amount: "2 Teile",
            shops: [],
            storages: [{ storageId: "fridge" }],
        },
        {
            id: "Tomaten",
            name: "Tomaten",
            shops: [],
            storages: [],
        },
    ],
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
    storages: [
        {
            id: "pantry",
            name: "Speisekammer",
        },
        {
            id: "fridge",
            name: "Kühlschrank",
        },
        {
            id: "storageroom",
            name: "Abstellraum",
        },
        {
            id: "freezer",
            name: "Tiefkühlschrank",
        },
        {
            id: "laundry",
            name: "Waschküche",
        },
    ],

}

export const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        // Categories
        addCategory: (state, action: PayloadAction<string>) => {
            state.categories.push({
                id: action.payload,
                name: "Neu",
            });
        },
        deleteCategory: (state, action: PayloadAction<string>) => {
            const index = state.categories.findIndex(x => x.id === action.payload);
            if (index !== -1) {
                state.categories.splice(index, 1);
            }
        },
        resetCategories: (state, action: PayloadAction<void>) => {
            state = initialState;
        },
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
        setCategoryName: (state, action: PayloadAction<{ id: string, name: string }>) => {
            const category = state.categories.find(x => x.id === action.payload.id);
            if (category) {
                category.name = action.payload.name;
            }
        },

        // Items
        resetItems: (state, action: PayloadAction<void>) => {
            state.items = initialState.items;
        },
        setItems: (state, action: PayloadAction<Data>) => {
            state.items = action.payload.items;
            for (const item of state.items) {
                if (!item.shops) {
                    item.shops = [];
                }
                if (!item.storages) {
                    item.storages = [];
                }
            }
        },
        addItem: (state, action: PayloadAction<{ item: Item, storageId: string }>) => {
            const item = state.items.find(x => x.id === action.payload.item.id);
            if (item) {
                item.amount = action.payload.item.amount;
                item.wanted = true;
                if ((action.payload.storageId !== allStorage.id)
                    && !item.storages.find(x => x.storageId === action.payload.storageId)) {
                    item.storages.push({ storageId: action.payload.storageId });
                }
            } else {
                const newItem: Item = {
                    ...action.payload.item,
                    wanted: true,
                };
                if ((action.payload.storageId !== allStorage.id)
                    && !newItem.storages.find(x => x.storageId === action.payload.storageId)) {
                    newItem.storages.push({ storageId: action.payload.storageId });
                }
                state.items.unshift(newItem);
            }
        },
        setItemAmount: (state, action: PayloadAction<{ itemId: string, amount: string }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                item.amount = action.payload.amount;
            }
        },
        setItemCategory: (state, action: PayloadAction<{ itemId: string, categoryId: string }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                item.categoryId = action.payload.categoryId;
            }
        },
        checkItem: (state, action: PayloadAction<{ itemId: string, check: boolean }>) => {
            const index = state.items.findIndex(x => x.id === action.payload.itemId);
            if (index !== -1) {
                const item = state.items.splice(index, 1)[0];
                state.items.unshift(item);
                item.wanted = action.payload.check;
            }
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex(x => x.id === action.payload);
            if (index !== -1) {
                state.items.splice(index, 1);
            }
        },
        deleteItems: (state, action: PayloadAction<string[]>) => {
            for (const item of state.items) {
                const index = action.payload.findIndex(x => x === item.id);
                if (index !== -1) {
                    state.items.splice(index, 1);
                }
            }
        },
        setItemName: (state, action: PayloadAction<{ itemId: string, name: string }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                item.name = action.payload.name;
            }
        },
        toggleItemShop: (state, action: PayloadAction<{ itemId: string, shopId: string }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                const shopIndex = item.shops.findIndex(x => x.shopId === action.payload.shopId);
                if (shopIndex === -1) {
                    item.shops.push({ shopId: action.payload.shopId });
                } else {
                    item.shops.splice(shopIndex, 1);
                }
            }
        },
        setItemStorage: (state, action: PayloadAction<{ itemId: string, storageId: string, checked: boolean }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                const index = item.storages.findIndex(x => x.storageId === action.payload.storageId);
                if (action.payload.checked && (index === -1)) {
                    item.storages.push({ storageId: action.payload.storageId });
                }
                else if (!action.payload.checked && (index !== -1)) {
                    item.storages.splice(index, 1);
                }

            }
        },

        // Shops
        resetShops: (state, action: PayloadAction<void>) => {
            state.shops = initialState.shops;
        },
        setShops: (state, action: PayloadAction<Shop[]>) => {
            state.shops = action.payload;
            for (const shop of state.shops) {
                if (!shop.categoryIds) {
                    shop.categoryIds = initialState.categories.map(x => x.id);
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
        // Shops - Categories
        addShopCategory: (state, action: PayloadAction<{ id: string, categoryId: string }>) => {
            const shop = state.shops.find(x => x.id === action.payload.id);
            if (shop) {
                shop.categoryIds.push(action.payload.categoryId);
            }
        },
        setShopCategories: (state, action: PayloadAction<{ id: string, categoryIds: string[] }>) => {
            const shop = state.shops.find(x => x.id === action.payload.id);
            if (shop) {
                shop.categoryIds = action.payload.categoryIds.filter(x => !!x);
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

        // Storages
        addStorage: (state, action: PayloadAction<string>) => {
            state.storages.push({
                id: action.payload,
                name: "Neu",
            });
        },
        deleteStorage: (state, action: PayloadAction<string>) => {
            const index = state.storages.findIndex(x => x.id === action.payload);
            if (index !== -1) {
                state.storages.splice(index, 1);
            }
        },
        resetStorages: (state, action: PayloadAction<void>) => {
            state.storages = initialState.storages;
        },
        setStorages: (state, action: PayloadAction<Storage[]>) => {
            state.storages = action.payload;
        },
        setStorageName: (state, action: PayloadAction<{ id: string, name: string }>) => {
            const storage = state.storages.find(x => x.id === action.payload.id);
            if (storage) {
                storage.name = action.payload.name;
            }
        },
        setActiveStorage: (state, action: PayloadAction<string>) => {
            for (const storage of state.storages) {
                storage.active = false;
                if (storage.id === action.payload) {
                    storage.active = true;
                }
            }
        },
    }
})

export const {
    // Categories
    addCategory,
    deleteCategory,
    resetCategories,
    setCategories,
    setCategoryName,

    // Items
    addItem,
    setItemAmount,
    checkItem,
    deleteItem,
    deleteItems,
    resetItems,
    setItemCategory,
    setItemName,
    setItemStorage,
    setItems,
    toggleItemShop,

    // Shops
    addShop,
    addShopCategory,
    deleteShop,
    resetShops,
    setActiveShop,
    setShopCategories,
    setShopCategoryShow,
    setShopName,
    setShops,

    // Storages
    addStorage,
    deleteStorage,
    resetStorages,
    setActiveStorage,
    setStorageName,
    setStorages,
} = itemsSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default itemsSlice.reducer

// Categories

export function selectCategory(id: string): (state: RootState) => Category | undefined {
    return (state: RootState) => {
        const item = state.data.categories.find(x => x.id === id);
        return item;
    };
}

// Items

export function selectItem(id: string): (state: RootState) => Item | undefined {
    return (state: RootState) => {
        const item = state.data.items.find(x => x.id === id);
        return item;
    };
}

// Shops

export const allShop: Shop = {
    id: "_",
    name: "Alle",
}

export function selectShop(id: string): (state: RootState) => Shop | undefined {
    return (state: RootState) => {
        const item = state.data.shops.find(x => x.id === id);
        return item;
    };
}

export function selectActiveShop(state: RootState): Shop {
    let shop = state.data.shops.find(x => x.active);
    if (!shop) {
        shop = allShop;
    }
    return shop;
}

// Storages

export const allStorage: Storage = {
    id: "_",
    name: "Alle",
}

export function selectStorage(id: string): (state: RootState) => Storage | undefined {
    return (state: RootState) => {
        const item = state.data.storages.find(x => x.id === id);
        return item;
    };
}

export function selectActiveStorage(state: RootState): Storage {
    let storage = state.data.storages.find(x => x.active);
    if (!storage) {
        storage = allStorage;
    }
    return storage;
}
