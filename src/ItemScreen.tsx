import { addStorage, setItemWanted, deleteItem, selectItem, setItemQuantity, setItemName, setItemStorage, setItemShop, setItemCategory, addShop, selectValidShops, setItemUnit, setItemPackageQuantity, setItemPackageUnit, setItemShopPrice } from "./store/dataSlice";
import { Appbar, Card, Checkbox, IconButton, List, TextInput, TouchableRipple, useTheme } from "react-native-paper";
import { AvatarText } from "./AvatarText";
import { Calculator } from "./Calculator";
import { CategoryMenu } from "./CategoryMenu";
import { Keyboard, ScrollView, Text, View } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StatusBarView } from "./StatusBarView";
import { ItemShop, UnitId, units } from "./store/data/items";
import { UnitSelection } from "./UnitSelection";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import React, { useEffect, useState } from "react";
import uuid from 'react-native-uuid';

export function ItemScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Item">;
}) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [packageQuantity, setPackageQuantity] = useState<number>();
    const [showCalculator, setShowCalculator] = useState<{ visible: boolean; value?: number; unitId?: UnitId; shopId?: string }>({ visible: false });
    const [storagesExpanded, setStoragesExpanded] = useState(false);
    const [shopsExpanded, setShopsExpanded] = useState(false);
    const item = useAppSelector(selectItem(props.route.params.id))!;
    const shops = useAppSelector(selectValidShops);
    const storages = useAppSelector(state => state.data.storages);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    function handleGoBack() {
        handleTextInputNameBlur();
        handleTextInputQuantityBlur();
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

    function handleCalculatorClose(values?: { value?: number; unitId?: UnitId, state?: any; }[] | undefined): void {
        setShowCalculator({ visible: false });
        for (const value of values ?? []) {
            dispatch(setItemShopPrice({ itemId: item.id, shopId: value.state, price: value.value, unitId: value.unitId }));
        }
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

    function handleShowCalculatorPress(currentItemShop: ItemShop | undefined, shopId: string): void {
        setShowCalculator({
            visible: true,
            value: currentItemShop?.price,
            unitId: currentItemShop?.unitId,
            shopId: shopId,
        })
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

    function handleTextInputQuantityBlur(): void {
        if (item) {
            let q = quantity.trim().toLowerCase();
            let u = "";
            const pattern = new RegExp(`(\\d+)(${units.map(u => u.name.toLowerCase()).join("|")})`);
            const match = q.match(pattern);
            if (match) {
                q = match[1];
                u = match[2];
                dispatch(setItemUnit({ itemId: item.id, unitId: units.find(x => x.name.toLowerCase() === u)?.id ?? units[0].id }));
            }
            dispatch(setItemQuantity({ itemId: item.id, quantity: q }));
            setQuantity(q);
        }
    }

    function handleTextInputPackageQuantityBlur(): void {
        if (item) {
            dispatch(setItemPackageQuantity({ itemId: item.id, packageQuantity: packageQuantity }));
        }
    }

    useEffect(() => {
        setName(item?.name ?? "");
        setQuantity(item?.quantity ?? "");
        setPackageQuantity(item?.packageQuantity);
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
                    <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 8 }}>
                        <TextInput
                            label="Name"
                            mode="outlined"
                            selectTextOnFocus
                            style={{ flexGrow: 1, margin: 8 }}
                            value={name}
                            onBlur={handleTextInputNameBlur}
                            onChangeText={handleTextInputNameChange}
                        />
                        <Checkbox.Item
                            label=""
                            status={item.wanted ? "checked" : "unchecked"}
                            style={{ marginLeft: 4, marginRight: 8, marginVertical: 8 }}
                            onPress={handleCheckPress}
                        />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <TextInput
                            label="Menge"
                            mode="outlined"
                            selectTextOnFocus
                            style={{ flexGrow: 1, margin: 8 }}
                            value={quantity}
                            onBlur={handleTextInputQuantityBlur}
                            onChangeText={text => setQuantity(text)}
                        />
                        <UnitSelection
                            itemId={item.id}
                            value={item.unitId}
                            onValueChange={(itemId, unitId) => dispatch(setItemUnit({ itemId: itemId, unitId: unitId }))}
                        />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <TextInput
                            keyboardType="numeric"
                            label="Packet Menge"
                            mode="outlined"
                            selectTextOnFocus
                            style={{ flexGrow: 1, margin: 8 }}
                            value={packageQuantity?.toString() ?? ""}
                            onBlur={handleTextInputPackageQuantityBlur}
                            onChangeText={text => {
                                const n = parseInt(text.replace(/[^0-9]/g, ""));
                                setPackageQuantity(isNaN(n) ? undefined : n);
                            }}
                        />
                        <UnitSelection
                            itemId={item.id}
                            value={item.packageUnitId}
                            onValueChange={(itemId, unitId) => dispatch(setItemPackageUnit({ itemId: itemId, packageUnitId: unitId }))}
                        />
                    </View>
                    <CategoryMenu
                        categoryId={item.categoryId}
                        onSetCategory={categoryId => dispatch(setItemCategory({ itemId: item.id, categoryId: categoryId }))}
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
                            subtitle={shops.filter(x => item.shops.find(y => y.checked && (y.shopId === x.id))).map(x => x.name).join(", ")}
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
                                    const currentItemShop = item.shops.find(x => x.shopId === s.id);
                                    return (
                                        <View {...p} style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                                            {
                                                currentItemShop?.price
                                                    ?
                                                    <TouchableRipple
                                                        style={{
                                                            justifyContent: "center",
                                                            minHeight: 36,
                                                            minWidth: 64,
                                                            paddingHorizontal: 4,
                                                        }}
                                                        onPress={() => handleShowCalculatorPress(currentItemShop, s.id)}
                                                    >
                                                        <View style={{ alignItems: "center" }}>
                                                            <Text style={{ color: theme.colors.primary }}>
                                                                {`${currentItemShop.price.toString().replace(".", ",")} €`}
                                                            </Text>
                                                            {
                                                                currentItemShop.unitId
                                                                && (currentItemShop.unitId !== "pkg")
                                                                && <Text style={{ color: theme.colors.primary }}>
                                                                    {`/ ${currentItemShop.unitId}`}
                                                                </Text>
                                                            }
                                                        </View>
                                                    </TouchableRipple>
                                                    : <AvatarText
                                                        label="€"
                                                        onPress={() => handleShowCalculatorPress(currentItemShop, s.id)}
                                                    />
                                            }
                                            <Checkbox
                                                status={currentItemShop?.checked ? "checked" : "unchecked"}
                                                onPress={() => handleShopCheck(s.id, !currentItemShop?.checked)}
                                            />
                                        </View>
                                    );
                                }}
                                onPress={() => props.navigation.navigate("Shop", { id: s.id })}
                            />
                        )
                    }
                </Card>
                <Calculator
                    fields={[{ title: "Preis", value: showCalculator.value, unitId: showCalculator.unitId, state: showCalculator.shopId, selected: true }]}
                    visible={showCalculator.visible}
                    onClose={handleCalculatorClose}
                />
            </ScrollView>
        </StatusBarView>
    );
}
