export interface Shop {
    id: string;
    name: string;
    defaultCategoryId?: string;
    /** Category IDs that are present here are shown in the order of this array */
    categoryIds?: string[];
}

export const defaultShops: Shop[] = [
    {
        id: "fruitmarket",
        name: "Lohhofer Obstmarkt",
        defaultCategoryId: "fruits_vegetables"
    },
    {
        id: "polster",
        name: "Polster",
        defaultCategoryId: "bakery"
    },
    {
        id: "aldi",
        name: "Aldi"
    },
    {
        id: "rewe",
        name: "Rewe"
    },
    {
        id: "edeka",
        name: "Edeka"
    },
    {
        id: "rossmann",
        name: "Rossmann",
        defaultCategoryId: "household"
    }
];
