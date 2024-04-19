import {
    UnitId,
    formatPrice,
    getNormalizedPrice,
    getNormalizedPriceBase,
    getPackagePrice,
    getPackagePriceBase,
    getUnit,
    units,
} from "./items";

describe("formatPrice()", () => {
    test("no price", () => {
        const s = formatPrice({ price: 0, unit: units[0] });
        expect(s).toBe("");
    });
    test("price", () => {
        const s = formatPrice({ price: 5, unit: units[0] });
        expect(s).toBe("5€");
    });
    test("price with quantity", () => {
        const s = formatPrice({ price: 5, quantity: 50, unit: units[0] });
        expect(s).toBe("5€ / 50");
    });
    test("price with unit", () => {
        const s = formatPrice({ price: 5, unit: getUnit("kg") });
        expect(s).toBe("5€ / kg");
    });
    test.each(["-", "pkg"])("price with quantity and unit %s", (unitId) => {
        const s = formatPrice({
            price: 5,
            quantity: 50,
            unit: getUnit(unitId as UnitId),
        });
        expect(s).toBe("5€ / 50");
    });
    test("price with quantity and unit g", () => {
        const s = formatPrice({ price: 5, quantity: 50, unit: getUnit("g") });
        expect(s).toBe("5€ / 50g");
    });
});

describe("getNormalizedPrice()", () => {
    test("no price - returns empty", () => {
        const { price, unit } = getNormalizedPrice({});
        expect(price).toBe(0);
        expect(unit.id).toBe("-");
    });

    test("price without unit, no package quantity", () => {
        const { price, unit } = getNormalizedPrice({ price: 5 });
        expect(price).toBe(5);
        expect(unit.id).toBe("-");
    });
    test("price without unit, with package quantity", () => {
        const { price, unit } = getNormalizedPrice(
            { price: 5 },
            { packageQuantity: 50 },
        );
        expect(price).toBe(5 / 50);
        expect(unit.id).toBe("-");
    });
    test("price without unit, with shop package quantity", () => {
        const { price, unit } = getNormalizedPrice(
            { price: 5, packageQuantity: 50 },
            { packageQuantity: 500 },
        );
        expect(price).toBe(5 / 50);
        expect(unit.id).toBe("-");
    });
    test("price without unit, with package quantity and g", () => {
        const { price, unit } = getNormalizedPrice(
            { price: 5 },
            { packageQuantity: 50, packageUnitId: "g" },
        );
        expect(price).toBe((5 / 50) * 1000);
        expect(unit.id).toBe("kg");
    });
    test("price without unit, with shop package quantity and g", () => {
        const { price, unit } = getNormalizedPrice(
            { price: 5, packageQuantity: 50, packageUnitId: "g" },
            { packageQuantity: 500, packageUnitId: "kg" },
        );
        expect(price).toBe((5 / 50) * 1000);
        expect(unit.id).toBe("kg");
    });
    test("price without unit, with package quantity and kg", () => {
        const { price, unit } = getNormalizedPrice(
            { price: 5 },
            { packageQuantity: 50, packageUnitId: "kg" },
        );
        expect(price).toBe(5 / 50);
        expect(unit.id).toBe("kg");
    });
    test("price without unit, with shop package quantity and kg", () => {
        const { price, unit } = getNormalizedPrice(
            { price: 5, packageQuantity: 50, packageUnitId: "kg" },
            { packageQuantity: 500, packageUnitId: "g" },
        );
        expect(price).toBe(5 / 50);
        expect(unit.id).toBe("kg");
    });

    test("price with g, no package quantity", () => {
        const { price, unit } = getNormalizedPrice({ price: 5, unitId: "g" });
        expect(price).toBe(5 * 1000);
        expect(unit.id).toBe("kg");
    });
    test("price with g, with package quantity", () => {
        const { price, unit } = getNormalizedPrice(
            { price: 5, unitId: "g" },
            { packageQuantity: 50 },
        );
        expect(price).toBe(5 * 1000);
        expect(unit.id).toBe("kg");
    });
    test("price with g, with shop package quantity", () => {
        const { price, unit } = getNormalizedPrice(
            { price: 5, unitId: "g", packageQuantity: 50 },
            { packageQuantity: 500 },
        );
        expect(price).toBe(5 * 1000);
        expect(unit.id).toBe("kg");
    });

    test("price with kg, no package quantity", () => {
        const { price, unit } = getNormalizedPrice({ price: 5, unitId: "kg" });
        expect(price).toBe(5);
        expect(unit.id).toBe("kg");
    });
});

