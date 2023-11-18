import React from 'react';
import { View } from 'react-native';
import { List, Checkbox, IconButton, useTheme, Tooltip } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { Item, setItemWanted, setItemAmount, setItemShop, allShop } from './store/dataSlice';
import { ColoredTextInput } from './ColoredTextInput';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

export function ShoppingListItem(props: {
    item: Item;
    shopId: string;
    showShops?: boolean;
}) {
    const shops = useAppSelector(state => state.data.shops);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    function handleAmountChange(text: string): void {
        dispatch(setItemAmount({ itemId: props.item.id, amount: text }));
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
    if (props.showShops) {
        description = props.item.shops
            .map(x => shops.find(s => s.id === x.shopId)?.name)
            .filter(x => !!x)
            .join(", ");
    }

    return (
        <List.Item
            description={description ? description : undefined}
            title={props.item.name}
            right={
                p => (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                        <ColoredTextInput
                            value={props.item.amount}
                            onChange={handleAmountChange}
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
                            (props.shopId !== allShop.id) && (props.item.shops.length === 0)
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
