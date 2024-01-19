import { allShop, selectItemsNotWantedWithShop, selectItemsWantedWithShop, selectValidShops, setItemPackageQuantity, setItemPackageUnit, setItemQuantity, setItemShop, setItemShopPrice, setItemUnit, setItemWanted, selectItemsWanted, selectItemsWantedWithoutShop, selectItemsNotWanted, selectItemsNotWantedWithDifferentShop } from './store/dataSlice';
import { Calculator } from './Calculator';
import { getCalculatorFields } from './getCalculatorFields';
import { Item, UnitId, getPackageQuantityUnit, getUnitName, itemListStyle } from './store/data/items';
import { ItemsSectionList, ItemsSectionListSection } from './ItemsSectionList';
import { List, Checkbox, IconButton, useTheme, TouchableRipple } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { numberToString, quantityToString } from './numberToString';
import { PriceIcon } from './PriceIcon';
import { RootStackParamList } from '../App';
import { Shop } from './store/data/shops';
import { Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { withSeparator } from './withSeparator';
import React, { JSXElementConstructor, ReactElement, useState } from 'react';

export function ShopItemsList(props: {
    shop: Shop;
    selectedItemId?: string;
    stopperOff?: boolean;
}) {
    const shops = useAppSelector(selectValidShops);
    const itemsWanted = useAppSelector(selectItemsWanted);
    const itemsWantedThisShop = useAppSelector(selectItemsWantedWithShop(props.shop, props.stopperOff));
    const itemsWantedWithoutShop = useAppSelector(selectItemsWantedWithoutShop);
    const itemsNotWanted = useAppSelector(selectItemsNotWanted);
    const itemsNotWantedThisShop = useAppSelector(selectItemsNotWantedWithShop(props.shop, props.stopperOff));
    const itemsNotWantedDifferentShop = useAppSelector(selectItemsNotWantedWithDifferentShop(props.shop));
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [showCalculator, setShowCalculator] = useState<{
        visible: boolean;
        item?: Item;
    }>({ visible: false });

    function handleCalculatorClose(values?: { value?: number; unitId?: UnitId, state?: any; }[] | undefined): void {
        setShowCalculator({ visible: false });
        if (values) {
            if (values.length > 0) {
                const value = values[0];
                const item = value.state as Item;
                dispatch(setItemQuantity({ itemId: item.id, quantity: value.value }));
                dispatch(setItemUnit({ itemId: item.id, unitId: value.unitId ?? "-" }));
            }
            if (values.length > 1) {
                const value = values[1];
                const item = value.state as Item;
                dispatch(setItemPackageQuantity({ itemId: item.id, packageQuantity: value.value }));
                dispatch(setItemPackageUnit({ itemId: item.id, packageUnitId: value.unitId ?? "-" }));
            }
            if (values.length > 2) {
                const value = values[2];
                const item = value.state as Item;
                dispatch(setItemShopPrice({ itemId: item.id, shopId: props.shop.id, price: value.value, unitId: value.unitId }));
            }
        }
    }

    function handleItemPress(item: Item): void {
        navigation.navigate("Item", { id: item.id, shopId: props.shop.id });
    }

    function handleItemWantedPress(item: Item): void {
        dispatch(setItemWanted({ itemId: item.id, wanted: !item.wanted }));
        dispatch(setItemShop({ itemId: item.id, shopId: props.shop.id, checked: true }));
    }

    function handleShowCalculatorPress(item: Item): void {
        setShowCalculator({
            visible: true,
            item: item,
        });
    }

    function handleRenderItem(item: Item): ReactElement<any, string | JSXElementConstructor<any>> | null {

        const description = withSeparator(
            getPackageQuantityUnit(item),
            " - ",
            item.shops
                .filter(x => x.checked)
                .map(x => shops.find(s => s.id === x.shopId)?.name)
                .filter(x => !!x)
                .join(", "));

        const currentItemShop = item.shops.find(x => x.shopId === props.shop.id);

        let quantity = quantityToString(item.quantity);
        if (quantity && item.unitId) {
            quantity += ` ${getUnitName(item.unitId)}`;
        }

        let price = numberToString(currentItemShop?.price);
        if (price) {
            price += " €";
            const unitName = getUnitName(currentItemShop?.unitId);
            if (unitName) {
                price += `/ ${unitName}`;
            }
        }

        return (
            <List.Item
                description={description ? description : undefined}
                title={item.name}
                style={itemListStyle(theme)}
                right={
                    p => (
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                            <QuantityPrice
                                itemId={item.id}
                                shopId={props.shop.id}
                                quantity={quantity}
                                price={price}
                                onPress={() => handleShowCalculatorPress(item)}
                            />
                            {
                                item.wanted
                                    ? <Checkbox
                                        {...p}
                                        status="unchecked"
                                        onPress={() => handleItemWantedPress(item)}
                                    />
                                    : <IconButton
                                        {...p}
                                        icon="plus-outline"
                                        style={{ ...(p.style), ...{ marginLeft: 0 } }}
                                        onPress={() => handleItemWantedPress(item)}
                                    />
                            }
                            {
                                !item.wanted && item.shops.find(x => x.checked && (x.shopId === props.shop.id))
                                && <IconButton {...p} icon="cart-minus" onPress={() => dispatch(setItemShop({ itemId: item.id, shopId: props.shop.id, checked: false }))} />
                            }
                            {
                                (props.shop.id !== allShop.id) && !item.shops.find(x => x.checked && (x.shopId === props.shop.id))
                                && <IconButton {...p} icon="cart-plus" onPress={() => dispatch(setItemShop({ itemId: item.id, shopId: props.shop.id, checked: true }))} />
                            }
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
            data: (props.shop.id === allShop.id)
                ? itemsWanted
                : itemsWantedThisShop,
        },
        {
            title: "Ohne Shop",
            icon: "store-off",
            data: itemsWantedWithoutShop,
        },
    ];


    if (props.shop.id === allShop.id) {
        data.push(
            {
                title: "Zuletzt",
                icon: "history",
                data: itemsNotWanted,
            },
        );
    } else {
        data.push(
            {
                title: `Zuletzt in ${props.shop?.name}`,
                icon: "history",
                collapsed: true,
                data: itemsNotWantedThisShop,
            },
            {
                title: "Zuletzt in anderen Shops",
                icon: "history",
                collapsed: true,
                data: itemsNotWantedDifferentShop,
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
    const theme = useTheme();

    return (
        <TouchableRipple
            style={{
                justifyContent: "center",
                minHeight: 40,
                minWidth: 64,
                paddingHorizontal: 16,
            }}
            onPress={props.onPress}
        >
            <View style={{ alignItems: "flex-end" }}>
                {
                    props.quantity
                    && <Text style={{ color: theme.colors.primary }}>
                        {props.quantity}
                    </Text>
                }
                {
                    (props.shopId !== allShop.id)
                    && props.price
                    && <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                        <Text style={{ color: theme.colors.primary }}>
                            {props.price}
                        </Text>
                        <PriceIcon
                            itemId={props.itemId}
                            shopId={props.shopId}
                        />
                    </View>
                }
            </View>
        </TouchableRipple>
    );
}