export const categoryIds = [
    "fruits_vegetables",
    "nuts",
    "bakery",
    "eggs",
    "meat",
    "cereals",
    "coffee_tea",
    "fridge",
    "sweets",
    "backing",
    "noodles",
    "sauces",
    "spices",
    "tins",
    "household",
    "freezer",
    "drinks",
    "misc",
] as const;

export const categoryIcons = [
    "baguette",
    "barley",
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
    id: (string & {}) | typeof categoryIds[number];
    icon: (string & {}) | typeof categoryIcons[number];
    name: string;
}

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
        id: "fridge",
        icon: "fridge-outline",
        name: "Kühltheke",
    },
    {
        id: "sweets",
        icon: "candy-outline",
        name: "Süßigkeiten",
    },
    {
        id: "backing",
        icon: "muffin",
        name: "Backen",
    },
    {
        id: "noodles",
        icon: "noodles",
        name: "Nudeln",
    },
    {
        id: "sauces",
        icon: "soy-sauce",
        name: "Saucen",
    },
    {
        id: "spices",
        icon: "shaker-outline",
        name: "Gewürze",
    },
    {
        id: "tins",
        icon: "pot-outline",
        name: "Konserven",
    },
    {
        id: "household",
        icon: "home-outline",
        name: "Haushalt",
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
    }
];
