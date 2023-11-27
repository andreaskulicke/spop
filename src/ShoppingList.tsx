import { allShop, selectAllShops, selectCategories } from './store/dataSlice';
import { Category } from './store/data/categories';
import { CategorySection } from './CategorySection';
import { Item } from './store/data/items';
import { ItemsSectionList, ItemsSectionListData } from './ItemsSectionList';
import { SectionListRenderItemInfo, View } from 'react-native';
import { Shop } from './store/data/shops';
import { ShoppingListItem } from './ShoppingListItem';
import { useAppSelector } from './store/hooks';
import React, { JSXElementConstructor, ReactElement } from 'react';

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

    const itemsForThisShop = items.filter(i => i.wanted && (props.shop.id === allShop.id || i.shops.find(x => s.has(x.shopId))))
        .filter(x => (x.categoryId === undefined) || cats.find(c => c?.id === x.categoryId));



    function handleRenderItem(info: SectionListRenderItemInfo<Item, ItemsSectionListData>): ReactElement<any, string | JSXElementConstructor<any>> | null {
        return (
            (info.section.icon === "cart")
                ? <View>
                    {
                        cats.map(cat => {
                            const catItems = itemsForThisShop.filter(x => x.categoryId === cat?.id);
                            return (
                                <CategorySection key={cat?.id ?? "_"} icon={cat?.icon} title={cat?.name ?? "Unbekannte Kategorie"}>
                                    {
                                        catItems.map(x => <ShoppingListItem key={x.id} item={x} shopId={props.shop.id} />)
                                    }
                                </CategorySection>
                            );
                        })
                    }
                </View>
                : <ShoppingListItem key={info.item.id} item={info.item} shopId={props.shop.id} />
        );
    }

    const data: ItemsSectionListData[] = [
        {
            title: "Dinge",
            icon: "cart",
            data: itemsForThisShop,
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


    return (
        <ItemsSectionList
            data={data}
            renderItem={handleRenderItem}
        />
    );
}
