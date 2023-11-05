import React, { useState } from "react";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { Appbar, Card, Checkbox, IconButton, List, Menu, TextInput, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { checkItem, deleteItem, selectItem, setItemAmount, setItemCategory, setItemName, toggleItemShop, toggleItemStorage } from "./store/itemsSlice";
import { Dimensions, Keyboard, ScrollView, View } from "react-native";
import { AvatarText } from "./AvatarText";
import uuid from 'react-native-uuid';
import { addCategory } from "./store/categoriesSlice";

export function ItemScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Item">;
}) {
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const [storagesExpanded, setStoragesExpanded] = useState(false);
    const [shopsExpanded, setShopsExpanded] = useState(false);
    const categories = useAppSelector(state => state.categories);
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

    function handleAddCategoryPress(): void {
        const id = uuid.v4() as string;
        dispatch(addCategory(id));
        dispatch(setItemCategory({ itemId: item.id, categoryId: id }));
        props.navigation.navigate("Category", { id });
    }

    function handleEditCategoryPress(): void {
        props.navigation.navigate("Category", { id: item.categoryId })
    }

    function handleShopCheck(shopId: string): void {
        dispatch(toggleItemShop({ itemId: item.id, shopId: shopId }));
    }

    function handleStorageCheck(storageId: string): void {
        dispatch(toggleItemStorage({ itemId: item.id, storageId: storageId }));
    }

    function handleCheckPress(): void {
        Keyboard.dismiss();
        dispatch(checkItem({ itemId: item.id, check: !item.wanted }))
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
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ flexGrow: 1 }}>
                            <Menu
                                anchor={
                                    <TouchableRipple
                                        onPress={() => setCategoryMenuVisible(true)}
                                    >
                                        <TextInput
                                            editable={false}
                                            label="Kategorie"
                                            mode="outlined"
                                            style={{ margin: 8 }}
                                            value={categories.find(x => x.id === item.categoryId)?.name}
                                            right={<TextInput.Icon icon={categoryMenuVisible ? "chevron-up" : "chevron-down"} onPress={() => setCategoryMenuVisible(true)} />}
                                        />
                                    </TouchableRipple>
                                }
                                anchorPosition="bottom"
                                style={{ marginLeft: 8, width: Dimensions.get("window").width - 32 }}
                                visible={categoryMenuVisible}
                                onDismiss={() => setCategoryMenuVisible(false)}
                            >
                                {
                                    [...categories]
                                        .sort((x, y) => x.name.localeCompare(y.name))
                                        .map(x => (
                                            <Menu.Item
                                                key={x.id}
                                                contentStyle={{ marginLeft: 24 }}
                                                title={x.name}
                                                leadingIcon={p => <AvatarText {...p} label={x.name} />}
                                                onPress={() => {
                                                    setCategoryMenuVisible(false);
                                                    dispatch(setItemCategory({ itemId: item.id, categoryId: x.id }))
                                                }}
                                            />
                                        ))
                                }
                            </Menu>
                        </View>
                        {
                            item.categoryId
                            && <IconButton icon="pencil-outline" onPress={handleEditCategoryPress} />
                        }
                        <IconButton icon="plus-outline" onPress={handleAddCategoryPress} />
                    </View>
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
                            subtitle={storages.storages.filter(x => item.storages.find(y => y.storageId === x.id)).map(x => x.name).join()}
                            right={p => <IconButton {...p} icon={storagesExpanded ? "chevron-up" : "chevron-down"} />}
                        />
                    </TouchableRipple>
                    {
                        storagesExpanded
                        && storages.storages.map(s =>
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
                </Card>
                <Card
                    style={{ margin: 8 }}
                >
                    <TouchableRipple
                        onPress={() => setShopsExpanded(x => !x)}
                    >
                        <Card.Title
                            title="Shops"
                            subtitle={shops.shops.filter(x => item.shops.find(y => y.shopId === x.id)).map(x => x.name).join()}
                            right={p => <IconButton {...p} icon={shopsExpanded ? "chevron-up" : "chevron-down"} />}
                        />
                    </TouchableRipple>
                    {
                        shopsExpanded
                        && shops.shops.map(s =>
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
                </Card>
            </ScrollView>
        </SafeAreaView >
    );
}
