import React from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { Appbar, Checkbox, Divider, List, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { deleteItem, selectItem, setItemName, toggleItemStorage } from "./store/itemsSlice";
import { ScrollView } from "react-native";

export function ItemScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList>;
}) {
    const item = useAppSelector(selectItem(props.route.params.id));
    const storages = useAppSelector(state => state.storages);
    const dispatch = useAppDispatch();

    function handleDeletePress(): void {
        dispatch(deleteItem(item.id));
        props.navigation.goBack();
    }

    function handleNameChange(text: string): void {
        dispatch(setItemName({ itemId: item.id, name: text }));
    }

    function handleStorageCheck(storageId: string): void {
        dispatch(toggleItemStorage({ itemId: item.id, storageId: storageId }));
    }

    return (
        <SafeAreaView>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={item?.name ?? "Item"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <TextInput
                label="Name"
                value={item.name}
                onChangeText={handleNameChange}
            />
            <Divider />
            <List.Section title="Storages">
                <ScrollView keyboardShouldPersistTaps="always">
                    {
                        storages.storages.map(s =>
                            <List.Item
                                key={s.id}
                                title={s.name}
                                right={p => <Checkbox
                                    {...p}
                                    status={item.storages.find(x => x.storageId === s.id) ? "checked" : "unchecked"}
                                    onPress={() => handleStorageCheck(s.id)}
                                />}
                            />)
                    }
                </ScrollView>
            </List.Section>
        </SafeAreaView>
    );
}
