import React from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { ShopState, allShop } from './store/shopsSlice';
import { useAppSelector } from './store/hooks';
import { ShoppingListItem } from './ShoppingListItem';

export function ShoppingList(props: {
    shop: ShopState;
}) {
    const items = useAppSelector(state => state.items);

    const recentlyUsed = items.items
        .filter(x => ((props.shop.id === allShop.id) || x.shops.find(x => x.shopId === props.shop.id)) && !x.wanted);
    return (
        <View>
            {
                items.items
                    .filter(x => ((props.shop.id === allShop.id) || x.shops.find(x => x.shopId === props.shop.id)) && x.wanted)
                    .map(x => <ShoppingListItem key={x.id} item={x} showShops={props.shop.id === allShop.id} />)
            }
            {
                (recentlyUsed.length > 0)
                && <List.Section title="Zuletzt verwendet">
                    {
                        recentlyUsed.map(x => <ShoppingListItem key={x.id} item={x} showShops={props.shop.id === allShop.id} />)
                    }
                </List.Section>
            }
        </View>
    );
}
