import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Category, defaultCategories } from './data/categories';
import { defaultItems, Item } from './data/items';
import { defaultShops, Shop } from './data/shops';
import { defaultStorages, Storage } from './data/storages';


export interface Data {
    categories: Category[];
    items: Item[];
    shops: Shop[];
    storages: Storage[];
}

// Define the initial state using that type
const initialState: Data = {
    categories: defaultCategories,
    items: defaultItems,
    shops: defaultShops,
    storages: defaultStorages,
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
                icon: "dots-horizontal",
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
                state.storages.filter(storage => storage.defaultCategoryId === categoryId).forEach(storage => storage.defaultCategoryId = undefined);
            }
        },
        resetCategories: (state) => {
            state.categories = initialState.categories;
        },
        setCategories: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
        },
        setCategoryIcon: (state, action: PayloadAction<{ categoryId: string, icon: string }>) => {
            const category = state.categories.find(x => x.id === action.payload.categoryId);
            if (category) {
                category.icon = action.payload.icon;
            }
        },
        setCategoryName: (state, action: PayloadAction<{ categoryId: string, name: string }>) => {
            const category = state.categories.find(x => x.id === action.payload.categoryId);
            if (category) {
                category.name = action.payload.name;
            }
        },

        // Items
        addItem: (state, action: PayloadAction<{ item: Item, shop?: Shop, storage?: Storage }>) => {
            let item = state.items.find(x => x.id === action.payload.item.id);
            if (item) {
                item.amount = action.payload.item.amount;
                item.categoryId = item.categoryId ?? action.payload.storage?.defaultCategoryId;
                item.wanted = true;
            } else {
                item = {
                    ...action.payload.item,
                    categoryId: action.payload.item.categoryId ?? action.payload.shop?.defaultCategoryId ?? action.payload.storage?.defaultCategoryId,
                    wanted: true,
                };
                state.items.unshift(item);
            }
            if (action.payload.shop && (action.payload.shop.id !== allShop.id)
                && !item.shops.find(x => x.shopId === action.payload.shop?.id)) {
                item.shops.push({ shopId: action.payload.shop.id });
            }
            if (action.payload.storage && (action.payload.storage.id !== allStorage.id)
                && !item.storages.find(x => x.storageId === action.payload.storage?.id)) {
                item.storages.push({ storageId: action.payload.storage.id });
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
            if (action.payload.shopId !== allShop.id) {
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
        setShopDefaultCategory: (state, action: PayloadAction<{ shopId: string, categoryId: string }>) => {
            const shop = state.shops.find(x => x.id === action.payload.shopId);
            if (shop) {
                shop.defaultCategoryId = action.payload.categoryId;
            }
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
        setStorageDefaultCategory: (state, action: PayloadAction<{ storageId: string, categoryId: string }>) => {
            const storage = state.storages.find(x => x.id === action.payload.storageId);
            if (storage) {
                storage.defaultCategoryId = action.payload.categoryId;
            }
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
    setCategoryIcon,
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
    setShopDefaultCategory,
    setShopName,
    setShops,

    // Storages
    addStorage,
    deleteStorage,
    resetStorages,
    setStorageDefaultCategory,
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
