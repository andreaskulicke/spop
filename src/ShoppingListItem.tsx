import React from 'react';
import { View } from 'react-native';
import { List, Checkbox, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { ItemState, checkItem, setItemAmount } from './store/itemsSlice';
import { ColoredTextInput } from './ColoredTextInput';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

export function ShoppingListItem(props: {
    item: ItemState;
    showShops?: boolean;
}) {
    const shops = useAppSelector(state => state.shops);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    function handleAmountChange(text: string): void {
        dispatch(setItemAmount({ itemId: props.item.id, amount: text }));
    }

    function handlePress(): void {
        dispatch(checkItem({ itemId: props.item.id, check: !props.item.checked }));
    }

    function handleItemPress(): void {
        navigation.navigate("Item", { id: props.item.id });
    }

    let description = "";
    if (props.showShops) {
        description = props.item.shops
            .map(x => shops.shops.find(s => s.id === x.shopId)?.name)
            .filter(x => !!x)
            .join();
    }

    return (
        <List.Item
            description={description ? description : undefined}
            title={props.item.name}
            right={
                p => (
                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <ColoredTextInput
                            value={props.item.amount}
                            onChange={handleAmountChange} />
                        <Checkbox
                            {...p}
                            status={props.item.checked ? "checked" : "unchecked"}
                            onPress={handlePress} />
                    </View>
                )}
            onPress={handleItemPress}
        />
    );
}
