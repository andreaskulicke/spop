import React from 'react';
import { View } from 'react-native';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { IconButton, List, Tooltip } from 'react-native-paper';
import { allStorage, setItemAmount, setItemStorage, setItemWanted } from './store/dataSlice';
import { ColoredTextInput } from './ColoredTextInput';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { AvatarText } from './AvatarText';
import { Item } from './store/data/items';

export function FillListItem(props: {
    item: Item;
    storageId: string;
}) {
    const storages = useAppSelector(state => state.data.storages);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    function handleAddToStoragePress(): void {
        dispatch(setItemStorage({ itemId: props.item.id, storageId: props.storageId, checked: true }));
    }

    function handleAmountChange(text: string): void {
        dispatch(setItemAmount({ itemId: props.item.id, amount: text }));
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
            left={p => <AvatarText {...p} label={props.item.name} />}
            right={p =>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                    <ColoredTextInput
                        value={props.item.amount}
                        onChange={handleAmountChange} />
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
