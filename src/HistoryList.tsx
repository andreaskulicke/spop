import { Calculator } from "./Calculator";
import { Category } from "./store/data/categories";
import { getCalculatorFields } from "./getCalculatorFields";
import { HistoryListItem } from "./HistoryListItem";
import { Item, UnitId, replaceUnitIdIfEmpty } from "./store/data/items";
import { Keyboard, ScrollView } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import {
    selectItems,
    setItemPackageQuantity,
    setItemPackageUnit,
    setItemShopPackage,
    setItemShopPrice,
} from "./store/dataSlice";
import { Shop } from "./store/data/shops";
import { Storage } from "./store/data/storages";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import React, { useState } from "react";

export function HistoryList(props: {
    item: Item;
    category?: Category;
    shop?: Shop;
    storage?: Storage;
    onPress?: (item: Item) => void;
    onIconPress?: (
        name: string,
        quantity: number | undefined,
        unitId: UnitId | undefined,
    ) => void;
}) {
    const [showCalculator, setShowCalculator] = useState<{
        visible: boolean;
        item?: Item;
    }>({ visible: false });
    const items = useAppSelector(selectItems);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    function handleCalculatorClose(
        values?:
            | {
                  value?: number | undefined;
                  unitId?: UnitId | undefined;
                  state?: any;
              }[]
            | undefined,
    ): void {
        setShowCalculator({ visible: false });
        if (values) {
            if (values.length > 0) {
                const value = values[0];
                const item = value.state as Item;
                if (props.shop) {
                    dispatch(
                        setItemShopPackage({
                            itemId: item.id,
                            shopId: props.shop.id,
                            packageQuantity: value.value,
                            packageUnitId: value.unitId ?? "-",
                        }),
                    );
                } else {
                    dispatch(
                        setItemPackageQuantity({
                            itemId: item.id,
                            packageQuantity: value.value,
                        }),
                    );
                    dispatch(
                        setItemPackageUnit({
                            itemId: item.id,
                            packageUnitId: value.unitId ?? "-",
                        }),
                    );
                }
            }
            if (values.length > 1) {
                const value = values[1];
                const item = value.state as Item;
                dispatch(
                    setItemShopPrice({
                        itemId: item.id,
                        shopId: props.shop!.id,
                        price: value.value,
                        unitId: value.unitId,
                    }),
                );
            }
        }
    }

    function handleLongPressExisting(item: Item): void {
        navigation.navigate("Item", {
            id: item.id,
            shopId: props.shop?.id,
            storageId: props.storage?.id,
        });
    }

    function handleLongPressNew(item: Item): void {
        props.onPress?.(item);
        navigation.navigate("Item", {
            id: item.id,
            shopId: props.shop?.id,
            storageId: props.storage?.id,
        });
    }

    function handleCalculatorPress(item: Item): void {
        Keyboard.dismiss();
        setShowCalculator({ visible: true, item: { ...item } });
    }

    function transformToSearchName(name: string): string {
        return name
            .toLowerCase()
            .replace("ä", "a")
            .replace("ö", "o")
            .replace("ü", "u")
            .replace("ß", "s");
    }

    const itemName = transformToSearchName(props.item.name);

    return (
        <ScrollView keyboardShouldPersistTaps="always">
            {props.item.name &&
                !items.find(
                    (x) => transformToSearchName(x.name) === itemName,
                ) && (
                    <HistoryListItem
                        item={props.item}
                        onPress={props.onPress}
                        onLongPress={handleLongPressNew}
                        onIconPress={props.onIconPress}
                    />
                )}
            {items
                .filter((x) => transformToSearchName(x.name).includes(itemName))
                .sort((a, b) => {
                    if (props.storage) {
                        const aa = a.storages.find(
                            (x) => x.storageId === props.storage!.id,
                        )
                            ? 1
                            : 0;
                        const bb = b.storages.find(
                            (x) => x.storageId === props.storage!.id,
                        )
                            ? 1
                            : 0;
                        return bb - aa;
                    }
                    if (props.category) {
                        const aa = a.categoryId === props.category.id ? 1 : 0;
                        const bb = b.categoryId === props.category.id ? 1 : 0;
                        return bb - aa;
                    }
                    if (props.shop) {
                        const aa = a.shops.find(
                            (x) => x.shopId === props.shop!.id,
                        )
                            ? 1
                            : 0;
                        const bb = b.shops.find(
                            (x) => x.shopId === props.shop!.id,
                        )
                            ? 1
                            : 0;
                        return bb - aa;
                    }
                    return 0;
                })
                .sort((a, b) => a.name.length - b.name.length)
                .map((x) => (
                    <HistoryListItem
                        key={x.id}
                        item={{
                            ...x,
                            quantity: props.item.quantity,
                            unitId: replaceUnitIdIfEmpty(
                                props.item.unitId,
                                x.unitId,
                            ),
                        }}
                        originalItem={x}
                        shopId={props.shop?.id}
                        onPress={props.onPress}
                        onLongPress={handleLongPressExisting}
                        onCalculatorPress={handleCalculatorPress}
                        onIconPress={props.onIconPress}
                    />
                ))}
            <Calculator
                fields={getCalculatorFields(
                    showCalculator.item,
                    props.shop,
                ).slice(1)}
                visible={showCalculator.visible}
                onClose={handleCalculatorClose}
            />
        </ScrollView>
    );
}
