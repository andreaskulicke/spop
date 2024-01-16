import { ViewStyle } from "react-native";
import { MD3Theme } from "react-native-paper";
import { Category } from "./categories";

// Unit

export type UnitId = "-" | "pkg" | "g" | "kg" | "ml" | "l";

export interface Unit {
    id: UnitId;
    name: string;
    group?: string;
}

export const units: Unit[] = [
    {
        id: "-",
        name: "-",
    },
    {
        id: "pkg",
        name: "Pck",
    },
    {
        id: "g",
        name: "g",
        group: "g",
    },
    {
        id: "kg",
        name: "kg",
        group: "g",
    },
    {
        id: "ml",
        name: "ml",
        group: "l",
    },
    {
        id: "l",
        name: "l",
        group: "l",
    },
];

export function getQuantityUnit(item: Item | undefined): string {
    let s = "";
    if (item) {
        if (item.quantity) {
            s = `${item.quantity} `;
        }
        if (item.unitId) {
            s += getUnitName(item.unitId);
        }
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
