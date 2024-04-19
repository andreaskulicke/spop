export interface Storage {
    id: string;
    name: string;
    defaultCategoryId?: string;
}

export const defaultStorages: Storage[] = [
    {
        id: "pantry",
        name: "Speisekammer",
    },
    {
        id: "fridge",
        name: "Kühlschrank",
        defaultCategoryId: "fridge",
    },
    {
        id: "bath",
        name: "Bad",
        defaultCategoryId: "household",
    },
    {
        id: "storageroom",
        name: "Vorratsraum",
    },
    {
        id: "freezer",
        name: "Tiefkühlschrank",
        defaultCategoryId: "freezer",
    },
    {
        id: "laundry",
        name: "Waschküche",
        defaultCategoryId: "household",
    },
];
