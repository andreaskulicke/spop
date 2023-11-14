import React from 'react';
import { View } from 'react-native';
import { useAppSelector } from './store/hooks';
import { ShoppingListItem } from './ShoppingListItem';
import { Category, Shop, allShop } from './store/dataSlice';
import { ListSection } from './ListSection';
import { CategorySection } from './CategorySection';

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
            <ListSection icon="cart" title="Dinge" collapsed={false}>
                {
                    cats.map(cat => {
                        const catItems = items.items
                            .filter(x => x.wanted)
                            .filter(x => x.categoryId === cat?.id)
                            .filter(x => ((props.shop.id === allShop.id) || x.shops.find(x => x.shopId === props.shop.id)));
                        return (
                            <CategorySection key={cat?.id ?? "_"} icon={cat?.icon} title={cat?.name ?? "Unbekannte Kategorie"}>
                                {
                                    catItems.map(x => <ShoppingListItem key={x.id} item={x} shopId={props.shop.id} showShops={props.shop.id === allShop.id} />)
                                }
                            </CategorySection>
                        );
                    })
                }
            </ListSection>
            {
                (props.shop.id !== allShop.id)
                && <ListSection icon="store-off" title="Ohne Shop" collapsed={false}>
                    {
                        unassigned.map(x => <ShoppingListItem key={x.id} item={x} shopId={props.shop.id} />)
                    }
                </ListSection>
            }
            <ListSection icon="history" title="Zuletzt verwendet" collapsed={false}>
                {
                    recentlyUsed.map(x => <ShoppingListItem key={x.id} item={x} shopId={props.shop.id} showShops={props.shop.id === allShop.id} />)
                }
            </ListSection>
        </View >
    );
}
