import { categoryIds } from "./categories";

export interface Shop {
    id: string;
    name: string;
    defaultCategoryId?: (string & {}) | typeof categoryIds[number];
    /** Category IDs that are present here are shown in the order of this array */
    categoryIds?: ((string & {}) | typeof categoryIds[number])[];
}

export const defaultShops: Shop[] = [
    {
        id: "fruitmarket",
        name: "Lohhofer Obstmarkt",
        defaultCategoryId: "fruits_vegetables",
        categoryIds: ["fruits_vegetables"],
    },
    {
        id: "polster",
        name: "Polster",
        defaultCategoryId: "bakery",
        categoryIds: ["bakery"],
    },
    {
        id: "aldi",
        name: "Aldi",
        categoryIds: ["fruits_vegetables", "eggs", "sweets", "fridge", "cereals", "drinks", "household", "misc"]
    },
    {
        id: "rewe",
        name: "Rewe",
    },
    {
        id: "edeka",
        name: "Edeka",
        categoryIds: ["misc", "fruits_vegetables", "nuts", "bakery", "backing", "cereals", "coffee_tea", "noodles", "sauces", "tins", "fridge", "spices", "freezer", "meat", "eggs", "sweets", "drinks", "household"]
    },
    {
        id: "rossmann",
        name: "Rossmann",
        defaultCategoryId: "household",
        categoryIds: ["household", "nuts", "sweets"]
    }
];
