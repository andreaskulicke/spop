import { allShop, selectItemsNotWantedWithShop, selectItemsWantedWithShop, selectItemsWantedWithoutShop, selectValidShops, setItemPackageQuantity, setItemPackageUnit, setItemQuantity, setItemShop, setItemShopPrice, setItemUnit, setItemWanted } from './store/dataSlice';
import { Calculator } from './Calculator';
import { getCalculatorFields } from './getCalculatorFields';
import { Item, UnitId, getPackageQuantityUnit, getUnitName, itemListStyle } from './store/data/items';
import { ItemsSectionList, ItemsSectionListSection } from './ItemsSectionList';
import { List, Tooltip, Checkbox, IconButton, useTheme, TouchableRipple } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { PriceIcon } from './PriceIcon';
import { RootStackParamList } from '../App';
import { Shop } from './store/data/shops';
import { Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { withSeparator } from './withSeparator';
import React, { JSXElementConstructor, ReactElement, useState } from 'react';
import { numberToString, quantityToString } from './numberToString';

export function ShoppingList(props: {
    shop: Shop;
    selectedItemId?: string;
    stopperOff?: boolean;
}) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const itemsForThisShop = useAppSelector(selectItemsWantedWithShop(props.shop, props.stopperOff));
    const unassigned = useAppSelector(selectItemsWantedWithoutShop());
    const recentlyUsed = useAppSelector(selectItemsNotWantedWithShop(props.shop.id));
    const shops = useAppSelector(selectValidShops);
    const dispatch = useAppDispatch();
    const theme = useTheme();
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

    function handleItemAddToShopPress(item: Item): void {
        dispatch(setItemShop({ itemId: item.id, shopId: props.shop.id, checked: true }));
    }

    function handleItemPress(item: Item): void {
        navigation.navigate("Item", { id: item.id, shopId: props.shop.id });
    }

    function handleItemWantedPress(item: Item): void {
        dispatch(setItemShop({ itemId: item.id, shopId: props.shop.id, checked: true }));
        dispatch(setItemWanted({ itemId: item.id, wanted: !item.wanted }));
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
                                    ? <Tooltip title="Hab dich">
                                        <Checkbox
                                            {...p}
                                            status="unchecked"
                                            onPress={() => handleItemWantedPress(item)}
                                        />
                                    </Tooltip>
                                    : <Tooltip title="Will haben">
                                        <IconButton
                                            {...p}
                                            icon="plus-outline"
                                            onPress={() => handleItemWantedPress(item)}
                                        />
                                    </Tooltip>
                            }
                            {
                                (props.shop.id !== allShop.id) && (item.shops.filter(x => x.checked).length === 0)
                                && <Tooltip title="Zum Shop hinzufügen">
                                    <IconButton
                                        {...p}
                                        icon="cart-plus"
                                        onPress={() => handleItemAddToShopPress(item)}
                                    />
                                </Tooltip>
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
            data: itemsForThisShop,
        },
        {
            title: "Ohne Shop",
            icon: "store-off",
            data: unassigned,
        },
        {
            title: "Zuletzt verwendet",
            icon: "history",
            collapsed: true,
            data: recentlyUsed,
        },
    ];

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
                paddingHorizontal: 20,
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
