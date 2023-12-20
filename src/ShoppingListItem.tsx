import React from 'react';
import { View } from 'react-native';
import { List, Checkbox, IconButton, Tooltip, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setItemWanted, setItemQuantity, setItemShop, allShop, selectValidShops } from './store/dataSlice';
import { ColoredTextInput } from './ColoredTextInput';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { Item, itemListStyle } from './store/data/items';

export function ShoppingListItem(props: {
    item: Item;
    shopId: string;
}) {
    const shops = useAppSelector(selectValidShops);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const theme = useTheme();

    function handleQuantityChange(text: string): void {
        dispatch(setItemQuantity({ itemId: props.item.id, quantity: text }));
    }

    function handleAddToShopPress(): void {
        dispatch(setItemShop({ itemId: props.item.id, shopId: props.shopId, checked: true }));
    }

    function handlePress(): void {
        dispatch(setItemShop({ itemId: props.item.id, shopId: props.shopId, checked: true }));
        dispatch(setItemWanted({ itemId: props.item.id, wanted: !props.item.wanted }));
    }

    function handleItemPress(): void {
        navigation.navigate("Item", { id: props.item.id });
    }

    let description = "";
    if (props.shopId !== allShop.id) {
        description = props.item.shops
            .filter(x => x.checked)
            .map(x => shops.find(s => s.id === x.shopId)?.name)
            .filter(x => !!x)
            .join(", ");
    }

    return (
        <List.Item
            description={description ? description : undefined}
            title={props.item.name}
            style={itemListStyle(theme)}
            right={
                p => (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                        <ColoredTextInput
                            value={props.item.quantity}
                            onChange={handleQuantityChange}
                        />
                        {
                            props.item.wanted
                                ? <Tooltip title="Hab dich">
                                    <Checkbox
                                        {...p}
                                        status="unchecked"
                                        onPress={handlePress}
                                    />
                                </Tooltip>
                                : <Tooltip title="Will haben">
                                    <IconButton
                                        {...p}
                                        icon="plus-outline"
                                        onPress={handlePress}
                                    />
                                </Tooltip>
                        }
                        {
                            (props.shopId !== allShop.id) && (props.item.shops.filter(x => x.checked).length === 0)
                            && <Tooltip title="Zum Shop hinzufügen">
                                <IconButton
                                    {...p}
                                    icon="cart-plus"
                                    onPress={handleAddToShopPress}
                                />
                            </Tooltip>
                        }
                    </View>
                )}
            onPress={handleItemPress}
        />
    );
}
