export interface Item {
    id: string;
    name: string;
    amount?: string;
    categoryId?: string;
    wanted?: boolean;
    shops: { shopId: string; }[];
    storages: { storageId: string; }[];
}


export function isItem(o: unknown): o is Item {
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
