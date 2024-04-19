export function numberToString(value: number | undefined): string {
    if (Number.isNaN(value)) {
        return "";
    }
    return value?.toString().replace(".", ",") ?? "";
}

export function stringToNumber(value: string | undefined): number | undefined {
    if (value) {
        const n = parseFloat(value.replace(",", "."));
        if (!Number.isNaN(n)) {
            return n;
        }
    }
    return undefined;
}

export function quantityToString(value: number | undefined): string {
    return value !== 0 ? numberToString(value) : "";
}
