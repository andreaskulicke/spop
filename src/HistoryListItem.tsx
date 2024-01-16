import { allShop } from "./store/dataSlice";
import { AvatarIcon } from "./AvatarIcon";
import { AvatarText } from './AvatarText';
import { Item, UnitId, getQuantityUnit } from './store/data/items';
import { List, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { numberToString } from "./numberToString";
import { PriceIcon } from "./PriceIcon";
import { View } from 'react-native';
import React from 'react';

export function HistoryListItem(props: {
    item: Item;
    shopId?: string;
    onPress?: (item: Item) => void;
    onLongPress?: (item: Item) => void;
    onCalculatorPress?: (item: Item) => void;
    onIconPress?: (name: string, quantity: number | undefined, unitId: UnitId | undefined) => void;
}) {
    const theme = useTheme();

    function handlePress(): void {
        props.onPress?.(props.item);
    }

    function handleLongPress(): void {
        props.onLongPress?.(props.item);
    }

    function handleIconPress(): void {
        props.onIconPress?.(props.item.name, props.item.quantity, props.item.unitId);
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
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                                <Text style={{ color: theme.colors.primary, paddingLeft: 8, paddingVertical: 8 }}>
                                    {numberToString(price)} €
                                </Text>
                                <PriceIcon
                                    itemId={props.item.id}
                                    shopId={props.shopId}
                                />
                            </View>
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

                    <Text style={{ marginHorizontal: 16 }}>{getQuantityUnit(props.item)}</Text>
                    <AvatarIcon icon="arrow-top-left" onPress={handleIconPress} />
                </View>
            }
            onPress={handlePress}
            onLongPress={handleLongPress}
        />
    );
}
