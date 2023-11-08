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

    function transformToSearchName(name: string): string {
        return name.toLowerCase()
            .replace("ä", "a")
            .replace("ö", "o")
            .replace("ü", "u")
            .replace("ß", "s");
    }

    const itemName = transformToSearchName(props.item.name);

    return (
        <View>
            {
                props.item.name && !items.items.find(x => transformToSearchName(x.name) === itemName)
                && <FillFromHistoryListItem
                    item={props.item}
                    onPress={props.onPress}
                    onIconPress={props.onIconPress} />
            }
            {
                items.items
                    .filter(x => transformToSearchName(x.name).includes(itemName))
                    .map(x => <FillFromHistoryListItem
                        key={x.id}
                        item={{ ...x, amount: props.item.amount }}
                        onPress={props.onPress}
                        onIconPress={props.onIconPress} />)
            }
        </View>
    );
}
