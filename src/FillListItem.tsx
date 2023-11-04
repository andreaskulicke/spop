import React from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { Avatar, Icon, IconButton, List, Text, useTheme } from 'react-native-paper';
import { ItemState, setItemAmount, checkItem } from './store/itemsSlice';
import { ColoredTextInput } from './ColoredTextInput';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

export function FillListItem(props: {
    item: ItemState;
    showStorage?: boolean;
}) {
    const storages = useAppSelector(state => state.storages);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    function handleAmountChange(text: string): void {
        dispatch(setItemAmount({ itemId: props.item.id, amount: text }));
    }

    function handleCheckPress(): void {
        dispatch(checkItem({ itemId: props.item.id, check: !props.item.checked }));
    }

    function handleItemPress(): void {
        navigation.navigate("Item", { id: props.item.id });
    }

    let description = "";
    if (props.showStorage) {
        description = props.item.storages
            .map(x => storages.storages.find(s => s.id === x.storageId)?.name)
            .filter(x => !!x)
            .join();
    }

    return (
        <List.Item
            description={description ? description : undefined}
            title={props.item.name}
            left={p =>
                <Avatar.Text {...p} color={theme.colors.primaryContainer} label={props.item.name.substring(0, 1)} size={40} />
            }
            right={p =>
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
            }
            onPress={handleItemPress}
        />
    );
}
