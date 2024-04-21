export const categoryIds = [
    "alcohol",
    "asia",
    "baking",
    "bakery",
    "canned_fruits",
    "cereals",
    "coffee_tea",
    "drinks",
    "eggs",
    "freezer",
    "fridge",
    "fruits_vegetables",
    "household",
    "meat",
    "misc",
    "noodles",
    "nuts",
    "pickled_preserves",
    "rice",
    "sauces",
    "spices",
    "stationary",
    "sweets",
] as const;

// https://static.enapter.com/rn/icons/material-community.html
export const categoryIcons = [
    "baguette",
    "barley",
    "bottle-soda-outline",
    "bread-slice-outline",
    "candy-outline",
    "carrot",
    "coffee",
    "corn",
    "cow",
    "egg-outline",
    "flower-outline",
    "food-apple-outline",
    "fridge-outline",
    "fruit-cherries",
    "fruit-grapes",
    "glass-cocktail",
    "home-outline",
    "ice-cream",
    "ice-pop",
    "kettle-outline",
    "leaf",
    "liquor",
    "muffin",
    "noodles",
    "peanut-outline",
    "pen",
    "pig-variant-outline",
    "pizza",
    "popcorn",
    "pot-outline",
    "rice",
    "shaker-outline",
    "soy-sauce",
    "tea-outline",

    "dots-horizontal",
] as const;

export interface Category {
    id: (string & {}) | (typeof categoryIds)[number];
    icon: (string & {}) | (typeof categoryIcons)[number];
    name: string;
}

export const emptyCategory: Category = {
    id: "emptyCategory",
    icon: "dots-horizontal",
    name: "Keine Kategorie",
};

export const defaultCategories: Category[] = [
    {
        id: "fruits_vegetables",
        icon: "food-apple-outline",
        name: "Obst & Gemüse",
    },
    {
        id: "nuts",
        icon: "peanut-outline",
        name: "Nüsse",
    },
    {
        id: "bakery",
        icon: "baguette",
        name: "Backwaren",
    },
    {
        id: "eggs",
        icon: "egg-outline",
        name: "Eier",
    },
    {
        id: "meat",
        icon: "pig-variant-outline",
        name: "Fleisch",
    },
    {
        id: "cereals",
        icon: "corn",
        name: "Müsli",
    },
    {
        id: "coffee_tea",
        icon: "coffee",
        name: "Kaffee & Tee",
    },
    {
        id: "alcohol",
        icon: "glass-cocktail",
        name: "Alkoholika",
    },
    {
        id: "fridge",
        icon: "fridge-outline",
        name: "Kühltheke",
    },
    {
        id: "jam_honey",
        icon: "bread-slice-outline",
        name: "Marmelade & Honig",
    },
    {
        id: "sweets",
        icon: "candy-outline",
        name: "Süßigkeiten",
    },
    {
        id: "baking",
        icon: "muffin",
        name: "Backen",
    },
    {
        id: "noodles",
        icon: "noodles",
        name: "Nudeln",
    },
    {
        id: "asia",
        icon: "noodles",
        name: "Asia",
    },
    {
        id: "rice",
        icon: "rice",
        name: "Reis & Bohnen",
    },
    {
        id: "sauces",
        icon: "soy-sauce",
        name: "Saucen",
    },
    {
        id: "oil_vinegar",
        icon: "bottle-soda-outline",
        name: "Öl & Essig",
    },
    {
        id: "spices",
        icon: "shaker-outline",
        name: "Gewürze",
    },
    {
        id: "pickled_preserves",
        icon: "pot-outline",
        name: "Konserven Sauer",
    },
    {
        id: "canned_fruits",
        icon: "pot-outline",
        name: "Konserven Obst & Gemüse",
    },
    {
        id: "household",
        icon: "home-outline",
        name: "Haushalt",
    },
    {
        id: "stationary",
        icon: "pen",
        name: "Schreibwaren",
    },
    {
        id: "freezer",
        icon: "ice-cream",
        name: "Tiefkühltheke",
    },
    {
        id: "drinks",
        icon: "liquor",
        name: "Getränke",
    },
    {
        id: "misc",
        icon: "dots-horizontal",
        name: "Sonstiges",
    },
];
