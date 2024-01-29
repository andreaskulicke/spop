import { addItem, allStorage, allShop, selectItems, selectItemByName } from './store/dataSlice';
import { Button, Divider, List, Modal, Portal, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Calculator } from './Calculator';
import { Category, emptyCategory } from './store/data/categories';
import { HistoryList } from './HistoryList';
import { Item, UnitId, addQuantityUnit, getQuantityUnit } from './store/data/items';
import { Keyboard, KeyboardAvoidingView, View } from 'react-native';
import { modalContainerStyle, modalViewStyle } from './styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { parseQuantityUnit, quantityToString } from './numberToString';
import { RootStackParamList } from '../App';
import { SearchBar } from './SearchBar';
import { Shop } from './store/data/shops';
import { Storage } from './store/data/storages';
import { useAppDispatch, useAppSelector } from './store/hooks';
import React, { useEffect, useState } from 'react';
import uuid from 'react-native-uuid';

export function SearchBarList(props: {
    list: React.ReactNode;
    category?: Category;
    shop?: Shop;
    storage?: Storage;
    onItemPress?: (itemId: string) => void;
}) {
    const categoryId = (!props.category || props.category.id === emptyCategory.id) ? undefined : props.category.id;

    const [filter, setFilter] = useState<{ text: string; name?: string; quantity?: string; }>();
    const [newItem, setNewItem] = useState<Item>({
        id: uuid.v4() as string,
        name: "",
        quantity: undefined,
        categoryId: categoryId,
        shops: (!props.shop || (props.shop.id === allShop.id)) ? [] : [{ checked: true, shopId: props.shop.id }],
        storages: (!props.storage || (props.storage.id === allStorage.id)) ? [] : [{ storageId: props.storage.id }],
    });
    const items = useAppSelector(selectItems);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [adder, setAdder] = useState<{ visible: boolean, item?: Item }>({ visible: false });

    function addNewItem(item: Item): void {
        dispatch(addItem(
            {
                item: item,
                shop: props.shop,
                storage: props.storage,
            }));
        setFilter(undefined);
        setNewItem(v => ({ ...v, id: uuid.v4() as string }));
        props.onItemPress?.(item.id);
    }

    function handleAdderClose(item?: Item): void {
        setAdder({ visible: false });
        if (item) {
            addNewItem({ ...item, categoryId: categoryId ?? item.categoryId });
        }
    }

    function handlePress(item: Item): void {
        if (item?.name) {
            const originalItem = items.find(x => x.name.toLowerCase() === item.name.trim().toLowerCase());
            if (originalItem?.wanted) {
                Keyboard.dismiss();
                setAdder({ visible: true, item: item });
            } else {
                const [q, u] = parseQuantityUnit(filter?.quantity);
                addNewItem({ ...item, categoryId: categoryId ?? item.categoryId, quantity: q, unitId: u });
            }
        }
    }

    function handleIconPress(name: string, quantity: number | undefined, unitId: UnitId | undefined): void {
        name = name.trim() + " ";
        setFilter({ text: quantity ? `${quantity}${unitId} ${name}` : name, name, quantity: quantityToString(quantity) + unitId });
    }

    function handleSearchChange(text: string, name: string, quantity: string): void {
        setFilter({ text, name, quantity });
    }

    useEffect(() => {
        const r = (e: any) => {
            if (filter) {
                e.preventDefault();
                setFilter(undefined);
            }
        };
        navigation.addListener("beforeRemove", r);
        return () => navigation.removeListener("beforeRemove", r);
    })

    useEffect(() => {
        const [q, u] = parseQuantityUnit(filter?.quantity);
        setNewItem(v => ({
            ...v,
            name: filter?.name ?? filter?.text ?? "",
            quantity: q,
            unitId: u,
        }));
    }, [filter]);

    return (
        <KeyboardAvoidingView
            behavior="height"
            style={{ flex: 1 }}
        >
            <SearchBar
                text={filter?.text}
                onChange={handleSearchChange}
                onSubmitEditing={() => handlePress(newItem)}
            />
            <View
                style={{
                    flex: 1,
                }}
            >
                {
                    (!filter || !filter.name)
                        ? props.list
                        : <HistoryList
                            item={newItem}
                            shop={props.shop}
                            storage={props.storage}
                            onPress={handlePress}
                            onIconPress={handleIconPress} />
                }
            </View>
            <Adder
                item={adder.item}
                visible={adder.visible}
                onClose={handleAdderClose}
            />
        </KeyboardAvoidingView>
    );
}

interface Data {
    quantity?: number;
    unitId?: UnitId;
}

type Field = "existing" | "replacePlusOne" | "replaceDouble";

