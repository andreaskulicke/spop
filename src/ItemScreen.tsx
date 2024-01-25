import { addStorage, setItemWanted, deleteItem, selectItem, setItemQuantity, setItemName, setItemStorage, setItemShop, setItemCategory, addShop, selectValidShops, setItemUnit, setItemPackageQuantity, setItemPackageUnit, setItemShopPrice, setItemNotes } from "./store/dataSlice";
import { Appbar, Card, Checkbox, IconButton, List, TextInput, TouchableRipple, useTheme } from "react-native-paper";
import { AvatarText } from "./AvatarText";
import { Calculator } from "./Calculator";
import { CategoryMenu } from "./CategoryMenu";
import { ItemShop, UnitId } from "./store/data/items";
import { Keyboard, KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { numberToString, stringToNumber } from "./numberToString";
import { PriceIcon } from "./PriceIcon";
import { RootStackParamList } from "../App";
import { Shop } from "./store/data/shops";
import { StatusBarView } from "./StatusBarView";
import { UnitSelection } from "./UnitSelection";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import React, { useEffect, useState } from "react";
import uuid from 'react-native-uuid';

type CalculatorCallSource = "quantity" | "packageQuantity" | "shop";

export function ItemScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Item">;
}) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState<string>();
    const [packageQuantity, setPackageQuantity] = useState<string>();
    const [notes, setNotes] = useState<string>();
    const [showCalculator, setShowCalculator] = useState<
        {
            visible: boolean;
            value?: number;
            unitId?: UnitId;
            shop?: Shop;
            source?: CalculatorCallSource;
        }
    >({ visible: false });
    const [storagesExpanded, setStoragesExpanded] = useState(!!props.route.params.storageId);
    const [shopsExpanded, setShopsExpanded] = useState(!!props.route.params.shopId);
    const item = useAppSelector(selectItem(props.route.params.id))!;
    const shops = useAppSelector(selectValidShops);
    const storages = useAppSelector(state => state.data.storages);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    function handleGoBack() {
        handleTextInputNameBlur();
        handleTextInputQuantityBlur();
        handleTextInputPackageQuantityBlur();
        handleTextInputNotesBlur();
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
        if (values && (values.length > 0)) {
            const value = values[0];
            const source = value.state.source as CalculatorCallSource;
            if (source === "quantity") {
                dispatch(setItemQuantity({ itemId: item.id, quantity: value.value }));
                dispatch(setItemUnit({ itemId: item.id, unitId: value.unitId ?? "-" }));
            } else if (source === "packageQuantity") {
                dispatch(setItemPackageQuantity({ itemId: item.id, packageQuantity: value.value }));
                dispatch(setItemPackageUnit({ itemId: item.id, packageUnitId: value.unitId ?? "-" }));
            } else {
                dispatch(setItemShopPrice({ itemId: item.id, shopId: value.state.shop.id, price: value.value, unitId: value.unitId }));
            }
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

    function handleShowCalculatorPricePress(currentItemShop: ItemShop | undefined, shop: Shop): void {
        setShowCalculator({
            visible: true,
            value: currentItemShop?.price,
            unitId: currentItemShop?.unitId,
            shop: shop,
            source: "shop",
        });
    }

    function handleShowCalculatorQuantityPress(value: number | undefined, unitId: UnitId | undefined, source: CalculatorCallSource): void {
        setShowCalculator({
            visible: true,
            value: value,
            unitId: unitId,
            source: source,
        });
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
            dispatch(setItemQuantity({ itemId: item.id, quantity: stringToNumber(quantity) }));
        }
    }

    function handleTextInputPackageQuantityBlur(): void {
        if (item) {
            dispatch(setItemPackageQuantity({ itemId: item.id, packageQuantity: stringToNumber(packageQuantity) }));
        }
    }

    function handleTextInputNotesBlur(): void {
        if (item) {
            dispatch(setItemNotes({ itemId: item.id, notes: notes }));
        }
    }

    function transformQuantity(text: string): string {
        let newText = text.replace(/[^0-9,\.]/g, "").replace(".", ",");
        if (newText.endsWith(",")) {
            newText = newText.replaceAll(",", "") + ",";
        }
        return newText;
    }

    useEffect(() => {
        const s = Keyboard.addListener("keyboardDidHide", () => {
            handleTextInputNameBlur();
            handleTextInputQuantityBlur();
            handleTextInputPackageQuantityBlur();
            handleTextInputNotesBlur();
        });
        return () => s.remove();
    });

    useEffect(() => {
        setName(item?.name ?? "");
        setQuantity(numberToString(item?.quantity));
        setPackageQuantity(numberToString(item?.packageQuantity));
        setNotes(item.notes);
    }, [item])

    return (
        <StatusBarView bottomPadding>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title={item?.name ?? "Item"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <KeyboardAvoidingView
                behavior="height"
                style={{ flex: 1 }}
            >
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
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TextInput
                                keyboardType="numeric"
                                label="Menge"
                                mode="outlined"
                                selectTextOnFocus
                                style={{ flexGrow: 1, margin: 8 }}
                                value={quantity}
                                onBlur={handleTextInputQuantityBlur}
                                onChangeText={text => setQuantity(transformQuantity(text))}
                            />
                            <UnitSelection
                                itemId={item.id}
                                value={item.unitId}
                                onValueChange={(itemId, unitId) => dispatch(setItemUnit({ itemId: itemId, unitId: unitId }))}
                            />
                            <IconButton
                                icon="calculator"
                                size={32}
                                style={{ marginLeft: 14, marginRight: 26, marginVertical: 8 }}
                                onPress={() => handleShowCalculatorQuantityPress(stringToNumber(quantity), item.unitId, "quantity")}
                            />
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                keyboardType="numeric"
                                label="Packet Menge"
                                mode="outlined"
                                selectTextOnFocus
                                style={{ flexGrow: 1, margin: 8 }}
                                value={packageQuantity}
                                onBlur={handleTextInputPackageQuantityBlur}
                                onChangeText={text => setPackageQuantity(transformQuantity(text))}
                            />
                            <UnitSelection
                                itemId={item.id}
                                value={item.packageUnitId}
                                onValueChange={(itemId, unitId) => dispatch(setItemPackageUnit({ itemId: itemId, packageUnitId: unitId }))}
                            />
                            <IconButton
                                icon="calculator"
                                size={32}
                                style={{ marginLeft: 14, marginRight: 26, marginVertical: 8 }}
                                onPress={() => handleShowCalculatorQuantityPress(stringToNumber(packageQuantity), item.packageUnitId, "packageQuantity")}
                            />
                        </View>
                        <CategoryMenu
                            categoryId={item.categoryId}
                            onSetCategory={categoryId => dispatch(setItemCategory({ itemId: item.id, categoryId: categoryId }))}
                        />
                        <TextInput
                            label="Notizen"
                            mode="outlined"
                            multiline
                            scrollEnabled
                            selectTextOnFocus
                            style={{ flexGrow: 1, margin: 8 }}
                            value={notes}
                            onBlur={handleTextInputNotesBlur}
                            onChangeText={text => setNotes(text)}
                        />
                    </Card>
                    <Card
                        style={{ margin: 8 }}
                    >
                        <TouchableRipple
                            onPress={() => setStoragesExpanded(x => !x)}
                        >
                            <Card.Title
                                title="Vorratsorte"
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
                                                        ? <TouchableRipple
                                                            style={{
                                                                justifyContent: "center",
                                                                minHeight: 36,
                                                                minWidth: 64,
                                                                paddingHorizontal: 4,
                                                            }}
                                                            onPress={() => handleShowCalculatorPricePress(currentItemShop, s)}
                                                        >
                                                            <View style={{ alignItems: "center" }}>
                                                                <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                                                                    <Text style={{ color: theme.colors.primary }}>
                                                                        {`${numberToString(currentItemShop.price)} €`}
                                                                    </Text>
                                                                    <PriceIcon
                                                                        itemId={item.id}
                                                                        shopId={currentItemShop.shopId}
                                                                    />
                                                                </View>
                                                                {
                                                                    currentItemShop.unitId
                                                                    && (currentItemShop.unitId !== "-")
                                                                    && (currentItemShop.unitId !== "pkg")
                                                                    && <Text style={{ color: theme.colors.primary }}>
                                                                        {`/ ${currentItemShop.unitId}`}
                                                                    </Text>
                                                                }
                                                            </View>
                                                        </TouchableRipple>
                                                        : <AvatarText
                                                            label="€"
                                                            onPress={() => handleShowCalculatorPricePress(currentItemShop, s)}
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
                        fields={[
                            {
                                title: ((showCalculator.source === "shop") ? `Preis - ${showCalculator.shop?.name}` : "Menge"),
                                value: showCalculator.value,
                                unitId: showCalculator.unitId,
                                state:
                                {
                                    source: showCalculator.source,
                                    shop: showCalculator.shop,
                                },
                                type: ((showCalculator.source === "shop") ? "price" : "quantity"),
                                selected: true,
                            }]}
                        visible={showCalculator.visible}
                        onClose={handleCalculatorClose}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </StatusBarView>
    );
}
