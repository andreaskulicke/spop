import {
    addStorage,
    setItemWanted,
    deleteItem,
    selectItem,
    setItemQuantity,
    setItemName,
    setItemStorage,
    setItemShop,
    setItemCategory,
    addShop,
    selectValidShops,
    setItemUnit,
    setItemPackageQuantity,
    setItemPackageUnit,
    setItemShopPrice,
    setItemNotes,
    setItemShopPackage,
    selectStorages,
} from "./store/dataSlice";
import {
    Appbar,
    Card,
    Checkbox,
    IconButton,
    List,
    TextInput,
    TouchableRipple,
    useTheme,
} from "react-native-paper";
import { AvatarText } from "./AvatarText";
import { Calculator } from "./Calculator";
import { CategoryMenu } from "./CategoryMenu";
import {
    Item,
    ItemShop,
    PriceData,
    UnitId,
    formatPrice,
    getNormalizedPrice,
    getPackagePrice,
    getPackageUnit,
    getQuantityUnit,
} from "./store/data/items";
import {
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    View,
} from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { numberToString, stringToNumber } from "./numberToString";
import { PriceIcon } from "./PriceIcon";
import { RootStackParamList } from "../App";
import { Shop } from "./store/data/shops";
import { StatusBarView } from "./StatusBarView";
import { UnitSelection } from "./UnitSelection";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import React, { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import { withPrefix } from "./with";
import { setUiUndo } from "./store/uiSlice";

type CalculatorCallSource = "quantity" | "packageQuantity" | "shop";

export function ItemScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Item">;
}) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState<string>();
    const [packageQuantity, setPackageQuantity] = useState<string>();
    const [notes, setNotes] = useState<string>();
    const [showCalculator, setShowCalculator] = useState<{
        visible: boolean;
        value?: number;
        unitId?: UnitId;
        packageValue?: number;
        packageUnitId?: UnitId;
        shop?: Shop;
        source?: CalculatorCallSource;
    }>({ visible: false });
    const [storagesExpanded, setStoragesExpanded] = useState(
        !!props.route.params.storageId,
    );
    const [shopsExpanded, setShopsExpanded] = useState(
        !!props.route.params.shopId,
    );
    const item = useAppSelector((state) =>
        selectItem(state, props.route.params.id),
    )!;
    const shops = useAppSelector(selectValidShops);
    const storages = useAppSelector(selectStorages);
    const dispatch = useAppDispatch();

    function handleGoBack() {
        handleTextInputNameBlur();
        handleTextInputQuantityBlur();
        handleTextInputPackageQuantityBlur();
        handleTextInputNotesBlur();
        props.navigation.goBack();
    }

    function handleDeletePress(): void {
        dispatch(setUiUndo("UNDO_DATA"));
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
        dispatch(
            setItemStorage({ itemId: item.id, storageId: id, checked: true }),
        );
        props.navigation.navigate("Storage", { id });
    }

    function handleCalculatorClose(
        values?: { value?: number; unitId?: UnitId; state?: any }[] | undefined,
    ): void {
        setShowCalculator({ visible: false });
        if (values && values.length > 0) {
            const value0 = values[0];
            const value1 = values[1];
            const source = value0.state.source as CalculatorCallSource;
            if (source === "quantity") {
                dispatch(
                    setItemQuantity({
                        itemId: item.id,
                        quantity: value0.value,
                    }),
                );
                dispatch(
                    setItemUnit({
                        itemId: item.id,
                        unitId: value0.unitId ?? "-",
                    }),
                );
            } else if (source === "packageQuantity") {
                dispatch(
                    setItemPackageQuantity({
                        itemId: item.id,
                        packageQuantity: value0.value,
                    }),
                );
                dispatch(
                    setItemPackageUnit({
                        itemId: item.id,
                        packageUnitId: value0.unitId ?? "-",
                    }),
                );
            } else if (source === "shop") {
                dispatch(
                    setItemShopPackage({
                        itemId: item.id,
                        shopId: value0.state.shop.id,
                        packageQuantity: value0.value,
                        packageUnitId: value0.unitId,
                    }),
                );
                dispatch(
                    setItemShopPrice({
                        itemId: item.id,
                        shopId: value1.state.shop.id,
                        price: value1.value,
                    }),
                );
            }
        }
    }

    function handleShopCheck(shopId: string, checked: boolean): void {
        dispatch(
            setItemShop({ itemId: item.id, shopId: shopId, checked: checked }),
        );
    }

    function handleStorageCheck(storageId: string, checked: boolean): void {
        dispatch(
            setItemStorage({
                itemId: item.id,
                storageId: storageId,
                checked: checked,
            }),
        );
    }

    function handleCheckPress(): void {
        Keyboard.dismiss();
        dispatch(setItemWanted({ itemId: item.id, wanted: !item.wanted }));
    }

    function handleShowCalculatorPricePress(
        currentItemShop: ItemShop | undefined,
        shop: Shop,
    ): void {
        setShowCalculator({
            visible: true,
            value: currentItemShop?.price,
            packageValue: currentItemShop?.packageQuantity,
            packageUnitId: getPackageUnit(
                currentItemShop?.packageUnitId,
                item.packageUnitId,
            ).id,
            shop: shop,
            source: "shop",
        });
    }

    function handleShowCalculatorQuantityPress(
        value: number | undefined,
        unitId: UnitId | undefined,
        source: CalculatorCallSource,
    ): void {
        setShowCalculator({
            visible: true,
            value: value,
            unitId: unitId,
            source: source,
        });
    }

    function handleTextInputNameBlur(): void {
        if (item) {
            const n = name.trim();
            if (n) {
                dispatch(setItemName({ itemId: item.id, name: n }));
                setName(n);
            }
        }
    }

    function handleTextInputNameChange(text: string): void {
        setName(text);
    }

    function handleTextInputQuantityBlur(): void {
        if (item) {
            const q = stringToNumber(quantity);
            if (q === 0) {
                setQuantity("");
            } else {
                dispatch(
                    setItemQuantity({
                        itemId: item.id,
                        quantity: q,
                    }),
                );
            }
        }
    }

    function handleTextInputPackageQuantityBlur(): void {
        if (item) {
            const pq = stringToNumber(packageQuantity);
            if (pq === 0) {
                setPackageQuantity("");
            } else {
                dispatch(
                    setItemPackageQuantity({
                        itemId: item.id,
                        packageQuantity: pq,
                    }),
                );
            }
        }
    }

    function handleTextInputNotesBlur(): void {
        if (item) {
            dispatch(setItemNotes({ itemId: item.id, notes: notes }));
        }
    }

    function transformQuantity(text: string): string {
        let newText = text
            .replace(/[^0-9,\.]/g, "")
            .replace(/^0/, "")
            .replace(".", ",");
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
    }, [item]);

    const calculatorFields: React.ComponentProps<typeof Calculator>["fields"] =
        [];
    if (showCalculator.source === "shop") {
        calculatorFields.push({
            title: `Paket Menge${withPrefix(" - ", getQuantityUnit(item.packageQuantity, item.packageUnitId))}`,
            value: showCalculator.packageValue,
            unitId: showCalculator.packageUnitId,
            state: {
                source: showCalculator.source,
                shop: showCalculator.shop,
            },
            type: "quantity",
        });
    }
    calculatorFields.push({
        title:
            showCalculator.source === "shop"
                ? `Preis - ${showCalculator.shop?.name}`
                : "Menge",
        value: showCalculator.value,
        unitId: showCalculator.unitId,
        state: {
            source: showCalculator.source,
            shop: showCalculator.shop,
        },
        type: showCalculator.source === "shop" ? "price" : "quantity",
        selected: true,
    });

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title={item?.name ?? "Item"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                <ScrollView>
                    <Card style={{ margin: 8 }}>
                        <Card.Title title="Allgemein" />
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingRight: 8,
                            }}
                        >
                            <TextInput
                                label="Name"
                                mode="outlined"
                                selectTextOnFocus
                                style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    margin: 8,
                                }}
                                value={name}
                                onBlur={handleTextInputNameBlur}
                                onChangeText={handleTextInputNameChange}
                            />
                            <Checkbox.Item
                                label=""
                                status={item.wanted ? "checked" : "unchecked"}
                                style={{
                                    marginLeft: 4,
                                    marginRight: 8,
                                    marginVertical: 8,
                                }}
                                onPress={handleCheckPress}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <TextInput
                                keyboardType="numeric"
                                label="Menge"
                                mode="outlined"
                                selectTextOnFocus
                                style={{ flexGrow: 1, margin: 8 }}
                                value={quantity}
                                onBlur={handleTextInputQuantityBlur}
                                onChangeText={(text) =>
                                    setQuantity(transformQuantity(text))
                                }
                            />
                            <UnitSelection
                                itemId={item.id}
                                value={item.unitId}
                                onValueChange={(itemId, unitId) =>
                                    dispatch(
                                        setItemUnit({
                                            itemId: itemId,
                                            unitId: unitId,
                                        }),
                                    )
                                }
                            />
                            <IconButton
                                icon="calculator"
                                size={32}
                                style={{
                                    marginLeft: 14,
                                    marginRight: 26,
                                    marginVertical: 8,
                                }}
                                onPress={() =>
                                    handleShowCalculatorQuantityPress(
                                        stringToNumber(quantity),
                                        item.unitId,
                                        "quantity",
                                    )
                                }
                            />
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                keyboardType="numeric"
                                label="Paket Menge"
                                mode="outlined"
                                selectTextOnFocus
                                style={{ flexGrow: 1, margin: 8 }}
                                value={packageQuantity}
                                onBlur={handleTextInputPackageQuantityBlur}
                                onChangeText={(text) =>
                                    setPackageQuantity(transformQuantity(text))
                                }
                            />
                            <UnitSelection
                                itemId={item.id}
                                value={item.packageUnitId}
                                onValueChange={(itemId, unitId) =>
                                    dispatch(
                                        setItemPackageUnit({
                                            itemId: itemId,
                                            packageUnitId: unitId,
                                        }),
                                    )
                                }
                            />
                            <IconButton
                                icon="calculator"
                                size={32}
                                style={{
                                    marginLeft: 14,
                                    marginRight: 26,
                                    marginVertical: 8,
                                }}
                                onPress={() =>
                                    handleShowCalculatorQuantityPress(
                                        stringToNumber(packageQuantity),
                                        item.packageUnitId,
                                        "packageQuantity",
                                    )
                                }
                            />
                        </View>
                        <CategoryMenu
                            categoryId={item.categoryId}
                            onSetCategory={(categoryId) =>
                                dispatch(
                                    setItemCategory({
                                        itemId: item.id,
                                        categoryId: categoryId,
                                    }),
                                )
                            }
                        />
                        <TextInput
                            label="Notizen"
                            mode="outlined"
                            multiline
                            scrollEnabled
                            style={{ flexGrow: 1, margin: 8 }}
                            value={notes}
                            onBlur={handleTextInputNotesBlur}
                            onChangeText={(text) => setNotes(text)}
                        />
                    </Card>
                    <Card style={{ margin: 8 }}>
                        <TouchableRipple
                            onPress={() => setStoragesExpanded((x) => !x)}
                        >
                            <Card.Title
                                title="Vorratsorte"
                                subtitle={storages
                                    .filter((x) =>
                                        item.storages.find(
                                            (y) => y.storageId === x.id,
                                        ),
                                    )
                                    .map((x) => x.name)
                                    .join(", ")}
                                right={(p) => (
                                    <View style={{ flexDirection: "row" }}>
                                        <IconButton
                                            {...p}
                                            icon="plus-outline"
                                            onPress={handleAddStoragePress}
                                        />
                                        <IconButton
                                            {...p}
                                            icon={
                                                storagesExpanded
                                                    ? "chevron-up"
                                                    : "chevron-down"
                                            }
                                            onPress={() =>
                                                setStoragesExpanded((x) => !x)
                                            }
                                        />
                                    </View>
                                )}
                            />
                        </TouchableRipple>
                        {storagesExpanded &&
                            storages.map((s) => {
                                return (
                                    <List.Item
                                        key={s.id}
                                        title={s.name}
                                        right={(p) => {
                                            const checked = item.storages.find(
                                                (x) => x.storageId === s.id,
                                            );
                                            return (
                                                <Checkbox
                                                    {...p}
                                                    status={
                                                        checked
                                                            ? "checked"
                                                            : "unchecked"
                                                    }
                                                    onPress={() =>
                                                        handleStorageCheck(
                                                            s.id,
                                                            !checked,
                                                        )
                                                    }
                                                />
                                            );
                                        }}
                                        onPress={() =>
                                            props.navigation.navigate(
                                                "Storage",
                                                { id: s.id },
                                            )
                                        }
                                    />
                                );
                            })}
                    </Card>
                    <Card style={{ margin: 8 }}>
                        <TouchableRipple
                            onPress={() => setShopsExpanded((x) => !x)}
                        >
                            <Card.Title
                                title="Shops"
                                subtitle={shops
                                    .filter((x) =>
                                        item.shops.find(
                                            (y) =>
                                                y.checked && y.shopId === x.id,
                                        ),
                                    )
                                    .map((x) => x.name)
                                    .join(", ")}
                                right={(p) => (
                                    <View style={{ flexDirection: "row" }}>
                                        <IconButton
                                            {...p}
                                            icon="plus-outline"
                                            onPress={handleAddShopPress}
                                        />
                                        <IconButton
                                            {...p}
                                            icon={
                                                shopsExpanded
                                                    ? "chevron-up"
                                                    : "chevron-down"
                                            }
                                            onPress={() =>
                                                setShopsExpanded((x) => !x)
                                            }
                                        />
                                    </View>
                                )}
                            />
                        </TouchableRipple>
                        {shopsExpanded &&
                            shops.map((s) => (
                                <List.Item
                                    key={s.id}
                                    title={s.name}
                                    right={(p) => {
                                        const currentItemShop = item.shops.find(
                                            (x) => x.shopId === s.id,
                                        );
                                        return (
                                            <View
                                                {...p}
                                                style={{
                                                    flexDirection: "row",
                                                    gap: 8,
                                                    alignItems: "center",
                                                }}
                                            >
                                                {currentItemShop?.price ? (
                                                    <TouchableRipple
                                                        style={{
                                                            justifyContent:
                                                                "center",
                                                            minHeight: 36,
                                                            minWidth: 64,
                                                            paddingHorizontal: 4,
                                                        }}
                                                        onPress={() =>
                                                            handleShowCalculatorPricePress(
                                                                currentItemShop,
                                                                s,
                                                            )
                                                        }
                                                    >
                                                        <View
                                                            style={{
                                                                alignItems:
                                                                    "flex-end",
                                                            }}
                                                        >
                                                            <Price
                                                                itemShop={
                                                                    currentItemShop
                                                                }
                                                                item={item}
                                                                priceData={getPackagePrice(
                                                                    currentItemShop,
                                                                    item,
                                                                )}
                                                            />
                                                            {item.packageQuantity && (
                                                                <Price
                                                                    itemShop={
                                                                        currentItemShop
                                                                    }
                                                                    item={item}
                                                                    normalized
                                                                    priceData={getNormalizedPrice(
                                                                        currentItemShop,
                                                                        item,
                                                                    )}
                                                                />
                                                            )}
                                                        </View>
                                                    </TouchableRipple>
                                                ) : (
                                                    <AvatarText
                                                        label="€"
                                                        onPress={() =>
                                                            handleShowCalculatorPricePress(
                                                                currentItemShop,
                                                                s,
                                                            )
                                                        }
                                                    />
                                                )}
                                                <Checkbox
                                                    status={
                                                        currentItemShop?.checked
                                                            ? "checked"
                                                            : "unchecked"
                                                    }
                                                    onPress={() =>
                                                        handleShopCheck(
                                                            s.id,
                                                            !currentItemShop?.checked,
                                                        )
                                                    }
                                                />
                                            </View>
                                        );
                                    }}
                                    onPress={() =>
                                        props.navigation.navigate("Shop", {
                                            id: s.id,
                                        })
                                    }
                                />
                            ))}
                    </Card>
                    <Calculator
                        fields={calculatorFields}
                        visible={showCalculator.visible}
                        onClose={handleCalculatorClose}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </StatusBarView>
    );
}

function Price(props: {
    itemShop: ItemShop;
    item: Item;
    normalized?: boolean;
    priceData: PriceData;
}) {
    const theme = useTheme();

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Text style={{ color: theme.colors.primary }}>
                {formatPrice(props.priceData)}
            </Text>
            <PriceIcon
                itemId={props.item.id}
                shopId={props.itemShop.shopId}
                normalized={props.normalized}
            />
        </View>
    );
}
