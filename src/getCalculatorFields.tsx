import { CalculatorField } from "./Calculator";
import { getPackageUnit, Item } from "./store/data/items";
import { Shop } from "./store/data/shops";
import { allShop } from "./store/dataSlice";

export function getCalculatorFields(
    item: Item | undefined,
    shop?: Shop,
): CalculatorField[] {
    const currentItemShop = item?.shops.find((x) => x.shopId === shop?.id);
    const hasPriceField = shop && shop.id !== allShop.id;
    const data: CalculatorField[] = [
        {
            title: "Menge",
            value: item?.quantity,
            unitId: item?.unitId,
            state: item,
            selected: !shop,
            type: "quantity",
        },
    ];
    data.push({
        title: "Paket Menge",
        value: currentItemShop?.packageQuantity ?? item?.packageQuantity,
        unitId: getPackageUnit(
            currentItemShop?.packageUnitId,
            item?.packageUnitId,
        ).id,
        state: item,
        selected: false,
        type: "quantity",
    });
    if (hasPriceField) {
        data.push({
            title: `Preis - ${shop.name}`,
            value: currentItemShop?.price,
            state: item,
            selected: true,
            type: "price",
        });
    }

    return data;
}
