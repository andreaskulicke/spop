import { Item } from './store/data/items';
import { ItemsSectionList, ItemsSectionListSection } from './ItemsSectionList';
import { selectItemsNotWantedWithShop, selectItemsWantedWithShop, selectItemsWantedWithoutShop } from './store/dataSlice';
import { Shop } from './store/data/shops';
import { ShoppingListItem } from './ShoppingListItem';
import { useAppSelector } from './store/hooks';
import React, { JSXElementConstructor, ReactElement } from 'react';

export function ShoppingList(props: {
    shop: Shop;
    selectedItemId?: string;
}) {
    const itemsForThisShop3 = useAppSelector(selectItemsWantedWithShop(props.shop));
    const unassigned = useAppSelector(selectItemsWantedWithoutShop());
    const recentlyUsed = useAppSelector(selectItemsNotWantedWithShop(props.shop.id));

    const data: ItemsSectionListSection[] = [
        {
            title: "Dinge",
            icon: "cart",
            data: itemsForThisShop3,
        },
        {
            title: "Ohne Shop",
            icon: "store-off",
            data: unassigned,
        },
        {
            title: "Zuletzt verwendet",
            icon: "history",
            data: recentlyUsed,
        },
    ];

    function handleRenderItem(item: Item): ReactElement<any, string | JSXElementConstructor<any>> | null {
        return (
            <ShoppingListItem key={item.id} item={item} shopId={props.shop.id} />
        );
    }

    return (
        <ItemsSectionList
            data={data}
            renderItem={handleRenderItem}
            selectedItemId={props.selectedItemId}
        />
    );
}
