import React from 'react';
import { View } from 'react-native';
import { useAppSelector } from './store/hooks';
import { FillListItem } from './FillListItem';
import { allStorage, selectItems } from './store/dataSlice';
import { ListSection } from './ListSection';

export function FillList(props: {
    storageId: string;
}) {
    const items = useAppSelector(selectItems);

    const unassigned = items
        .filter(x => (x.storages.length === 0) && x.wanted);
    const recentlyUsed = items
        .filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && !x.wanted);

    const itemsForThisStorage = items.filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && x.wanted);
    return (
        <View>
            <ListSection
                icon="cart"
                title="Dinge"
                collapsed={false}
                count={itemsForThisStorage.length}
            >
                {
                    itemsForThisStorage.map(x => <FillListItem key={x.id} item={x} storageId={props.storageId} />)
                }
            </ListSection>
            <ListSection icon="home-remove-outline" title="Ohne Storage" collapsed={false} count={unassigned.length}>
                {
                    unassigned.map(x => <FillListItem key={x.id} item={x} storageId={props.storageId} />)
                }
            </ListSection>
            <ListSection icon="history" title="Zuletzt verwendet" collapsed={false} count={recentlyUsed.length}>
                {
                    recentlyUsed.map(x => <FillListItem key={x.id} item={x} storageId={props.storageId} />)
                }
            </ListSection>
        </View>
    );
}
