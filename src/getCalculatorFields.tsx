import { allShop } from "./store/dataSlice";
import { Calculator } from "./Calculator";
import { Item } from "./store/data/items";
import { Shop } from "./store/data/shops";

export function getCalculatorFields(item: Item | undefined, shop?: Shop) {
    const currentItemShop = item?.shops.find((x) => x.shopId === shop?.id);
    const hasPriceField = shop && shop.id !== allShop.id;
    const data: React.ComponentProps<typeof Calculator>["fields"] = [
        {
            title: "Menge",
            value: item?.quantity,
            unitId: item?.unitId,
            state: item,
            selected: !shop,
        },
    ];
    data.push({
        title: "Paket Menge",
        value: item?.packageQuantity,
        unitId: item?.packageUnitId,
        state: item,
        selected: false,
    });
    if (hasPriceField) {
        data.push({
            title: `Preis - ${shop.name}`,
            value: currentItemShop?.price,
            unitId: currentItemShop?.unitId,
            type: "price",
            state: item,
            selected: true,
        });
    }
    return data;
}
