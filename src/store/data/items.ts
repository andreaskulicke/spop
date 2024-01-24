import { Category } from "./categories";
import { MD3Theme } from "react-native-paper";
import { ViewStyle } from "react-native";

// Unit

export type UnitId = "-" | "pkg" | "g" | "kg" | "ml" | "l";

export interface Unit {
    id: UnitId;
    name: string;
    group?: string;
    factorToBase: number;
    base: UnitId;
}

export const units: Unit[] = [
    {
        id: "-",
        name: "-",
        factorToBase: 1,
        base: "-",
    },
    {
        id: "pkg",
        name: "Pck",
        factorToBase: 1,
        base: "-",
    },
    {
        id: "g",
        name: "g",
        group: "g",
        factorToBase: 1,
        base: "g",
    },
    {
        id: "kg",
        name: "kg",
        group: "g",
        factorToBase: 1000,
        base: "g",
    },
    {
        id: "ml",
        name: "ml",
        group: "l",
        factorToBase: 1,
        base: "ml",
    },
    {
        id: "l",
        name: "l",
        group: "l",
        factorToBase: 1000,
        base: "ml",
    },
];

export function addQuantityUnit(quantity1: number, unitId1: UnitId | undefined, quantity2: number, unitId2: UnitId | undefined): { quantity: number, unitId: UnitId } {
    const unit1 = units.find(x => x.id === unitId1) ?? units[0];
    const unit2 = units.find(x => x.id === unitId2) ?? units[0];
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

export function getUnitName(unitId: UnitId | undefined, fullName?: boolean): string {
    if (!fullName && (!unitId || (unitId === "-"))) {
        return "";
    }
    return units.find(unit => unit.id === unitId)?.name ?? "-";
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