function Adder(props: {
    item: Item | undefined;
    visible?: boolean;
    onClose: (item?: Item) => void;
}) {
    const originalItem = useAppSelector(selectItemByName(props.item?.name));
    const theme = useTheme();

    const [existing, setExisting] = useState<Data>();
    const [replacePlusOne, setReplacePlusOne] = useState<Data>();
    const [replaceDouble, setReplaceDouble] = useState<Data>();
    const [showCalculator, setShowCalculator] = useState<
        {
            visible: boolean;
            data?: Data;
            source?: Field;
        }
    >({ visible: false });

    function handleCalculatorClose(values?: { value?: number | undefined; unitId?: UnitId | undefined; state?: any; }[] | undefined): void {
        setShowCalculator({ visible: false });
        if (values) {
            const value = values[0];
            switch (value.state as Field) {
                case "existing":
                    setExisting({ quantity: value.value, unitId: value.unitId })
                    break;
                case "replacePlusOne":
                    setReplacePlusOne({ quantity: value.value, unitId: value.unitId })
                    break;
                case "replaceDouble":
                    setReplaceDouble({ quantity: value.value, unitId: value.unitId })
                    break;
            }
        }
    }

    function handleCalculatorShow(data: Data, source: Field): void {
        setShowCalculator({ visible: true, data: data, source: source });
    }

    function handleItemPress(data: Data | undefined): void {
        props.onClose({ ...props.item!, quantity: data?.quantity, unitId: data?.unitId });
    }

    useEffect(() => {
        const originalItemQuantity = ((originalItem?.quantity ?? 0) === 0) ? 1 : (originalItem?.quantity ?? 1);
        let plusOneQuantity;
        let plusOneUnitId = originalItem?.unitId;
        let doubleQuantity;
        let doubleUnitId = props.item?.unitId ?? originalItem?.unitId;
        if (!props.item?.quantity) {
            // No quantity entered in new item
            plusOneQuantity = originalItemQuantity + 1;
            doubleQuantity = originalItemQuantity * 2;
        } else {
            const plusOneQuantityUnit = addQuantityUnit(
                originalItemQuantity,
                originalItem?.unitId,
                props.item.quantity,
                doubleUnitId);
            plusOneQuantity = plusOneQuantityUnit.quantity;
            plusOneUnitId = plusOneQuantityUnit.unitId;
            doubleQuantity = props.item.quantity;
        }
        setExisting({ quantity: originalItem?.quantity, unitId: originalItem?.unitId })
        setReplacePlusOne({ quantity: plusOneQuantity, unitId: plusOneUnitId })
        setReplaceDouble({ quantity: doubleQuantity, unitId: doubleUnitId })
    }, [originalItem]);

    return (
        <Portal>
            <Modal
                visible={!!props.visible}
                contentContainerStyle={modalContainerStyle()}
                onDismiss={props.onClose}
            >
                <View style={modalViewStyle(theme)}>
                    <Text variant="titleMedium" style={{ textAlign: "center" }}>Bereits auf der Liste</Text>
                    <List.Item
                        title={props.item?.name ?? ""}
                        right={p => <QuantityUnit data={existing} source="existing" onPress={handleCalculatorShow} />}
                        onPress={() => handleItemPress(existing)}
                    />
                    <Divider />
                    <Text variant="titleMedium" style={{ textAlign: "center" }}>Ersetzen mit</Text>
                    <List.Item
                        title={props.item?.name ?? ""}
                        right={p => <QuantityUnit data={replacePlusOne} source="replacePlusOne" onPress={handleCalculatorShow} />}
                        onPress={() => handleItemPress(replacePlusOne)}
                    />
                    <List.Item
                        title={props.item?.name ?? ""}
                        right={p => <QuantityUnit data={replaceDouble} source="replaceDouble" onPress={handleCalculatorShow} />}
                        onPress={() => handleItemPress(replaceDouble)}
                    />
                    <Divider />
                    <View style={{ flexDirection: "row", marginTop: 8 }}>
                        <View style={{ flex: 1 }}></View>
                        <Button mode="contained" onPress={() => props.onClose()}>Abbrechen</Button>
                    </View>
                </View>
                <Calculator
                    fields={[{ title: "Menge", value: showCalculator.data?.quantity, unitId: showCalculator.data?.unitId, state: showCalculator.source }]}
                    visible={showCalculator.visible}
                    onClose={handleCalculatorClose}
                />
            </Modal>
        </Portal>
    );
}

function QuantityUnit(props: {
    data?: Data;
    source: Field;
    onPress: (data: Data, source: Field) => void;
}) {
    const theme = useTheme();

    function handlePress(): void {
        if (props.data) {
            props.onPress?.(props.data, props.source);
        }
    }

    return (
        <TouchableRipple
            style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                position: "absolute",
                right: 0,
                top: -16,

                alignItems: "flex-end",
                backgroundColor: theme.colors.elevation.level3,
                borderColor: theme.colors.elevation.level3,
                borderRadius: theme.roundness,
                minWidth: 80,
            }}
            onPress={handlePress}
        >
            <Text
                style={{ color: theme.colors.primary }}
            >
                {getQuantityUnit(props.data?.quantity, props.data?.unitId)}
            </Text>
        </TouchableRipple>
    );
}
