import { TouchableOpacity } from 'react-native';
import { List } from 'react-native-paper';
import React from 'react';
import { ItemState } from './store/itemsSlice';

export function FillFromHistoryListItem(props: {
    item: ItemState;
    onPress?: (item: ItemState) => void;
    onIconPress?: (text: string) => void;
}) {
    function handlePress(): void {
        props.onPress(props.item);
    }

    function handleIconPress(): void {
        props.onIconPress(props.item.name);
    }

    return (
        <List.Item
            title={props.item.name}
            right={p => <TouchableOpacity onPress={handleIconPress}>
                <List.Icon {...p} icon="arrow-top-left" />
            </TouchableOpacity>}
            onPress={handlePress} />
    );
}
