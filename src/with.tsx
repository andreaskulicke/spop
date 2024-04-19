export function withPrefix(prefix: string, rhs: string | undefined): string {
    if (rhs) {
        return `${prefix}${rhs}`;
    }
    return "";
}

export function withSeparator(
    lhs: string | undefined,
    separator: string,
    rhs: string | undefined,
): string {
    if (lhs && rhs) {
        return `${lhs}${separator}${rhs}`;
    }
    if (lhs) {
        return lhs;
    }
    if (rhs) {
        return rhs;
    }
    return "";
}
