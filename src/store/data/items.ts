import { ViewStyle } from "react-native";
import { MD3Theme } from "react-native-paper";
import { Category } from "./categories";

export interface Item {
    id: string;
    name: string;
    amount?: string;
    categoryId?: string;
    wanted?: boolean;
    shops: { shopId: string; }[];
    storages: { storageId: string; }[];
}

export function itemListStyle(theme: MD3Theme): ViewStyle {
    return {
        backgroundColor: theme.colors.elevation.level2,
        marginHorizontal: 4,
        marginVertical: 2,
    };
}

export function isItem(o: (undefined | Category |Item)): o is Item {
    const item = o as Item;
    return (item?.wanted !== undefined)
        || ((item?.shops !== undefined) && (item?.storages !== undefined));
}

export const defaultItems: Item[] = [
    {
        id: "Gurken",
        name: "Gurken",
        amount: "2",
        shops: [],
        storages: [
            {
                "storageId": "fridge"
            }
        ]
    },
    {
        id: "Tomaten",
        name: "Tomaten",
        shops: [],
        storages: []
    }
];
