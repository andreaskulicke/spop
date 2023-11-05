import React from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { IconButton, List, useTheme } from 'react-native-paper';
import { ItemState, setItemAmount, checkItem } from './store/itemsSlice';
import { ColoredTextInput } from './ColoredTextInput';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { AvatarText } from './AvatarText';

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
        dispatch(checkItem({ itemId: props.item.id, check: !props.item.wanted }));
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
            left={p => <AvatarText {...p} label={props.item.name} />}
            right={p =>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <ColoredTextInput
                        value={props.item.amount}
                        onChange={handleAmountChange} />
                    <IconButton
                        {...p}
                        icon={props.item.wanted ? "minus-thick" : "plus-outline"}
                        onPress={handleCheckPress}
                    />
                </View>
            }
            onPress={handleItemPress}
        />
    );
}
