import React from 'react';
import { View } from 'react-native';
import { useAppSelector } from './store/hooks';
import { List } from 'react-native-paper';
import { FillListItem } from './FillListItem';
import { allStorage } from './store/storagesSlice';

export function FillList(props: {
    storageId: string;
}) {
    const items = useAppSelector(state => state.items);

    const recentlyUsed = items.items
        .filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && !x.wanted);

    return (
        <View>
            {
                items.items
                    .filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && x.wanted)
                    .map(x => <FillListItem key={x.id} item={x} showStorage={props.storageId === allStorage.id} />)
            }
            {
                (recentlyUsed.length > 0)
                && <List.Section title="Zuletzt verwendet">
                    {
                        recentlyUsed.map(x => <FillListItem key={x.id} item={x} showStorage={props.storageId === allStorage.id} />)
                    }
                </List.Section>
            }
        </View>
    );
}
