import { Category } from "./categories";
import { MD3Theme } from "react-native-paper";
import { ViewStyle } from "react-native";
import { numberToString } from "../../numberToString";

// Unit

export type UnitId = "-" | "pkg" | "g" | "kg" | "ml" | "l";

export interface Unit {
    id: UnitId;
    name: string;
    group?: string;
    factorToBase: number;
    base: UnitId;
    factorToNormalizedPriceBase: number;
    normalizedPriceBase: UnitId;
}

export const units: Unit[] = [
    {
        id: "-",
        name: "-",
        factorToBase: 1,
        base: "-",
        factorToNormalizedPriceBase: 1,
        normalizedPriceBase: "-",
    },
    {
        id: "pkg",
        name: "Pck",
        factorToBase: 1,
        base: "-",
        factorToNormalizedPriceBase: 1,
        normalizedPriceBase: "-",
    },
    {
        id: "g",
        name: "g",
        group: "g",
        factorToBase: 1,
        base: "g",
        factorToNormalizedPriceBase: 1000,
        normalizedPriceBase: "kg",
    },
    {
        id: "kg",
        name: "kg",
        group: "g",
        factorToBase: 1000,
        base: "g",
        factorToNormalizedPriceBase: 1,
        normalizedPriceBase: "kg",
    },
    {
        id: "ml",
        name: "ml",
        group: "l",
        factorToBase: 1,
        base: "ml",
        factorToNormalizedPriceBase: 1000,
        normalizedPriceBase: "l",
    },
    {
        id: "l",
        name: "l",
        group: "l",
        factorToBase: 1000,
        base: "ml",
        factorToNormalizedPriceBase: 1,
        normalizedPriceBase: "l",
    },
];

export function getPriceOfPriceBase(itemShop: ItemShop, item: Item): number {
    if (itemShop.price) {
        const packageUnit = getUnit(item.packageUnitId);
        return (itemShop.price * packageUnit.factorToNormalizedPriceBase / (item.packageQuantity ?? 1))
    }
    return 0;
}

// Prices

export interface PriceData {
    price: number;
    quantity?: number;
    unit: Unit;
}

export interface NormalizedPriceData {
    price: number;
    unit: Unit;
}

export function formatPrice(data: PriceData): string {
    const { price, quantity, unit } = data;
    if (price === 0) {
        return "";
    }
    let s = `${numberToString(price)}€`;
    if (quantity || (unit.base !== "-")) {
        const u = (unit.id && (unit.id !== "-") && (unit.id !== "pkg")) ? getUnitName(unit.id) : "";
        s += ` / ${quantity ?? ""}${u}`;
    }
    return s;
}

export function getNormalizedPrice(itemShop: Partial<ItemShop>, item?: Partial<Item>): NormalizedPriceData {
    let p = itemShop.price ?? 0;
    const itemShopUnit = getUnit(itemShop.unitId);
    const packageUnit = getUnit(item?.packageUnitId);
    let packageQuantity: number;
    let unit: Unit;

    if (itemShopUnit.base === "-") {
        packageQuantity = (item?.packageQuantity ?? 1);
        unit = packageUnit;
    } else {
        packageQuantity = 1;
        unit = itemShopUnit;
    }

    return {
        price: p / packageQuantity * unit.factorToNormalizedPriceBase,
        unit: getUnit(unit.normalizedPriceBase),
    };
}

export function getPackagePrice(itemShop: Partial<ItemShop>, item?: Partial<Item>): PriceData {
    let p = itemShop.price ?? 0;
    const itemShopUnit = getUnit(itemShop.unitId);
    const packageUnit = getUnit(item?.packageUnitId);

    if ((itemShopUnit.base !== "-") && (packageUnit.base !== "-")) {
        p *= (item?.packageQuantity ?? 1);
        if (itemShopUnit.factorToBase < packageUnit.factorToBase) {
            p *= packageUnit.factorToBase;
        }
        if (itemShopUnit.factorToBase > packageUnit.factorToBase) {
            p /= itemShopUnit.factorToBase;
        }
    }

    return {
        price: p,
        quantity: item?.packageQuantity,
        unit: (packageUnit.base !== "-") ? packageUnit : itemShopUnit,
    };
}

