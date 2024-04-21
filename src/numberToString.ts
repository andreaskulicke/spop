export function numberToString(
    value: number | undefined,
    precision: number = 2,
): string {
    if (Number.isNaN(value) || value === undefined || value === null) {
        return "";
    }
    let valueTmp = Number.isInteger(value)
        ? value.toString()
        : value.toFixed(precision);
    return valueTmp.replace(".", ",");
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
