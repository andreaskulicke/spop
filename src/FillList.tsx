import React from 'react';
import { View } from 'react-native';
import { useAppSelector } from './store/hooks';
import { FillListItem } from './FillListItem';
import { allStorage } from './store/dataSlice';
import { ListSection } from './ListSection';

export function FillList(props: {
    storageId: string;
}) {
    const items = useAppSelector(state => state.data);

    const recentlyUsed = items.items
        .filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && !x.wanted);

    return (
        <View>
            {
                items.items
                    .filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && x.wanted)
                    .map(x => <FillListItem key={x.id} item={x} showStorage={props.storageId === allStorage.id} />)
            }
            <ListSection icon="history" title="Zuletzt verwendet">
                {
                    recentlyUsed.map(x => <FillListItem key={x.id} item={x} showStorage={props.storageId === allStorage.id} />)
                }
            </ListSection>
        </View>
    );
}