describe("getNormalizedPriceBase()", () => {
    test("price", () => {
        const price = getNormalizedPriceBase({ price: 5 });
        expect(price).toBe(5);
    });
    test("price with package quantity", () => {
        const price = getNormalizedPriceBase(
            { price: 5 },
            { packageQuantity: 50 },
        );
        expect(price).toBe(5 / 50);
    });
    test("price with shop package quantity", () => {
        const price = getNormalizedPriceBase(
            { price: 5, packageQuantity: 50 },
            { packageQuantity: 500 },
        );
        expect(price).toBe(5 / 50);
    });
    test("price with package quantity and g", () => {
        const price = getNormalizedPriceBase(
            { price: 5 },
            { packageQuantity: 50, packageUnitId: "g" },
        );
        expect(price).toBe((5 / 50) * 1000);
    });
    test("price with shop package quantity and g", () => {
        const price = getNormalizedPriceBase(
            { price: 5, packageQuantity: 50, packageUnitId: "g" },
            { packageQuantity: 500, packageUnitId: "kg" },
        );
        expect(price).toBe((5 / 50) * 1000);
    });
    test("price with package quantity and kg", () => {
        const price = getNormalizedPriceBase(
            { price: 5 },
            { packageQuantity: 50, packageUnitId: "kg" },
        );
        expect(price).toBe(5 / 50);
    });
    test("price with shop package quantity and kg", () => {
        const price = getNormalizedPriceBase(
            { price: 5, packageQuantity: 50, packageUnitId: "kg" },
            { packageQuantity: 500, packageUnitId: "g" },
        );
        expect(price).toBe(5 / 50);
    });
});

describe("getPackagePrice()", () => {
    test("no price - returns empty", () => {
        const { price, quantity, unit } = getPackagePrice({});
        expect(price).toBe(0);
        expect(quantity).toBe(undefined);
        expect(unit.id).toBe("-");
    });

    test.each([undefined, "-", "pck"])(
        "price without unit (%s), no package quantity",
        (u: string | undefined) => {
            const { price, quantity, unit } = getPackagePrice({
                price: 5,
                unitId: u as UnitId,
            });
            expect(price).toBe(5);
            expect(quantity).toBe(undefined);
            expect(unit.id).toBe("-");
        },
    );
    test.each([undefined, "-", "pck"])(
        "price without unit (%s), with package quantity",
        (u: string | undefined) => {
            const { price, quantity, unit } = getPackagePrice(
                { price: 5, unitId: u as UnitId },
                { packageQuantity: 50 },
            );
            expect(price).toBe(5);
            expect(quantity).toBe(50);
            expect(unit.id).toBe("-");
        },
    );
    test.each([undefined, "-", "pck"])(
        "price without unit (%s), with shop package quantity",
        (u: string | undefined) => {
            const { price, quantity, unit } = getPackagePrice(
                { price: 5, unitId: u as UnitId, packageQuantity: 50 },
                { packageQuantity: 500 },
            );
            expect(price).toBe(5);
            expect(quantity).toBe(50);
            expect(unit.id).toBe("-");
        },
    );
    test.each([undefined, "-", "pck"])(
        "price without unit (%s), with package quantity and g",
        (u: string | undefined) => {
            const { price, quantity, unit } = getPackagePrice(
                { price: 5, unitId: u as UnitId },
                { packageQuantity: 50, packageUnitId: "g" },
            );
            expect(price).toBe(5);
            expect(quantity).toBe(50);
            expect(unit.id).toBe("g");
        },
    );
    test.each([undefined, "-", "pck"])(
        "price without unit (%s), with shop package quantity and g",
        (u: string | undefined) => {
            const { price, quantity, unit } = getPackagePrice(
                {
                    price: 5,
                    unitId: u as UnitId,
                    packageQuantity: 50,
                    packageUnitId: "g",
                },
                { packageQuantity: 500, packageUnitId: "kg" },
            );
            expect(price).toBe(5);
            expect(quantity).toBe(50);
            expect(unit.id).toBe("g");
        },
    );
    test.each([undefined, "-", "pck"])(
        "price without unit (%s), with package quantity and kg",
        (u: string | undefined) => {
            const { price, quantity, unit } = getPackagePrice(
                { price: 5, unitId: u as UnitId },
                { packageQuantity: 50, packageUnitId: "kg" },
            );
            expect(price).toBe(5);
            expect(quantity).toBe(50);
            expect(unit.id).toBe("kg");
        },
    );
    test.each([undefined, "-", "pck"])(
        "price without unit (%s), with shop package quantity and kg",
        (u: string | undefined) => {
            const { price, quantity, unit } = getPackagePrice(
                {
                    price: 5,
                    unitId: u as UnitId,
                    packageQuantity: 50,
                    packageUnitId: "kg",
                },
                { packageQuantity: 500, packageUnitId: "g" },
            );
            expect(price).toBe(5);
            expect(quantity).toBe(50);
            expect(unit.id).toBe("kg");
        },
    );

    test("price with g, no package quantity", () => {
        const { price, quantity, unit } = getPackagePrice({
            price: 5,
            unitId: "g",
        });
        expect(price).toBe(5);
        expect(quantity).toBe(undefined);
        expect(unit.id).toBe("g");
    });
    test("price with g, with package quantity", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "g" },
            { packageQuantity: 50 },
        );
        expect(price).toBe(5);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("g");
    });
    test("price with g, with shop package quantity", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "g", packageQuantity: 50 },
            { packageQuantity: 500 },
        );
        expect(price).toBe(5);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("g");
    });
    test("price with g, with package quantity and g", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "g" },
            { packageQuantity: 50, packageUnitId: "g" },
        );
        expect(price).toBe(5 * 50);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("g");
    });
    test("price with g, with shop package quantity and g", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "g", packageQuantity: 50, packageUnitId: "g" },
            { packageQuantity: 500, packageUnitId: "kg" },
        );
        expect(price).toBe(5 * 50);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("g");
    });
    test("price with g, with package quantity and kg", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "g" },
            { packageQuantity: 50, packageUnitId: "kg" },
        );
        expect(price).toBe(5 * 50 * 1000);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("kg");
    });
    test("price with g, with shop package quantity and kg", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "g", packageQuantity: 50, packageUnitId: "kg" },
            { packageQuantity: 500, packageUnitId: "g" },
        );
        expect(price).toBe(5 * 50 * 1000);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("kg");
    });

    test("price with kg, no package quantity", () => {
        const { price, quantity, unit } = getPackagePrice({
            price: 5,
            unitId: "kg",
        });
        expect(price).toBe(5);
        expect(quantity).toBe(undefined);
        expect(unit.id).toBe("kg");
    });
    test("price with kg, with package quantity", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "kg" },
            { packageQuantity: 50 },
        );
        expect(price).toBe(5);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("kg");
    });
    test("price with kg, with shop package quantity", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "kg", packageQuantity: 50 },
            { packageQuantity: 500 },
        );
        expect(price).toBe(5);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("kg");
    });
    test("price with kg, with package quantity and g", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "kg" },
            { packageQuantity: 50, packageUnitId: "g" },
        );
        expect(price).toBe((5 * 50) / 1000);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("g");
    });
    test("price with kg, with shop package quantity and g", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "kg", packageQuantity: 50, packageUnitId: "g" },
            { packageQuantity: 500, packageUnitId: "kg" },
        );
        expect(price).toBe((5 * 50) / 1000);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("g");
    });
    test("price with kg, with package quantity and kg", () => {
        const { price, quantity, unit } = getPackagePrice(
            { price: 5, unitId: "kg" },
            { packageQuantity: 50, packageUnitId: "kg" },
        );
        expect(price).toBe(5 * 50);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("kg");
    });
    test("price with kg, with shop package quantity and kg", () => {
        const { price, quantity, unit } = getPackagePrice(
            {
                price: 5,
                unitId: "kg",
                packageQuantity: 50,
                packageUnitId: "kg",
            },
            { packageQuantity: 500, packageUnitId: "g" },
        );
        expect(price).toBe(5 * 50);
        expect(quantity).toBe(50);
        expect(unit.id).toBe("kg");
    });
});

