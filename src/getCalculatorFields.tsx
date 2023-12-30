import { allShop } from './store/dataSlice';
import { Item } from './store/data/items';
import { Shop } from './store/data/shops';

export function getCalculatorFields(item: Item | undefined, shop?: Shop) {
    const currentItemShop = item?.shops.find(x => x.shopId === shop?.id);
    const hasPriceField = shop && (shop.id !== allShop.id);
    const data = [
        {
            title: "Menge",
            value: Number.parseFloat(item?.quantity ?? "0") as number | undefined,
            unitId: item?.unitId,
            state: item,
            selected: !shop,
        }
    ];
    data.push(
        {
            title: "Packet Menge",
            value: item?.packageQuantity,
            unitId: item?.packageUnitId,
            state: item,
            selected: false,
        }
    );
    if (hasPriceField) {
        data.push(
            {
                title: `Preis - ${shop.name}`,
                value: currentItemShop?.price,
                unitId: currentItemShop?.unitId,
                state: item,
                selected: true,
            }
        );
    }
    return data;
}
