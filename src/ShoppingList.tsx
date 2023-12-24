import { allShop, selectItemsNotWantedWithShop, selectItemsWantedWithShop, selectItemsWantedWithoutShop, selectValidShops, setItemQuantity, setItemShop, setItemShopPrice, setItemUnit, setItemWanted } from './store/dataSlice';
import { Calculator } from './Calculator';
import { Item, UnitId, getUnitName, itemListStyle } from './store/data/items';
import { ItemsSectionList, ItemsSectionListSection } from './ItemsSectionList';
import { List, Tooltip, Checkbox, IconButton, useTheme, TouchableRipple } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { Shop } from './store/data/shops';
import { Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from './store/hooks';
import React, { JSXElementConstructor, ReactElement, useState } from 'react';
import { all } from 'deepmerge';

export function ShoppingList(props: {
    shop: Shop;
    selectedItemId?: string;
}) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const itemsForThisShop3 = useAppSelector(selectItemsWantedWithShop(props.shop));
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
                const item = values[0].state as Item;
                dispatch(setItemQuantity({ itemId: item.id, quantity: values[0].value?.toString() ?? "" }));
                dispatch(setItemUnit({ itemId: item.id, unitId: values[0].unitId ?? "-" }));
            }
            if (values.length > 1) {
                const item = values[1].state as Item;
                dispatch(setItemShopPrice({ itemId: item.id, shopId: props.shop.id, price: values[1].value, unitId: values[1].unitId }));
            }
        }
    }

    function handleItemAddToShopPress(item: Item): void {
        dispatch(setItemShop({ itemId: item.id, shopId: props.shop.id, checked: true }));
    }

    function handleItemPress(item: Item): void {
        navigation.navigate("Item", { id: item.id });
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

        let description = "";
        if (props.shop.id !== allShop.id) {
            description = item.shops
                .filter(x => x.checked)
                .map(x => shops.find(s => s.id === x.shopId)?.name)
                .filter(x => !!x)
                .join(", ");
        }

        const currentItemShop = item.shops.find(x => x.shopId === props.shop.id);

        let quantity = (item.quantity !== "0") ? item.quantity : "";
        if (quantity && item.unitId) {
            quantity += ` ${getUnitName(item.unitId)}`;
        }

        let price = currentItemShop?.price?.toString().replace(".", ",");
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
                            <TouchableRipple
                                style={{
                                    justifyContent: "center",
                                    minHeight: 40,
                                    minWidth: 64,
                                    paddingHorizontal: 4,
                                }}
                                onPress={() => handleShowCalculatorPress(item)}
                            >
                                <View style={{ alignItems: "center" }}>
                                    {
                                        quantity
                                        && <Text style={{ color: theme.colors.primary }}>
                                            {quantity}
                                        </Text>
                                    }
                                    {
                                        (props.shop.id !== allShop.id)
                                        && price
                                        && <Text style={{ color: theme.colors.primary }}>
                                            {price}
                                        </Text>
                                    }
                                </View>
                            </TouchableRipple>
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
            data: itemsForThisShop3,
        },
        {
            title: "Ohne Shop",
            icon: "store-off",
            data: unassigned,
        },
        {
            title: "Zuletzt verwendet",
            icon: "history",
            data: recentlyUsed,
        },
    ];

    return (
        <View>
            <ItemsSectionList
                data={data}
                renderItem={handleRenderItem}
                selectedItemId={props.selectedItemId}
            />
            <Calculator
                fields={getCalculatorFields(props.shop.id, showCalculator.item)}
                visible={showCalculator.visible}
                onClose={handleCalculatorClose}
            />
        </View>
    );
}

function getCalculatorFields(shopId: string, item?: Item) {
    const currentItemShop = item?.shops.find(x => x.shopId === shopId);
    const data = [
        {
            title: "Menge",
            value: Number.parseFloat(item?.quantity ?? "0") as number | undefined,
            unitId: item?.unitId,
            state: item,
            selected: true,
        }
    ];
    if (shopId !== allShop.id) {
        data.push(
            {
                title: "Preis",
                value: currentItemShop?.price,
                unitId: currentItemShop?.unitId,
                state: item,
                selected: false,
            }
        );
    }
    return data;
}
