import { allShop } from './store/dataSlice';
import { Item } from './store/data/items';
import { Shop } from './store/data/shops';

export function getCalculatorFields(shop: Shop | undefined, item: Item | undefined) {
    const currentItemShop = item?.shops.find(x => x.shopId === shop?.id);
    const data = [
        {
            title: "Menge",
            value: Number.parseFloat(item?.quantity ?? "0") as number | undefined,
            unitId: item?.unitId,
            state: item,
            selected: true,
        }
    ];
    if (shop && (shop.id !== allShop.id)) {
        data.push(
            {
                title: `Preis - ${shop.name}`,
                value: currentItemShop?.price,
                unitId: currentItemShop?.unitId,
                state: item,
                selected: false,
            }
        );
    }
    return data;
}
