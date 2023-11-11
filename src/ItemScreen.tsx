import { addStorage, setItemWanted, deleteItem, selectItem, setItemAmount, setItemName, setItemStorage, setItemShop, setItemCategory } from "./store/dataSlice";
import { Appbar, Card, Checkbox, IconButton, List, TextInput, TouchableRipple } from "react-native-paper";
import { CategoryMenu } from "./CategoryMenu";
import { Keyboard, ScrollView, View } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import React, { useState } from "react";
import uuid from 'react-native-uuid';

export function ItemScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Item">;
}) {
    const [storagesExpanded, setStoragesExpanded] = useState(false);
    const [shopsExpanded, setShopsExpanded] = useState(false);
    const item = useAppSelector(selectItem(props.route.params.id))!;
    const shops = useAppSelector(state => state.data.shops);
    const storages = useAppSelector(state => state.data.storages);
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

    function handleAddStoragePress(): void {
        const id = uuid.v4() as string;
        dispatch(addStorage(id));
        dispatch(setItemStorage({ itemId: item.id, storageId: id, checked: true }));
        props.navigation.navigate("Storage", { id, new: true });
    }

    function handleShopCheck(shopId: string, checked: boolean): void {
        dispatch(setItemShop({ itemId: item.id, shopId: shopId, checked: checked }));
    }

    function handleStorageCheck(storageId: string, checked: boolean): void {
        dispatch(setItemStorage({ itemId: item.id, storageId: storageId, checked: checked }));
    }

    function handleCheckPress(): void {
        Keyboard.dismiss();
        dispatch(setItemWanted({ itemId: item.id, wanted: !item.wanted }))
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header statusBarHeight={0}>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={item?.name ?? "Item"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <ScrollView>
                <Card
                    style={{ margin: 8 }}
                >
                    <Card.Title title="Allgemein" />
                    <TextInput
                        label="Name"
                        mode="outlined"
                        selectTextOnFocus
                        style={{ margin: 8 }}
                        value={item.name}
                        onChangeText={handleNameChange}
                    />
                    <TextInput
                        label="Menge"
                        mode="outlined"
                        selectTextOnFocus
                        style={{ margin: 8 }}
                        value={item.amount}
                        onChangeText={handleAmountChange}
                    />
                    <CategoryMenu
                        categoryId={item.categoryId}
                        onSetCategory={categoryId => dispatch(setItemCategory({ itemId: item.id, categoryId: categoryId }))}
                    />
                    <Checkbox.Item
                        label="Will haben?"
                        status={item.wanted ? "checked" : "unchecked"}
                        style={{ margin: 8 }}
                        onPress={handleCheckPress}
                    />
                </Card>
                <Card
                    style={{ margin: 8 }}
                >
                    <TouchableRipple
                        onPress={() => setStoragesExpanded(x => !x)}
                    >
                        <Card.Title
                            title="Storages"
                            subtitle={storages.filter(x => item.storages.find(y => y.storageId === x.id)).map(x => x.name).join()}
                            right={p =>
                                <View style={{ flexDirection: "row" }}>
                                    <IconButton
                                        {...p}
                                        icon="plus-outline"
                                        onPress={handleAddStoragePress}
                                    />
                                    <IconButton
                                        {...p}
                                        icon={storagesExpanded ? "chevron-up" : "chevron-down"}
                                        onPress={() => setStoragesExpanded(x => !x)}
                                    />
                                </View>
                            }
                        />
                    </TouchableRipple>
                    {
                        storagesExpanded
                        && storages.map(s => {
                            const checked = item.storages.find(x => x.storageId === s.id);
                            return <List.Item
                                key={s.id}
                                title={s.name}
                                right={p => <Checkbox
                                    {...p}
                                    status={checked ? "checked" : "unchecked"}
                                    onPress={() => handleStorageCheck(s.id, !checked)}
                                />}
                                onPress={() => props.navigation.navigate("Storage", { id: s.id })}
                            />;
                        })
                    }
                </Card>
                <Card
                    style={{ margin: 8 }}
                >
                    <TouchableRipple
                        onPress={() => setShopsExpanded(x => !x)}
                    >
                        <Card.Title
                            title="Shops"
                            subtitle={shops.filter(x => item.shops.find(y => y.shopId === x.id)).map(x => x.name).join()}
                            right={p =>
                                <View style={{ flexDirection: "row" }}>
                                    <IconButton
                                        {...p}
                                        icon={shopsExpanded ? "chevron-up" : "chevron-down"}
                                        onPress={() => setShopsExpanded(x => !x)}
                                    />
                                </View>
                            }
                        />
                    </TouchableRipple>
                    {
                        shopsExpanded
                        && shops.map(s =>
                            <List.Item
                                key={s.id}
                                title={s.name}
                                right={p => {
                                    const checked = item.shops.find(x => x.shopId === s.id);
                                    return <Checkbox
                                        {...p}
                                        status={checked ? "checked" : "unchecked"}
                                        onPress={() => handleShopCheck(s.id, !checked)} />;
                                }}
                            />)
                    }
                </Card>
            </ScrollView>
        </SafeAreaView >
    );
}
