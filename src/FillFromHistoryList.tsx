import { allStorage } from './store/storagesSlice';
import { FillFromHistoryListItem } from './FillFromHistoryListItem';
import { ItemState } from './store/itemsSlice';
import { useAppSelector } from './store/hooks';
import { View } from 'react-native';
import React from 'react';
import uuid from 'react-native-uuid';

export function FillFromHistoryList(props: {
    storageId: string;
    text: string;
    amount?: string;
    onPress?: (item: ItemState) => void;
    onIconPress?: (name: string, amount: string | undefined) => void;
}) {
    const items = useAppSelector(state => state.items);

    return (
        <View>
            {
                props.text && !items.items.find(x => x.name.toLowerCase() === props.text.toLowerCase())
                && <FillFromHistoryListItem
                    item={{
                        id: uuid.v4() as string,
                        name: props.text,
                        amount: props.amount,
                        shops: [],
                        storages: (props.storageId === allStorage.id) ? [] : [{ storageId: props.storageId }],
                    }}
                    onPress={props.onPress}
                    onIconPress={props.onIconPress} />
            }
            {
                items.items
                    .filter(x => x.name.toLowerCase().includes(props.text.toLowerCase()))
                    .map(x => <FillFromHistoryListItem
                        key={x.id}
                        item={{ ...x, amount: props.amount }}
                        onPress={props.onPress}
                        onIconPress={props.onIconPress} />)
            }
        </View>
    );
}
