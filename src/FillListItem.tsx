import React from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { Icon, IconButton, List, Text } from 'react-native-paper';
import { ItemState, changeItemAmount, checkItem } from './store/itemsSlice';
import { ColoredTextInput } from './ColoredTextInput';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

export function FillListItem(props: {
    item: ItemState;
    showStorage?: boolean;
}) {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    function handleAmountChange(text: string): void {
        dispatch(changeItemAmount({ itemId: props.item.id, amount: text }));
    }

    function handleCheckPress(): void {
        dispatch(checkItem({ itemId: props.item.id, check: !props.item.checked }));
    }

    function handleItemPress(): void {
        navigation.navigate("Item", { id: props.item.id });
    }

    return (
        <List.Item
            description={<Description {...props} />}
            title={props.item.name}
            right={
                p => (
                    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                        <ColoredTextInput
                            value={props.item.amount}
                            onChange={handleAmountChange} />
                        <IconButton
                            {...p}
                            icon={props.item.checked ? "minus" : "plus"}
                            onPress={handleCheckPress}
                        />
                    </View>
                )
            }
            onPress={handleItemPress}
        />
    );
}

function Description(props: {
    item: ItemState;
    showStorage?: boolean;
}) {
    const storages = useAppSelector(state => state.storages);

    if (!props.showStorage) {
        return undefined;
    }
    return (
        <Text variant="labelSmall">
            {
                props.item.storages
                    .map(x => storages.storages.find(s => s.id === x.storageId)?.name)
                    .filter(x => !!x)
                    .join()
            }
        </Text>
    );
}
