import React from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { ShopState, allShop } from './store/shopsSlice';
import { useAppSelector } from './store/hooks';
import { ShoppingListItem } from './ShoppingListItem';

export function ShoppingList(props: {
    shop: ShopState;
}) {
    const categories = useAppSelector(state => state.categories);
    const items = useAppSelector(state => state.items);

    const c = new Map(categories.map(x => [x.id, x]));
    const cats = props.shop.categoryIds?.filter(x => !!x).map(x => c.get(x))
        ?? [...categories].sort((x, y) => x.name.localeCompare(y.name));
    const recentlyUsed = items.items
        .filter(x => ((props.shop.id === allShop.id) || x.shops.find(x => x.shopId === props.shop.id)) && !x.wanted);

    return (
        <View>
            {
                cats.map(cat => {
                    const catItems = items.items
                        .filter(x => x.wanted)
                        .filter(x => x.categoryId === cat?.id)
                        .filter(x => ((props.shop.id === allShop.id) || x.shops.find(x => x.shopId === props.shop.id)));

                    return (
                        (catItems.length > 0)
                        && <List.Section key={cat.id} title={cat.name}>
                            {
                                catItems.map(x => <ShoppingListItem key={x.id} item={x} showShops={props.shop.id === allShop.id} />)
                            }
                        </List.Section>
                    );
                }
                )
            }
            {
                (recentlyUsed.length > 0)
                && <List.Section title="Zuletzt verwendet">
                    {
                        recentlyUsed.map(x => <ShoppingListItem key={x.id} item={x} showShops={props.shop.id === allShop.id} />)
                    }
                </List.Section>
            }
        </View >
    );
}