export function getPackagePriceBase(itemShop: Partial<ItemShop>, item?: Partial<Item>): number {
    const priceData = getPackagePrice(itemShop, item);
    const price = priceData.price / (priceData.quantity ?? 1) / (priceData.unit?.factorToBase ?? 1);
    return price;
}

// Units

export function addQuantityUnit(quantity1: number, unitId1: UnitId | undefined, quantity2: number, unitId2: UnitId | undefined): { quantity: number, unitId: UnitId } {
    const unit1 = getUnit(unitId1);
    const unit2 = getUnit(unitId2);
    // Check for recalc
    if (unit1.factorToBase !== unit2.factorToBase) {
        return { quantity: (quantity1 * unit1.factorToBase) + (quantity2 * unit2.factorToBase), unitId: unit2.base };
    }
    // Just add
    return { quantity: quantity1 + quantity2, unitId: (unit2.group ? unit2.id : unit1.id) };
}

export function getQuantityUnitFromItem(item: Item | undefined): string {
    let s = "";
    if (item) {
        s = getQuantityUnit(item.quantity, item.unitId);
    }
    return s;
}

export function getQuantityUnit(quantity: number | undefined, unitId: UnitId | undefined): string {
    let s = "";
    if (quantity) {
        s = `${quantity} `;
    }
    if (unitId) {
        s += getUnitName(unitId);
    }
    return s;
}

export function getPackageQuantityUnit(item: Item): string {
    if (item.packageQuantity != undefined) {
        return `${item.packageQuantity}${getUnitName(item.packageUnitId)}`;
    }
    return "";
}

export function getUnit(unitId: UnitId | undefined): Unit {
    return units.find(unit => unit.id === unitId) ?? units[0];
}

export function getUnitName(unitId: UnitId | undefined, fullName?: boolean): string {
    if (!fullName && (!unitId || (unitId === "-"))) {
        return "";
    }
    return getUnit(unitId).name;
}

export function parseQuantityUnit(quantity: string | undefined): [quantity: number, unit: UnitId] {
    let q = quantity?.trim().toLowerCase() ?? "";
    let u = "";
    const pattern = new RegExp(`(\\d+)(${units.map(u => u.name.toLowerCase()).join("|")})`);
    const match = q.match(pattern);
    if (match) {
        q = match[1];
        u = match[2];
        return [parseFloat(q), units.find(x => x.name.toLowerCase() === u)?.id ?? units[0].id];
    }
    return [parseFloat(quantity ?? "0"), "-"];
}

export function replaceUnitIdIfEmpty(unitId: UnitId | undefined, replaceWithUnitId: UnitId | undefined): UnitId | undefined {
    if (unitId && (unitId !== "-")) {
        return unitId;
    }
    return replaceWithUnitId;
}

// Item
export interface Item {
    id: string;
    name: string;
    quantity?: number;
    unitId?: UnitId;
    packageQuantity?: number;
    packageUnitId?: UnitId;
    categoryId?: string;
    wanted?: boolean;
    notes?: string;
    shops: ItemShop[];
    storages: { storageId: string; }[];
}

export interface ItemShop {
    checked?: boolean;
    shopId: string;
    price?: number;
    unitId?: UnitId;
}

export function itemListStyle(theme: MD3Theme): ViewStyle {
    return {
        backgroundColor: theme.colors.elevation.level2,
        marginHorizontal: 4,
        marginBottom: 2,
    };
}

export function isItem(o: (undefined | Category | Item)): o is Item {
    const item = o as Item;
    return (item?.wanted !== undefined)
        || ((item?.shops !== undefined) && (item?.storages !== undefined));
}

export const defaultItems: Item[] = [
];
