import { allShop } from "./store/dataSlice";
import { AvatarIcon } from "./AvatarIcon";
import { AvatarText } from './AvatarText';
import { Item, UnitId, getQuantityUnitFromItem } from './store/data/items';
import { Icon, List, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { numberToString } from "./numberToString";
import { PriceIcon } from "./PriceIcon";
import { View } from 'react-native';
import React from 'react';

export function HistoryListItem(props: {
    item: Item;
    originalItem?: Item;
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
            description={
                props.originalItem?.wanted
                && <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Icon size={16} source="cart" />
                    <Text>
                        {getQuantityUnitFromItem(props.originalItem)}
                    </Text>
                </View>
            }
            right={p =>
                <View
                    style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                    {
                        props.onCalculatorPress
                        && price
                        && <TouchableRipple
                            style={{
                                alignItems: "flex-end",
                                backgroundColor: theme.colors.elevation.level3,
                                borderColor: theme.colors.elevation.level3,
                                borderRadius: theme.roundness,
                                minWidth: 80,
                                paddingRight: 8,
                            }}
                            onPress={() => props.onCalculatorPress?.(props.item)}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                                <Text style={{ color: theme.colors.primary, paddingLeft: 8, paddingVertical: 10 }}>
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
                    <AvatarIcon icon="arrow-top-left" onPress={handleIconPress} />
                </View>
            }
            onPress={handlePress}
            onLongPress={handleLongPress}
        />
    );
}