describe("getPackagePriceBase()", () => {
    test("price", () => {
        const price = getPackagePriceBase({ price: 5 });
        expect(price).toBe(5);
    });
    test("price with package quantity", () => {
        const price = getPackagePriceBase(
            { price: 5 },
            { packageQuantity: 50 },
        );
        expect(price).toBe(5 / 50);
    });
    test("price with shop package quantity", () => {
        const price = getPackagePriceBase(
            { price: 5, packageQuantity: 50 },
            { packageQuantity: 500 },
        );
        expect(price).toBe(5 / 50);
    });
    test("price with package quantity and g", () => {
        const price = getPackagePriceBase(
            { price: 5 },
            { packageQuantity: 50, packageUnitId: "g" },
        );
        expect(price).toBe(5 / 50);
    });
    test("price with shop package quantity and g", () => {
        const price = getPackagePriceBase(
            { price: 5, packageQuantity: 50, packageUnitId: "g" },
            { packageQuantity: 500, packageUnitId: "kg" },
        );
        expect(price).toBe(5 / 50);
    });
    test("price with package quantity and kg", () => {
        const price = getPackagePriceBase(
            { price: 5 },
            { packageQuantity: 50, packageUnitId: "kg" },
        );
        expect(price).toBe(5 / 50 / 1000);
    });
    test("price with shop package quantity and kg", () => {
        const price = getPackagePriceBase(
            { price: 5, packageQuantity: 50, packageUnitId: "kg" },
            { packageQuantity: 500, packageUnitId: "g" },
        );
        expect(price).toBe(5 / 50 / 1000);
    });
});
