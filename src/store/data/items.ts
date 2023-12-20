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

// Item
export interface Item {
    id: string;
    name: string;
    quantity?: string;
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
    };
}

export function isItem(o: (undefined | Category | Item)): o is Item {
    const item = o as Item;
    return (item?.wanted !== undefined)
        || ((item?.shops !== undefined) && (item?.storages !== undefined));
}

export const defaultItems: Item[] = [
];
