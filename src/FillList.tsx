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

    return (
        <View>
            {
                items.items
                    .filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && x.checked)
                    .map(x => <FillListItem key={x.id} item={x} showStorage={props.storageId === allStorage.id} />)
            }
            <List.Section>
                <List.Subheader>Zuletzt verwendet</List.Subheader>
                {
                    items.items
                        .filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && !x.checked)
                        .map(x => <FillListItem key={x.id} item={x} showStorage={props.storageId === allStorage.id} />)
                }
            </List.Section>
        </View>
    );
}
