import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import categoriesJson from "./data/categories.json";
import itemsJson from "./data/items.json";
import shopsJson from "./data/shops.json";
import storagesJson from "./data/storages.json";

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
    /** Category IDs that are present here are shown in the order of this array */
    categoryIds?: string[];
}

export interface Storage {
    id: string;
    name: string;
}

export interface Data {
    categories: Category[];
    items: Item[];
    shops: Shop[];
    storages: Storage[];
}

// Define the initial state using that type
const initialState: Data = {
    categories: categoriesJson,
    items: itemsJson,
    shops: shopsJson,
    storages: storagesJson,
}

function initializeShopCategoryIds(data: Data, shop: Shop) {
    if (!shop.categoryIds) {
        var currentCategories = new Set(data.categories.map(x => x.id));
        shop.categoryIds = initialState.categories
            .filter(x => currentCategories.has(x.id))
            .map(x => x.id);
    }
}

export const itemsSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Data>) => {
            state = action.payload;
        },

        // Categories
        addCategory: (state, action: PayloadAction<string>) => {
            const categoryId = action.payload;
            state.categories.push({
                id: categoryId,
                name: "Neu",
            });
        },
        deleteCategory: (state, action: PayloadAction<string>) => {
            const categoryId = action.payload;
            const index = state.categories.findIndex(x => x.id === categoryId);
            if (index !== -1) {
                state.categories.splice(index, 1);
                state.items.filter(item => item.categoryId === categoryId).forEach(item => item.categoryId = undefined);
                state.shops.forEach(shop => {
                    const index = shop.categoryIds?.findIndex(x => x === categoryId) ?? -1;
                    if (index !== -1) {
                        shop.categoryIds?.splice(index, 1);
                    }
                });
            }
        },
        resetCategories: (state) => {
            state.categories = initialState.categories;
        },
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
        setCategoryName: (state, action: PayloadAction<{ categoryId: string, name: string }>) => {
            const category = state.categories.find(x => x.id === action.payload.categoryId);
            if (category) {
                category.name = action.payload.name;
            }
        },

        // Items
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
        deleteItem: (state, action: PayloadAction<string>) => {
            const itemId = action.payload;
            const index = state.items.findIndex(x => x.id === itemId);
            if (index !== -1) {
                state.items.splice(index, 1);
            }
        },
        deleteItems: (state, action: PayloadAction<string[]>) => {
            const itemIds = action.payload;
            for (const item of state.items) {
                const index = itemIds.findIndex(x => x === item.id);
                if (index !== -1) {
                    state.items.splice(index, 1);
                }
            }
        },
        resetItems: (state) => {
            state.items = initialState.items;
        },
        setItems: (state, action: PayloadAction<Item[]>) => {
            state.items = action.payload;
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
        setItemName: (state, action: PayloadAction<{ itemId: string, name: string }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                item.name = action.payload.name;
            }
        },
        setItemShop: (state, action: PayloadAction<{ itemId: string, shopId: string, checked: boolean }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                const shopIndex = item.shops.findIndex(x => x.shopId === action.payload.shopId);
                if (action.payload.checked && (shopIndex === -1)) {
                    item.shops.push({ shopId: action.payload.shopId });
                }
                else if (!action.payload.checked && (shopIndex !== -1)) {
                    item.shops.splice(shopIndex, 1);
                }
            }
        },
        setItemStorage: (state, action: PayloadAction<{ itemId: string, storageId: string, checked: boolean }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                const storageIndex = item.storages.findIndex(x => x.storageId === action.payload.storageId);
                if (action.payload.checked && (storageIndex === -1)) {
                    item.storages.push({ storageId: action.payload.storageId });
                }
                else if (!action.payload.checked && (storageIndex !== -1)) {
                    item.storages.splice(storageIndex, 1);
                }
            }
        },
        setItemWanted: (state, action: PayloadAction<{ itemId: string, wanted: boolean }>) => {
            const index = state.items.findIndex(x => x.id === action.payload.itemId);
            if (index !== -1) {
                const item = state.items.splice(index, 1)[0];
                state.items.unshift(item);
                item.wanted = action.payload.wanted;
            }
        },

        // Shops
        addShop: (state, action: PayloadAction<string>) => {
            state.shops.push({
                id: action.payload,
                name: "Neu",
            });
        },
        deleteShop: (state, action: PayloadAction<string>) => {
            const shopId = action.payload;
            const index = state.shops.findIndex(x => x.id === shopId);
            if (index !== -1) {
                state.shops.splice(index, 1);
                state.items.forEach(item => {
                    const index = item.shops.findIndex(x => x.shopId === shopId);
                    if (index !== -1) {
                        item.shops.splice(index, 1);
                    }
                })
            }
        },
        resetShops: (state) => {
            state.shops = initialState.shops;
        },
        setShops: (state, action: PayloadAction<Shop[]>) => {
            state.shops = action.payload;
        },
        setShopName: (state, action: PayloadAction<{ shopId: string, name: string }>) => {
            const shop = state.shops.find(x => x.id === action.payload.shopId);
            if (shop) {
                shop.name = action.payload.name;
            }
        },
        // Shops - Categories
        addShopCategory: (state, action: PayloadAction<{ shopId: string, categoryId: string }>) => {
            const shop = state.shops.find(x => x.id === action.payload.shopId);
            if (shop) {
                initializeShopCategoryIds(state, shop);
                const index = shop.categoryIds?.findIndex(x => x === action.payload.categoryId) ?? -1;
                if (index === -1) {
                    shop.categoryIds?.push(action.payload.categoryId);
                }
            }
        },
        setShopCategories: (state, action: PayloadAction<{ shopId: string, categoryIds: string[] }>) => {
            const shop = state.shops.find(x => x.id === action.payload.shopId);
            if (shop) {
                shop.categoryIds = action.payload.categoryIds.filter(x => !!x);
            }
        },
        setShopCategoryShow: (state, action: PayloadAction<{ shopId: string, categoryId: string, show: boolean }>) => {
            const shop = state.shops.find(x => x.id === action.payload.shopId);
            if (shop) {
                initializeShopCategoryIds(state, shop);
                const categoryIndex = shop.categoryIds?.findIndex(x => x === action.payload.categoryId) ?? -1;
                if (action.payload.show && (categoryIndex === -1)) {
                    shop.categoryIds?.push(action.payload.categoryId);
                }
                else if (!action.payload.show && (categoryIndex !== -1)) {
                    shop.categoryIds?.splice(categoryIndex, 1);
                }
            }
        },

        // Storages
        addStorage: (state, action: PayloadAction<string>) => {
            const storageId = action.payload;
            state.storages.push({
                id: storageId,
                name: "Neu",
            });
        },
        deleteStorage: (state, action: PayloadAction<string>) => {
            const storageId = action.payload;
            const index = state.storages.findIndex(x => x.id === storageId);
            if (index !== -1) {
                state.storages.splice(index, 1);
                state.items.forEach(item => {
                    const index = item.storages.findIndex(x => x.storageId === storageId);
                    if (index !== -1) {
                        item.storages.splice(index, 1);
                    }
                })
            }
        },
        resetStorages: (state, action: PayloadAction<void>) => {
            state.storages = initialState.storages;
        },
        setStorages: (state, action: PayloadAction<Storage[]>) => {
            state.storages = action.payload;
        },
        setStorageName: (state, action: PayloadAction<{ storageId: string, name: string }>) => {
            const storage = state.storages.find(x => x.id === action.payload.storageId);
            if (storage) {
                storage.name = action.payload.name;
            }
        },
    }
})

export const {
    setData,

    // Categories
    addCategory,
    deleteCategory,
    resetCategories,
    setCategories,
    setCategoryName,

    // Items
    addItem,
    deleteItem,
    deleteItems,
    resetItems,
    setItemAmount,
    setItemCategory,
    setItemName,
    setItems,
    setItemShop,
    setItemStorage,
    setItemWanted,

    // Shops
    addShop,
    addShopCategory,
    deleteShop,
    resetShops,
    setShopCategories,
    setShopCategoryShow,
    setShopName,
    setShops,

    // Storages
    addStorage,
    deleteStorage,
    resetStorages,
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

export function selectShop(id: string): (state: RootState) => Shop {
    return (state: RootState) => {
        const item = state.data.shops.find(x => x.id === id);
        return item ?? allShop;
    };
}

// Storages

export const allStorage: Storage = {
    id: "_",
    name: "Alle",
}

export function selectStorage(id: string): (state: RootState) => Storage {
    return (state: RootState) => {
        const item = state.data.storages.find(x => x.id === id);
        return item ?? allStorage;
    };
}
