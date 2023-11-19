import React from 'react';
import { View } from 'react-native';
import { useAppSelector } from './store/hooks';
import { ShoppingListItem } from './ShoppingListItem';
import { allShop, selectAllShops, selectCategories } from './store/dataSlice';
import { ListSection } from './ListSection';
import { CategorySection } from './CategorySection';
import { Category } from './store/data/categories';
import { Shop } from './store/data/shops';

export function ShoppingList(props: {
    shop: Shop;
}) {
    const categories = useAppSelector(selectCategories);
    const items = useAppSelector(state => state.data.items);
    const shops = useAppSelector(selectAllShops);

    const c = new Map(categories.map(x => [x.id, x]));
    const cats = [undefined as (Category | undefined)]
        .concat(props.shop.categoryIds?.filter(x => !!x).map(x => c.get(x)) ?? categories);
    const unassigned = items
        .filter(x => x.wanted && (x.shops.length === 0));
    const recentlyUsed = items
        .filter(x => ((props.shop.id === allShop.id) || x.shops.find(x => x.shopId === props.shop.id)) && !x.wanted);

    // Add all previous shops from last stopper
    const s = new Set();
    for (const shop of shops) {
        if (shop.id === props.shop.id) {
            s.add(shop.id);
            break;
        }
        if (shop.stopper) {
            s.clear();
        } else {
            s.add(shop.id);
        }
    }

    return (
        <View>
            <ListSection icon="cart" title="Dinge" collapsed={false}>
                {
                    cats.map(cat => {
                        const catItems = items
                            .filter(x => x.wanted)
                            .filter(x => x.categoryId === cat?.id)
                            .filter(x => ((props.shop.id === allShop.id) || x.shops.find(x => s.has(x.shopId))));
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
        </View>
    );
}
