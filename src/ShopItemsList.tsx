import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { JSXElementConstructor, ReactElement, useState } from "react";
import { Text, View } from "react-native";
import {
    Checkbox,
    IconButton,
    List,
    Tooltip,
    TouchableRipple,
    useTheme,
} from "react-native-paper";
import { RootStackParamList } from "../App";
import { Calculator } from "./Calculator";
import { getCalculatorFields } from "./getCalculatorFields";
import { ItemsListTitle } from "./ItemsListTitle";
import { ItemsSectionList, ItemsSectionListSection } from "./ItemsSectionList";
import { numberToString, quantityToString } from "./numberToString";
import { SummaryPriceIcon } from "./PriceIcon";
import {
    Item,
    UnitId,
    getPackageQuantityUnit,
    getUnitName,
    itemListStyle,
} from "./store/data/items";
import { Shop } from "./store/data/shops";
import {
    allShop,
    selectItemsNotWanted,
    selectItemsNotWantedWithDifferentShop,
    selectItemsNotWantedWithShop,
    selectItemsWanted,
    selectItemsWantedWithShop,
    selectItemsWantedWithoutShop,
    selectValidShops,
    setItemQuantity,
    setItemShop,
    setItemShopPackage,
    setItemShopPrice,
    setItemUnit,
    setItemWanted,
} from "./store/dataSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
    selectUiItemsList,
    setUiItemsListItems,
    setUiItemsListLatest,
    setUiItemsListLatestInArea,
    setUiItemsListWithout,
} from "./store/uiSlice";
import { withSeparator } from "./with";

