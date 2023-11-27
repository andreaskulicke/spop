import { allStorage, selectItems } from './store/dataSlice';
import { FillListItem } from './FillListItem';
import { Item } from './store/data/items';
import { ItemsSectionList, ItemsSectionListData } from './ItemsSectionList';
import { SectionListRenderItemInfo } from 'react-native';
import { useAppSelector } from './store/hooks';
import React, { JSXElementConstructor, ReactElement } from 'react';

export function FillList(props: {
    storageId: string;
}) {
    const items = useAppSelector(selectItems);

    const itemsForThisStorage = items.filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && x.wanted);
    const unassigned = items
        .filter(x => (x.storages.length === 0) && x.wanted);
    const recentlyUsed = items
        .filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && !x.wanted);

    function handleRenderItem(info: SectionListRenderItemInfo<Item, ItemsSectionListData>): ReactElement<any, string | JSXElementConstructor<any>> | null {
        return (
            <FillListItem
                key={info.item.id}
                item={info.item}
                storageId={props.storageId}
            />
        );
    }

    const data: ItemsSectionListData[] = [
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
        />
    );
}
