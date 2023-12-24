import { allStorage, selectItems } from './store/dataSlice';
import { FillListItem } from './FillListItem';
import { Item } from './store/data/items';
import { ItemsSectionList, ItemsSectionListSection } from './ItemsSectionList';
import { useAppSelector } from './store/hooks';
import React, { JSXElementConstructor, ReactElement } from 'react';

export function FillList(props: {
    storageId: string;
    selectedItemId?: string;
}) {
    const items = useAppSelector(selectItems);

    const itemsForThisStorage = items.filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && x.wanted);
    const unassigned = items
        .filter(x => (x.storages.length === 0) && x.wanted);
    const recentlyUsed = items
        .filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && !x.wanted);

    function handleRenderItem(item: Item): ReactElement<any, string | JSXElementConstructor<any>> | null {
        return (
            <FillListItem
                key={item.id}
                item={item}
                storageId={props.storageId}
            />
        );
    }

    const data: ItemsSectionListSection[] = [
        {
            title: "Dinge",
            icon: "cart",
            data: itemsForThisStorage,
        },
        {
            title: "Ohne Storage",
            icon: "home-remove-outline",
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
            selectedItemId={props.selectedItemId}
        />
    );
}
