import React from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { useAppSelector } from './store/hooks';
import { ShoppingListItem } from './ShoppingListItem';
import { Category, Shop, allShop } from './store/dataSlice';

export function ShoppingList(props: {
    shop: Shop;
}) {
    const categories = useAppSelector(state => state.data.categories);
    const items = useAppSelector(state => state.data);

    const c = new Map(categories.map(x => [x.id, x]));
    const cats = [undefined as (Category | undefined)]
        .concat(props.shop.categoryIds?.filter(x => !!x).map(x => c.get(x)) ?? categories);
    const unassigned = items.items
        .filter(x => x.wanted && (x.shops.length === 0));
    const recentlyUsed = items.items
        .filter(x => ((props.shop.id === allShop.id) || x.shops.find(x => x.shopId === props.shop.id)) && !x.wanted);

    return (
        <View>
            {

            }
            {
                cats.map(cat => {
                    const catItems = items.items
                        .filter(x => x.wanted)
                        .filter(x => x.categoryId === cat?.id)
                        .filter(x => ((props.shop.id === allShop.id) || x.shops.find(x => x.shopId === props.shop.id)));
                    return (
                        (catItems.length > 0)
                        && <List.Section key={cat?.id ?? "_"} title={cat?.name ?? "Unbekannte Kategorie"}>
                            {
                                catItems.map(x => <ShoppingListItem key={x.id} item={x} shopId={props.shop.id} showShops={props.shop.id === allShop.id} />)
                            }
                        </List.Section>
                    );
                }
                )
            }
            {
                (props.shop.id !== allShop.id) && (unassigned.length > 0)
                && <List.Section title="Ohne Shop">
                    {
                        unassigned.map(x => <ShoppingListItem key={x.id} item={x} shopId={props.shop.id} />)
                    }
                </List.Section>
            }
            {
                (recentlyUsed.length > 0)
                && <List.Section title="Zuletzt verwendet">
                    {
                        recentlyUsed.map(x => <ShoppingListItem key={x.id} item={x} shopId={props.shop.id} showShops={props.shop.id === allShop.id} />)
                    }
                </List.Section>
            }
        </View >
    );
}
