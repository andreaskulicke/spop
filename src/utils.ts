export function clamp(n: number, min: number, max: number): number {
    if (n < min) {
        return min;
    }
    if (n > max) {
        return max;
    }
    return n;
}

export function swap<T>(a: T[], i1: number, i2: number): T[] {
    const aa = [...a];
    aa[i1] = a[i2];
    aa[i2] = a[i1];
    return aa;
}
