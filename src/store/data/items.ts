export interface Item {
    id: string;
    name: string;
    amount?: string;
    categoryId?: string;
    wanted?: boolean;
    shops: { shopId: string; }[];
    storages: { storageId: string; }[];
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
