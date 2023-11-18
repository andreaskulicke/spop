import { List, Text } from 'react-native-paper';
import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Item } from './store/data/items';

export function FillFromHistoryListItem(props: {
    item: Item;
    onPress?: (item: Item) => void;
    onIconPress?: (name: string, amount: string | undefined) => void;
}) {
    function handlePress(): void {
        props.onPress?.(props.item);
    }

    function handleIconPress(): void {
        props.onIconPress?.(props.item.name, props.item.amount);
    }

    return (
        <List.Item
            title={props.item.name}
            right={p =>
                <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                >
                    <Text>{props.item.amount}</Text>
                    <TouchableOpacity onPress={handleIconPress}>
                        <List.Icon {...p} icon="arrow-top-left" style={{ padding: 8 }} />
                    </TouchableOpacity>
                </View>
            }
            onPress={handlePress} />
    );
}
