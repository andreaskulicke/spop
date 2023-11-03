import React from 'react';
import { View } from 'react-native';
import { useAppSelector } from './store/hooks';
import { ItemState } from './store/itemsSlice';
import uuid from 'react-native-uuid';
import { FillFromHistoryListItem } from './FillFromHistoryListItem';
import { allStorage } from './store/storagesSlice';

export function FillFromHistoryList(props: {
    storageId: string;
    text: string;
    onPress?: (item: ItemState) => void;
    onIconPress?: (text: string) => void;
}) {
    const items = useAppSelector(state => state.items);

    return (
        <View>
            {
                !items.items.find(x => x.name.toLowerCase() === props.text.toLowerCase())
                && <FillFromHistoryListItem
                    item={{
                        id: uuid.v4() as string,
                        name: props.text,
                        shops: [],
                        storages: (props.storageId === allStorage.id) ? [] : [{ storageId: props.storageId }],
                    }}
                    onPress={props.onPress}
                    onIconPress={props.onIconPress} />
            }
            {
                items.items
                    .filter(x => x.name.includes(props.text))
                    .map(x => <FillFromHistoryListItem
                        key={x.id}
                        item={x}
                        onPress={props.onPress}
                        onIconPress={props.onIconPress} />)
            }
        </View>
    );
}
