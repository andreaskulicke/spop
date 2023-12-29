import { allShop } from "./store/dataSlice";
import { AvatarIcon } from "./AvatarIcon";
import { AvatarText } from './AvatarText';
import { Item } from './store/data/items';
import { List, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { View } from 'react-native';
import React from 'react';

export function FillFromHistoryListItem(props: {
    item: Item;
    shopId?: string;
    onPress?: (item: Item) => void;
    onLongPress?: (item: Item) => void;
    onCalculatorPress?: (item: Item) => void;
    onIconPress?: (name: string, quantity: string | undefined) => void;
}) {
    const theme = useTheme();

    function handlePress(): void {
        props.onPress?.(props.item);
    }

    function handleLongPress(): void {
        props.onLongPress?.(props.item);
    }

    function handleIconPress(): void {
        props.onIconPress?.(props.item.name, props.item.quantity);
    }

    const price = props.item.shops.find(x => x.shopId === props.shopId)?.price;

    return (
        <List.Item
            title={props.item.name}
            right={p =>
                <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                >
                    {
                        props.onCalculatorPress
                        && price
                        && <TouchableRipple
                            onPress={() => props.onCalculatorPress?.(props.item)}
                        >
                            <Text style={{ color: theme.colors.primary, paddingHorizontal: 8, paddingVertical: 8 }}>
                                {price.toString().replace(".", ",")} €
                            </Text>
                        </TouchableRipple>
                    }
                    {
                        props.onCalculatorPress
                        && (props.shopId && (props.shopId !== allShop.id))
                        && !price
                        && <AvatarText
                            label="€"
                            onPress={() => props.onCalculatorPress?.(props.item)}
                        />
                    }

                    <Text style={{ marginHorizontal: 16 }}>{props.item.quantity}</Text>
                    <AvatarIcon icon="arrow-top-left" onPress={handleIconPress} />
                </View>
            }
            onPress={handlePress}
            onLongPress={handleLongPress}
        />
    );
}