export function ShopItemsList(props: {
    shop: Shop;
    stopperOff?: boolean;
    showHidden?: boolean;
}) {
    const shops = useAppSelector(selectValidShops);
    const itemsWanted = useAppSelector(selectItemsWanted);
    const itemsWantedThisShop = useAppSelector((state) =>
        selectItemsWantedWithShop(
            state,
            props.shop,
            props.showHidden,
            props.stopperOff,
        ),
    );
    const itemsWantedWithoutShop = useAppSelector(selectItemsWantedWithoutShop);
    const itemsNotWanted = useAppSelector(selectItemsNotWanted);
    const itemsNotWantedThisShop = useAppSelector((state) =>
        selectItemsNotWantedWithShop(state, props.shop, true),
    );
    const itemsNotWantedDifferentShop = useAppSelector((state) =>
        selectItemsNotWantedWithDifferentShop(state, props.shop),
    );
    const uiItemsList = useAppSelector(selectUiItemsList);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const theme = useTheme();

    const [showCalculator, setShowCalculator] = useState<{
        visible: boolean;
        item?: Item;
    }>({ visible: false });

    function handleCalculatorClose(
        values?: { value?: number; unitId?: UnitId; state?: any }[] | undefined,
    ): void {
        setShowCalculator({ visible: false });
        if (values) {
            if (values.length > 0) {
                const value = values[0];
                const item = value.state as Item;
                dispatch(
                    setItemQuantity({ itemId: item.id, quantity: value.value }),
                );
                dispatch(
                    setItemUnit({
                        itemId: item.id,
                        unitId: value.unitId ?? "-",
                    }),
                );
            }
            if (values.length > 1) {
                const value = values[1];
                const item = value.state as Item;
                dispatch(
                    setItemShopPackage({
                        itemId: item.id,
                        shopId: props.shop.id,
                        packageQuantity: value.value,
                        packageUnitId: value.unitId ?? "-",
                    }),
                );
            }
            if (values.length > 2) {
                const value = values[2];
                const item = value.state as Item;
                dispatch(
                    setItemShopPrice({
                        itemId: item.id,
                        shopId: props.shop.id,
                        price: value.value,
                    }),
                );
            }
        }
    }

    function handleItemPress(item: Item): void {
        navigation.navigate("Item", { id: item.id, shopId: props.shop.id });
    }

    function handleItemWantedPress(item: Item): void {
        dispatch(setItemWanted({ itemId: item.id, wanted: !item.wanted }));
        dispatch(
            setItemShop({
                itemId: item.id,
                shopId: props.shop.id,
                checked: true,
            }),
        );
    }

    function handleShowCalculatorPress(item: Item): void {
        setShowCalculator({
            visible: true,
            item: item,
        });
    }

    function handleRenderItem(
        item: Item,
    ): ReactElement<any, string | JSXElementConstructor<any>> | null {
        const currentItemShop = item.shops.find(
            (x) => x.shopId === props.shop.id,
        );
        const description = withSeparator(
            getPackageQuantityUnit(currentItemShop, item),
            " - ",
            item.shops
                .filter((x) => x.checked)
                .map((x) => shops.find((s) => s.id === x.shopId)?.name)
                .filter((x) => !!x)
                .join(", "),
        );

        let quantity = quantityToString(item.quantity);
        if (quantity && item.unitId) {
            quantity += ` ${getUnitName(item.unitId)}`;
        }

        let price = numberToString(currentItemShop?.price);
        if (price) {
            price += " €";
        }

        return (
            <List.Item
                title={<ItemsListTitle title={item.name} />}
                description={description ? description : undefined}
                style={itemListStyle(theme)}
                right={(p) => (
                    <View
                        style={{
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 8,
                            justifyContent: "flex-end",
                            marginLeft: 4,
                        }}
                    >
                        <QuantityPrice
                            itemId={item.id}
                            shopId={props.shop.id}
                            quantity={quantity}
                            price={price}
                            onPress={() => handleShowCalculatorPress(item)}
                        />
                        {item.wanted ? (
                            <Checkbox
                                {...p}
                                status="unchecked"
                                onPress={() => handleItemWantedPress(item)}
                            />
                        ) : (
                            <IconButton
                                {...p}
                                icon="plus-outline"
                                style={{ ...p.style, ...{ marginLeft: 0 } }}
                                onPress={() => handleItemWantedPress(item)}
                            />
                        )}
                        {!item.wanted &&
                            item.shops.find(
                                (x) => x.checked && x.shopId === props.shop.id,
                            ) && (
                                <IconButton
                                    {...p}
                                    style={{ margin: 0 }}
                                    icon="cart-minus"
                                    onPress={() =>
                                        dispatch(
                                            setItemShop({
                                                itemId: item.id,
                                                shopId: props.shop.id,
                                                checked: false,
                                            }),
                                        )
                                    }
                                />
                            )}
                        {props.shop.id !== allShop.id &&
                            !item.shops.find((x) => x.checked) &&
                            !item.shops.find(
                                (x) => x.checked && x.shopId === props.shop.id,
                            ) && (
                                <IconButton
                                    {...p}
                                    style={{ margin: 0 }}
                                    icon="cart-plus"
                                    onPress={() =>
                                        dispatch(
                                            setItemShop({
                                                itemId: item.id,
                                                shopId: props.shop.id,
                                                checked: true,
                                            }),
                                        )
                                    }
                                />
                            )}
                    </View>
                )}
                onPress={() => handleItemPress(item)}
            />
        );
    }

    const data: ItemsSectionListSection[] = [
        {
            title: "Dinge",
            icon: "cart",
            collapsed: [
                !uiItemsList.items.expanded,
                (exp) => dispatch(setUiItemsListItems({ expanded: exp })),
            ],
            data:
                props.shop.id === allShop.id
                    ? itemsWanted
                    : itemsWantedThisShop,
        },
        {
            title: "Ohne Shop",
            icon: "store-off",
            collapsed: [
                !uiItemsList.without.expanded,
                (exp) => dispatch(setUiItemsListWithout({ expanded: exp })),
            ],
            data: itemsWantedWithoutShop,
        },
    ];

    if (props.shop.id === allShop.id) {
        data.push({
            title: "Zuletzt",
            icon: "history",
            collapsed: [
                !uiItemsList.latest.expanded,
                (exp) => dispatch(setUiItemsListLatest({ expanded: exp })),
            ],
            data: itemsNotWanted,
        });
    } else {
        data.push(
            {
                title: `Zuletzt in ${props.shop?.name}`,
                icon: "history",
                collapsed: [
                    !uiItemsList.latestInArea.expanded,
                    (exp) =>
                        dispatch(setUiItemsListLatestInArea({ expanded: exp })),
                ],
                data: itemsNotWantedThisShop,
            },
            {
                title: "Zuletzt in anderen Shops",
                icon: "history",
                collapsed: [
                    !uiItemsList.latest.expanded,
                    (exp) => dispatch(setUiItemsListLatest({ expanded: exp })),
                ],
                data: itemsNotWantedDifferentShop,
            },
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ItemsSectionList
                data={data}
                renderItem={handleRenderItem}
            />
            <Calculator
                fields={getCalculatorFields(showCalculator.item, props.shop)}
                visible={showCalculator.visible}
                onClose={handleCalculatorClose}
            />
        </View>
    );
}

function QuantityPrice(props: {
    itemId: string;
    shopId: string;
    quantity: string | undefined;
    price: string | undefined;
    onPress: () => void;
}) {
    const [tooltipText, setTooltipText] = useState("Eingabe Preis und Menge");
    const theme = useTheme();

    return (
        <Tooltip title={tooltipText}>
            <TouchableRipple
                style={{
                    alignItems: "flex-end",
                    backgroundColor: theme.colors.elevation.level3,
                    borderColor: theme.colors.elevation.level3,
                    borderRadius: theme.roundness,
                    justifyContent: "center",
                    minHeight: 40,
                    minWidth: 72,
                    paddingHorizontal: 8,
                }}
                onPress={props.onPress}
            >
                <View style={{ alignItems: "flex-end" }}>
                    {props.quantity && (
                        <Text style={{ color: theme.colors.primary }}>
                            {props.quantity}
                        </Text>
                    )}
                    {props.shopId !== allShop.id && props.price && (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Text style={{ color: theme.colors.primary }}>
                                {props.price}
                            </Text>
                            <SummaryPriceIcon
                                itemId={props.itemId}
                                shopId={props.shopId}
                                onTooltipText={(text) => setTooltipText(text)}
                            />
                        </View>
                    )}
                </View>
            </TouchableRipple>
        </Tooltip>
    );
}
