import { FillFromHistoryListItem } from './FillFromHistoryListItem';
import { ItemState } from './store/itemsSlice';
import { useAppSelector } from './store/hooks';
import { View } from 'react-native';
import React from 'react';

export function FillFromHistoryList(props: {
    item: ItemState;
    onPress?: (item: ItemState) => void;
    onIconPress?: (name: string, amount: string | undefined) => void;
}) {
    const items = useAppSelector(state => state.items);

    return (
        <View>
            {
                props.item.name && !items.items.find(x => x.name.toLowerCase() === props.item.name.toLowerCase())
                && <FillFromHistoryListItem
                    item={props.item}
                    onPress={props.onPress}
                    onIconPress={props.onIconPress} />
            }
            {
                items.items
                    .filter(x => x.name.toLowerCase().includes(props.item.name.toLowerCase()))
                    .map(x => <FillFromHistoryListItem
                        key={x.id}
                        item={{ ...x, amount: props.item.amount }}
                        onPress={props.onPress}
                        onIconPress={props.onIconPress} />)
            }
        </View>
    );
}
