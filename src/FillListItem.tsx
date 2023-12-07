import React from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { IconButton, List, Tooltip, useTheme } from 'react-native-paper';
import { allStorage, setItemquantity, setItemStorage, setItemWanted } from './store/dataSlice';
import { ColoredTextInput } from './ColoredTextInput';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { Item, itemListStyle } from './store/data/items';

export function FillListItem(props: {
    item: Item;
    storageId: string;
}) {
    const storages = useAppSelector(state => state.data.storages);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const theme = useTheme();

    function handleAddToStoragePress(): void {
        dispatch(setItemStorage({ itemId: props.item.id, storageId: props.storageId, checked: true }));
    }

    function handleQuantityChange(text: string): void {
        dispatch(setItemQuantity({ itemId: props.item.id, quantity: text }));
    }

    function handleCheckPress(): void {
        dispatch(setItemWanted({ itemId: props.item.id, wanted: !props.item.wanted }));
    }

    function handleItemPress(): void {
        navigation.navigate("Item", { id: props.item.id });
    }

    let description = "";
    if (props.storageId !== allStorage.id) {
        description = props.item.storages
            .map(x => storages.find(s => s.id === x.storageId)?.name)
            .filter(x => !!x)
            .join(", ");
    }

    return (
        <List.Item
            description={description ? description : undefined}
            title={props.item.name}
            style={itemListStyle(theme)}
            right={p =>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                    <ColoredTextInput
                        value={props.item.quantity}
                        onChange={handleQuantityChange} />
                    <IconButton
                        {...p}
                        icon={props.item.wanted ? "minus-thick" : "plus-outline"}
                        onPress={handleCheckPress}
                    />
                    {
                        (props.storageId !== allStorage.id) && (props.item.storages.length === 0)
                        && <Tooltip title="Zum Storage hinzufügen">
                            <IconButton
                                {...p}
                                icon="home-plus-outline"
                                onPress={handleAddToStoragePress}
                            />
                        </Tooltip>
                    }
                </View>
            }
            onPress={handleItemPress}
        />
    );
}
