import { UnitId, units } from "./store/data/items";

export function numberToString(value: number | undefined): string {
    if (Number.isNaN(value)) {
        return "";
    }
    return value?.toString().replace(".", ",") ?? "";
}

export function quantityToString(value: number | undefined): string {
    return (value !== 0) ? numberToString(value) : "";
}

export function parseQuantityUnit(quantity: string | undefined): [quantity: number, unit: UnitId] {
    let q = quantity?.trim().toLowerCase() ?? "";
    let u = "";
    const pattern = new RegExp(`(\\d+)(${units.map(u => u.name.toLowerCase()).join("|")})`);
    const match = q.match(pattern);
    if (match) {
        q = match[1];
        u = match[2];
        return [parseFloat(q), units.find(x => x.name.toLowerCase() === u)?.id ?? units[0].id];
    }
    return [parseFloat(quantity ?? "0"), "-"];
}
