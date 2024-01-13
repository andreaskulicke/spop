import { Calculator } from './Calculator';
import { FillFromHistoryListItem } from './FillFromHistoryListItem';
import { getCalculatorFields } from './getCalculatorFields';
import { Item, UnitId, replaceUnitIdIfEmpty } from './store/data/items';
import { Keyboard, ScrollView } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { selectItems, setItemPackageQuantity, setItemPackageUnit, setItemShopPrice } from './store/dataSlice';
import { Shop } from './store/data/shops';
import { Storage } from './store/data/storages';
import { useAppDispatch, useAppSelector } from './store/hooks';
import React, { useState } from 'react';

export function FillFromHistoryList(props: {
    item: Item;
    shop?: Shop;
    storage?: Storage;
    onPress?: (item: Item) => void;
    onIconPress?: (name: string, quantity: number | undefined, unitId: UnitId | undefined) => void;
}) {
    const [showCalculator, setShowCalculator] = useState<
        {
            visible: boolean;
            item?: Item;
        }
    >({ visible: false });
    const items = useAppSelector(selectItems);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    function handleCalculatorClose(values?: { value?: number | undefined; unitId?: UnitId | undefined; state?: any; }[] | undefined): void {
        setShowCalculator({ visible: false });
        if (values) {
            if (values.length > 0) {
                const value = values[0];
                const item = value.state as Item;
                dispatch(setItemPackageQuantity({ itemId: item.id, packageQuantity: value.value }));
                dispatch(setItemPackageUnit({ itemId: item.id, packageUnitId: value.unitId ?? "-" }));
            }
            if (values.length > 1) {
                const value = values[1];
                const item = value.state as Item;
                dispatch(setItemShopPrice({ itemId: item.id, shopId: props.shop!.id, price: value.value, unitId: value.unitId }))
            }
        }
    }

    function handleLongPress(item: Item): void {
        navigation.navigate("Item", { id: item.id, shopId: props.shop?.id, storageId: props.storage?.id })
    }

    function handleCalculatorPress(item: Item): void {
        Keyboard.dismiss();
        setShowCalculator({ visible: true, item: { ...item } });
    }

    function transformToSearchName(name: string): string {
        return name.toLowerCase()
            .replace("ä", "a")
            .replace("ö", "o")
            .replace("ü", "u")
            .replace("ß", "s");
    }

    const itemName = transformToSearchName(props.item.name);

    return (
        <ScrollView keyboardShouldPersistTaps="always">
            {
                props.item.name && !items.find(x => transformToSearchName(x.name) === itemName)
                && <FillFromHistoryListItem
                    item={props.item}
                    onPress={props.onPress}
                    onIconPress={props.onIconPress}
                />
            }
            {
                items
                    .filter(x => transformToSearchName(x.name).includes(itemName))
                    .sort((a, b) => a.name.length - b.name.length)
                    .map(x => <FillFromHistoryListItem
                        key={x.id}
                        item={{ ...x, quantity: props.item.quantity, unitId: replaceUnitIdIfEmpty(props.item.unitId, x.unitId) }}
                        shopId={props.shop?.id}
                        onPress={props.onPress}
                        onLongPress={handleLongPress}
                        onCalculatorPress={handleCalculatorPress}
                        onIconPress={props.onIconPress}
                    />)
            }
            <Calculator
                fields={getCalculatorFields(showCalculator.item, props.shop).slice(1)}
                visible={showCalculator.visible}
                onClose={handleCalculatorClose}
            />
        </ScrollView>
    );
}
