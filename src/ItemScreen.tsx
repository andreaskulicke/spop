import React, { useState } from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { Appbar, Card, Checkbox, Divider, List, TextInput, useTheme } from "react-native-paper";
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
            <ScrollView style={{ backgroundColor: theme.colors.elevation.level1, height: 160 }}>
                <Card
                    style={{ margin: 8 }}
                >
                    <Card.Title title="Allgemein" />
                    <TextInput
                        label="Name"
                        mode="outlined"
                        style={{ margin: 8 }}
                        value={item.name}
                        onChangeText={handleNameChange}
                    />
                    <TextInput
                        label="Menge"
                        mode="outlined"
                        style={{ margin: 8 }}
                        value={item.amount}
                        onChangeText={handleAmountChange}
                    />
                    <Checkbox.Item
                        label="Will haben?"
                        status={item.checked ? "checked" : "unchecked"}
                        style={{ margin: 8 }}
                        onPress={handleCheckPress}
                    />
                </Card>
                <Card
                    style={{ margin: 8 }}
                >
                    <List.Accordion
                        description={storages.storages.filter(x => item.storages.find(y => y.storageId === x.id)).map(x => x.name).join()}
                        expanded={storagesExpanded}
                        title="Storages"
                        onPress={() => {
                            Keyboard.dismiss();
                            setStoragesExpanded(v => !v);
                        }}
                    >
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
                    </List.Accordion>
                </Card>
                <Card
                    style={{ margin: 8 }}
                >
                    <List.Accordion
                        description={shops.shops.filter(x => item.shops.find(y => y.shopId === x.id)).map(x => x.name).join()}
                        expanded={shopsExpanded}
                        title="Shops"
                        onPress={() => {
                            Keyboard.dismiss();
                            setShopsExpanded(v => !v);
                        }}
                    >
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
                    </List.Accordion>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
