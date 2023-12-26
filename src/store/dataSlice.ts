import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Category, defaultCategories } from './data/categories';
import { defaultItems, Item, ItemShop, UnitId, units } from './data/items';
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
            state.shops.forEach(shop => {
                initializeShopCategoryIds(state, shop);
                shop.categoryIds?.push(categoryId);
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
                state.storages
                    .filter(storage => storage.defaultCategoryId === categoryId)
                    .forEach(storage => storage.defaultCategoryId = undefined);
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
                if (action.payload.item.quantity) {
                    item.quantity = action.payload.item.quantity;
                }
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
            if (action.payload.shop && (action.payload.shop.id !== allShop.id)) {
                let s = item.shops.find(x => x.shopId === action.payload.shop?.id);
                if (!s) {
                    s = { shopId: action.payload.shop.id };
                    item.shops.push(s);
                }
                s.checked = true;
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

        setItemQuantity: (state, action: PayloadAction<{ itemId: string, quantity: string }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        setItemCategory: (state, action: PayloadAction<{ itemId: string, categoryId: string | undefined }>) => {
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
        setItemPackageQuantity: (state, action: PayloadAction<{ itemId: string, packageQuantity: number | undefined }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                item.packageQuantity = action.payload.packageQuantity;
            }
        },
        setItemPackageUnit: (state, action: PayloadAction<{ itemId: string, packageUnitId: UnitId }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                item.packageUnitId = action.payload.packageUnitId;
                const unit = units.find(u => u.id === action.payload.packageUnitId);
                if (unit?.group) {
                    const unit2 = units.find(u => u.id === item.unitId);
                    if (unit.group !== unit2?.group) {
                        item.unitId = item.packageUnitId;
                    }
                }
            }
        },
        setItemShop: (state, action: PayloadAction<{ itemId: string, shopId: string, checked: boolean }>) => {
            if (action.payload.shopId !== allShop.id) {
                const item = state.items.find(x => x.id === action.payload.itemId);
                if (item) {
                    let shop = item.shops.find(x => x.shopId === action.payload.shopId);
                    if (!shop) {
                        shop = { shopId: action.payload.shopId };
                        item.shops.push(shop);
                    }
                    shop.checked = action.payload.checked;
                }
            }
        },
        setItemShopPrice: (state, action: PayloadAction<{ itemId: string, shopId: string, price?: number, unitId?: UnitId }>) => {
            if (action.payload.shopId !== allShop.id) {
                const item = state.items.find(x => x.id === action.payload.itemId);
                if (item) {
                    let shop = item.shops.find(x => x.shopId === action.payload.shopId);
                    if (!shop) {
                        shop = { shopId: action.payload.shopId };
                        item.shops.push(shop);
                    }
                    shop.price = action.payload.price;
                    shop.unitId = action.payload.unitId;
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
        setItemUnit: (state, action: PayloadAction<{ itemId: string, unitId: UnitId }>) => {
            const item = state.items.find(x => x.id === action.payload.itemId);
            if (item) {
                item.unitId = action.payload.unitId;
                const unit = units.find(u => u.id === action.payload.unitId);
                if (unit?.group) {
                    const unit2 = units.find(u => u.id === item.packageUnitId);
                    if (unit.group !== unit2?.group) {
                        item.packageUnitId = item.unitId;
                    }
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
        addShopStopper: (state, action: PayloadAction<string>) => {
            const shopStopper: Shop = {
                id: action.payload,
                name: "_",
                stopper: true,
            };
            if (state.shops.length === 0) {
                state.shops.push(shopStopper);
            } else {
                state.shops = [
                    ...state.shops.splice(0, state.shops.length - 1),
                    shopStopper,
                    state.shops[state.shops.length - 1],
                ]
            }
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
            let index = action.payload.length - 1
            for (; index >= 0; index--) {
                if (!action.payload[index].stopper) {
                    break;
                }
            }
            state.shops = action.payload.slice(0, index + 1);
        },
        setShopDefaultCategory: (state, action: PayloadAction<{ shopId: string, categoryId: string }>) => {
            const shop = state.shops.find(x => x.id === action.payload.shopId);
            if (shop) {
                shop.defaultCategoryId = action.payload.categoryId;
                if (!shop.categoryIds?.find(x => x === action.payload.categoryId)) {
                    shop.categoryIds?.push(action.payload.categoryId);
                }
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
    setItemQuantity,
    setItemCategory,
    setItemName,
    setItemPackageQuantity,
    setItemPackageUnit,
    setItems,
    setItemShop,
    setItemShopPrice,
    setItemStorage,
    setItemUnit,
    setItemWanted,

    // Shops
    addShop,
    addShopStopper,
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

export function selectCategories(state: RootState): Category[] {
    return state.data.categories;
}

export const selectSortedCategories = createSelector(
    [selectCategories],
    categories => [...categories].sort((x, y) => x.name.localeCompare(y.name)));

export function selectCategory(id: string | undefined): (state: RootState) => Category | undefined {
    return (state: RootState) => {
        const item = state.data.categories.find(x => x.id === id);
        return item;
    };
}

// Items

export function selectItemsWantedWithShop(shop: Shop) {
    return createSelector(
        [selectItems, selectCategories, selectShops],
        (items, categories, shops) => {
            const c = new Map(categories.map(x => [x.id, x]));
            const cats = [undefined as (Category | undefined)]
                .concat(shop.categoryIds?.filter(x => !!x).map(x => c.get(x)) ?? categories);

            // Add all previous shops from last stopper
            const s = new Set();
            for (const shopTmp of shops) {
                if (shopTmp.id === shop.id) {
                    s.add(shopTmp.id);
                    break;
                }
                if (shopTmp.stopper) {
                    s.clear();
                } else {
                    s.add(shopTmp.id);
                }
            }

            const itemsForThisShop = items.filter(i => i.wanted && (shop.id === allShop.id || i.shops.find(x => x.checked && s.has(x.shopId))))
                .filter(x => (x.categoryId === undefined) || cats.find(c => c?.id === x.categoryId));
            const itemsForThisShop2 = groupByCategoryId(cats, itemsForThisShop);
            const itemsForThisShop3 = Object.keys(itemsForThisShop2).flatMap(x => [cats.find(c => c?.id === x), ...itemsForThisShop2[x]]);
            return itemsForThisShop3;

            function groupByCategoryId(categories: (Category | undefined)[], array: Item[]) {
                const sortedArray = array.sort((a, b) => categories.findIndex(x => x?.id === a.categoryId) - categories.findIndex(x => x?.id === b.categoryId));
                return sortedArray.reduce((v, x) => {
                    (v[x.categoryId!] = v[x.categoryId!] || []).push(x);
                    return v;
                }, {} as { [key: string]: Item[] });
            }
        });
}

export function selectItemsWantedWithoutShop() {
    return createSelector(
        [selectItems],
        items => items.filter(x => x.wanted && (x.shops.filter(x => x.checked).length === 0)));
}

export function selectItemsNotWantedWithShop(shopId: string) {
    return createSelector(
        [selectItems],
        items => items.filter(x => !x.wanted && ((shopId === allShop.id) || x.shops.find(x => x.checked && (x.shopId === shopId)))));
}

export function selectItemsWithCategory(categoryId: string | undefined) {
    return createSelector(
        [selectItems],
        items => items.filter(x => x.categoryId === categoryId));
}

export function selectItemsWithDifferentCategory(categoryId: string | undefined) {
    return createSelector(
        [selectItems],
        items => items.filter(x => x.categoryId && (x.categoryId !== categoryId)));
}

export function selectItems(state: RootState): Item[] {
    return state.data.items;
}

export function selectItem(id: string): (state: RootState) => Item | undefined {
    return (state: RootState) => {
        const item = state.data.items.find(x => x.id === id);
        return item;
    };
}

export function selecItemShopsWithMinPrice(itemId: string): (state: RootState) => ItemShop[] {
    return createSelector(
        [selectItem(itemId)],
        item => {
            if (!item) {
                return [];
            }
            const prices = item.shops.filter(x => (x.price !== undefined) && (x.price !== null)).map(x => x.price!);
            const minPrice = Math.min(...prices);
            return item.shops.filter(x => x.price === minPrice);
        });
}

// Shops

export const allShop: Shop = {
    id: "_",
    name: "Alle",
}

export function selectShops(state: RootState): Shop[] {
    return state.data.shops;
}

export const selectValidShops = createSelector(
    [selectShops],
    shops => shops.filter(x => !x.stopper)
);

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
