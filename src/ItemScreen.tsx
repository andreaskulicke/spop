import { addStorage, setItemWanted, deleteItem, selectItem, setItemAmount, setItemName, setItemStorage, setItemShop, setItemCategory, addShop, selectValidShops } from "./store/dataSlice";
import { Appbar, Card, Checkbox, IconButton, List, TextInput, TouchableRipple } from "react-native-paper";
import { CategoryMenu } from "./CategoryMenu";
import { Keyboard, ScrollView, View } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StatusBarView } from "./StatusBarView";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import React, { useEffect, useState } from "react";
import uuid from 'react-native-uuid';

export function ItemScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Item">;
}) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [storagesExpanded, setStoragesExpanded] = useState(false);
    const [shopsExpanded, setShopsExpanded] = useState(false);
    const item = useAppSelector(selectItem(props.route.params.id))!;
    const shops = useAppSelector(selectValidShops);
    const storages = useAppSelector(state => state.data.storages);
    const dispatch = useAppDispatch();

    function handleGoBack() {
        handleTextInputNameBlur();
        handleTextInputAmountBlur();
        props.navigation.goBack();
    }

    function handleDeletePress(): void {
        dispatch(deleteItem(item.id));
        props.navigation.goBack();
    }

    function handleAddShopPress(): void {
        const id = uuid.v4() as string;
        dispatch(addShop(id));
        dispatch(setItemShop({ itemId: item.id, shopId: id, checked: true }));
        props.navigation.navigate("Shop", { id });
    }

    function handleAddStoragePress(): void {
        const id = uuid.v4() as string;
        dispatch(addStorage(id));
        dispatch(setItemStorage({ itemId: item.id, storageId: id, checked: true }));
        props.navigation.navigate("Storage", { id });
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

    function handleTextInputNameBlur(): void {
        if (item) {
            dispatch(setItemName({ itemId: item.id, name: name.trim() }));
            setName(name.trim());
        }
    }

    function handleTextInputNameChange(text: string): void {
        setName(text);
    }

    function handleTextInputAmountBlur(): void {
        if (item) {
            dispatch(setItemAmount({ itemId: item.id, amount: amount.trim() }));
            setAmount(amount.trim());
        }
    }

    function handleTextInputAmountChange(text: string): void {
        setAmount(text);
    }

    useEffect(() => {
        setName(item?.name ?? "");
        setAmount(item?.amount ?? "");
    }, [item])

    return (
        <StatusBarView bottomPadding>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={handleGoBack} />
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
                        value={name}
                        onBlur={handleTextInputNameBlur}
                        onChangeText={handleTextInputNameChange}
                    />
                    <TextInput
                        label="Menge"
                        mode="outlined"
                        selectTextOnFocus
                        style={{ margin: 8 }}
                        value={amount}
                        onBlur={handleTextInputAmountBlur}
                        onChangeText={handleTextInputAmountChange}
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
                            subtitle={storages.filter(x => item.storages.find(y => y.storageId === x.id)).map(x => x.name).join(", ")}
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
                            return <List.Item
                                key={s.id}
                                title={s.name}
                                right={p => {
                                    const checked = item.storages.find(x => x.storageId === s.id);
                                    return <Checkbox
                                        {...p}
                                        status={checked ? "checked" : "unchecked"}
                                        onPress={() => handleStorageCheck(s.id, !checked)} />;
                                }}
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
                            subtitle={shops.filter(x => item.shops.find(y => y.shopId === x.id)).map(x => x.name).join(", ")}
                            right={p =>
                                <View style={{ flexDirection: "row" }}>
                                    <IconButton
                                        {...p}
                                        icon="plus-outline"
                                        onPress={handleAddShopPress}
                                    />
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
                                onPress={() => props.navigation.navigate("Shop", { id: s.id })}
                            />)
                    }
                </Card>
            </ScrollView>
        </StatusBarView>
    );
}
