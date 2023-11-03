import React, { useState } from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { Appbar, Checkbox, Divider, List, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { checkItem, deleteItem, selectItem, setItemAmount, setItemName, toggleItemShop, toggleItemStorage } from "./store/itemsSlice";
import { Keyboard, Pressable, ScrollView, TouchableWithoutFeedback } from "react-native";

export function ItemScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList>;
}) {
    const [storagesExpanded, setStoragesExpanded] = useState(true);
    const [shopsExpanded, setShopsExpanded] = useState(true);
    const theme = useTheme();
    const item = useAppSelector(selectItem(props.route.params.id));
    const shops = useAppSelector(state => state.shops);
    const storages = useAppSelector(state => state.storages);
    const dispatch = useAppDispatch();

    function handleDeletePress(): void {
        dispatch(deleteItem(item.id));
        props.navigation.goBack();
    }

    function handleAmountChange(text: string): void {
        dispatch(setItemAmount({ itemId: item.id, amount: text }));
    }

    function handleNameChange(text: string): void {
        dispatch(setItemName({ itemId: item.id, name: text }));
    }

    function handleShopCheck(shopId: string): void {
        dispatch(toggleItemShop({ itemId: item.id, shopId: shopId }));
    }

    function handleStorageCheck(storageId: string): void {
        dispatch(toggleItemStorage({ itemId: item.id, storageId: storageId }));
    }

    function handleCheckPress(): void {
        Keyboard.dismiss();
        dispatch(checkItem({ itemId: item.id, check: !item.checked }))
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header statusBarHeight={0}>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={item?.name ?? "Item"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <TextInput
                label="Name"
                value={item.name}
                onChangeText={handleNameChange}
            />
            <TextInput
                label="Menge"
                value={item.amount}
                onChangeText={handleAmountChange}
            />
            <Pressable onPress={handleCheckPress}>
                <List.Item
                    title="Will haben?"
                    right={p =>
                        <Checkbox
                            {...p}
                            status={item.checked ? "checked" : "unchecked"}
                            onPress={handleCheckPress}
                        />}
                />
            </Pressable>
            <Divider />
            <List.Accordion
                description={storages.storages.filter(x => item.storages.find(y => y.storageId === x.id)).map(x => x.name).join()}
                expanded={storagesExpanded}
                style={{ backgroundColor: theme.colors.elevation.level3 }}
                title="Storages"
                onPress={() => {
                    Keyboard.dismiss();
                    setStoragesExpanded(v => !v);
                }}
            >
                <ScrollView style={{ backgroundColor: theme.colors.elevation.level1, height: 160 }}>
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
            </List.Accordion>
            <Divider />
            <List.Accordion
                expanded={shopsExpanded}
                style={{ backgroundColor: theme.colors.elevation.level3 }}
                title="Shops"
                onPress={() => {
                    Keyboard.dismiss();
                    setShopsExpanded(v => !v);
                }}
            >
                <ScrollView style={{ backgroundColor: theme.colors.elevation.level1, height: 160 }}>
                    {
                        shops.shops.map(s =>
                            <List.Item
                                key={s.id}
                                title={s.name}
                                right={p => <Checkbox
                                    {...p}
                                    status={item.shops.find(x => x.shopId === s.id) ? "checked" : "unchecked"}
                                    onPress={() => handleShopCheck(s.id)}
                                />}
                            />)
                    }
                </ScrollView>
            </List.Accordion>
        </SafeAreaView>
    );
}
