import {
    allStorage,
    selectItemsNotWanted,
    selectItemsNotWantedWithDifferentStorage,
    selectItemsNotWantedWithStorage,
    selectItemsWanted,
    selectItemsWantedWithStorage,
    selectItemsWantedWithoutStorage,
    selectStorages,
    setItemPackageQuantity,
    setItemPackageUnit,
    setItemQuantity,
    setItemStorage,
    setItemUnit,
    setItemWanted,
} from "./store/dataSlice";
import { Calculator } from "./Calculator";
import { getCalculatorFields } from "./getCalculatorFields";
import {
    Item,
    UnitId,
    getPackageQuantityUnit,
    getUnitName,
    itemListStyle,
} from "./store/data/items";
import { ItemsSectionList, ItemsSectionListSection } from "./ItemsSectionList";
import {
    List,
    IconButton,
    useTheme,
    TouchableRipple,
} from "react-native-paper";
import { quantityToString } from "./numberToString";
import { RootStackParamList } from "../App";
import {
    selectUiItemsList,
    setUiItemsListItems,
    setUiItemsListLatest,
    setUiItemsListLatestInArea,
    setUiItemsListWithout,
} from "./store/uiSlice";
import { Storage } from "./store/data/storages";
import { Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { withSeparator } from "./with";
import React, { JSXElementConstructor, ReactElement, useState } from "react";
import { ItemsListTitle } from "./ItemsListTitle";

export function StorageItemsList(props: {
    storage: Storage;
    selectedItemId?: string;
}) {
    const storages = useAppSelector(selectStorages);
    const itemsWanted = useAppSelector(selectItemsWanted);
    const itemsWantedThisStorage = useAppSelector((state) =>
        selectItemsWantedWithStorage(state, props.storage.id),
    );
    const itemsWantedWithoutStorage = useAppSelector(
        selectItemsWantedWithoutStorage,
    );
    const itemsNotWanted = useAppSelector(selectItemsNotWanted);
    const itemsNotWantedThisStorage = useAppSelector((state) =>
        selectItemsNotWantedWithStorage(state, props.storage.id),
    );
    const itemsNotWantedDifferentStorage = useAppSelector((state) =>
        selectItemsNotWantedWithDifferentStorage(state, props.storage.id),
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
        const description = withSeparator(
            getPackageQuantityUnit(item),
            " - ",
            item.storages
                .map((x) => storages.find((s) => s.id === x.storageId)?.name)
                .filter((x) => !!x)
                .join(", "),
        );

        let quantity = quantityToString(item.quantity);
        if (quantity && item.unitId) {
            quantity += ` ${getUnitName(item.unitId)}`;
        }

        return (
            <List.Item
                title={<ItemsListTitle title={item.name} />}
                description={description ? description : undefined}
                style={itemListStyle(theme)}
                right={(p) => (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 8,
                        }}
                    >
                        <TouchableRipple
                            style={{
                                justifyContent: "center",
                                minHeight: 40,
                                minWidth: 80,
                                paddingHorizontal: 8,

                                alignItems: "flex-end",
                                backgroundColor: theme.colors.elevation.level3,
                                borderColor: theme.colors.elevation.level3,
                                borderRadius: theme.roundness,
                            }}
                            onPress={() => handleShowCalculatorPress(item)}
                        >
                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={{ color: theme.colors.primary }}>
                                    {quantity}
                                </Text>
                            </View>
                        </TouchableRipple>
                        <IconButton
                            icon={item.wanted ? "minus-thick" : "plus-outline"}
                            style={{ ...p.style, ...{ marginLeft: 0 } }}
                            onPress={() => {
                                dispatch(
                                    setItemWanted({
                                        itemId: item.id,
                                        wanted: !item.wanted,
                                    }),
                                );
                                dispatch(
                                    setItemStorage({
                                        itemId: item.id,
                                        storageId: props.storage.id,
                                        checked: true,
                                    }),
                                );
                            }}
                        />
                        {!item.wanted &&
                            item.storages.find(
                                (x) => x.storageId === props.storage.id,
                            ) && (
                                <IconButton
                                    {...p}
                                    style={{ margin: 0 }}
                                    icon="home-minus-outline"
                                    onPress={() =>
                                        dispatch(
                                            setItemStorage({
                                                itemId: item.id,
                                                storageId: props.storage.id,
                                                checked: false,
                                            }),
                                        )
                                    }
                                />
                            )}
                        {props.storage.id !== allStorage.id &&
                            !item.storages.find(
                                (x) => x.storageId === props.storage.id,
                            ) && (
                                <IconButton
                                    {...p}
                                    style={{ margin: 0 }}
                                    icon="home-plus-outline"
                                    onPress={() =>
                                        dispatch(
                                            setItemStorage({
                                                itemId: item.id,
                                                storageId: props.storage.id,
                                                checked: true,
                                            }),
                                        )
                                    }
                                />
                            )}
                    </View>
                )}
                onPress={() =>
                    navigation.navigate("Item", {
                        id: item.id,
                        storageId: props.storage.id,
                    })
                }
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
                props.storage.id === allStorage.id
                    ? itemsWanted
                    : itemsWantedThisStorage,
        },
        {
            title: "Ohne Vorratsort",
            icon: "home-remove-outline",
            collapsed: [
                !uiItemsList.without.expanded,
                (exp) => dispatch(setUiItemsListWithout({ expanded: exp })),
            ],
            data: itemsWantedWithoutStorage,
        },
    ];

    if (props.storage.id === allStorage.id) {
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
                title: `Zuletzt in ${props.storage?.name}`,
                icon: "history",
                collapsed: [
                    !uiItemsList.latestInArea.expanded,
                    (exp) =>
                        dispatch(setUiItemsListLatestInArea({ expanded: exp })),
                ],
                data: itemsNotWantedThisStorage,
            },
            {
                title: "Zuletzt in anderen Vorratsorten",
                icon: "history",
                collapsed: [
                    !uiItemsList.latest.expanded,
                    (exp) => dispatch(setUiItemsListLatest({ expanded: exp })),
                ],
                data: itemsNotWantedDifferentStorage,
            },
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ItemsSectionList
                data={data}
                renderItem={handleRenderItem}
                selectedItemId={props.selectedItemId}
            />
            <Calculator
                fields={getCalculatorFields(showCalculator.item)}
                visible={showCalculator.visible}
                onClose={handleCalculatorClose}
            />
        </View>
    );
}
