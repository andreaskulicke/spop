import { Category } from "./categories";
import { Item } from "./items";
import { Shop } from "./shops";
import { Storage } from "./storages";

export interface Data {
    id: string;
    name: string;
    description?: string;
    version: string;
    categories: Category[];
    items: Item[];
    shops: Shop[];
    storages: Storage[];
}
