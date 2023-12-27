import { Calculator } from './Calculator';
import { FillFromHistoryListItem } from './FillFromHistoryListItem';
import { getCalculatorFields } from './getCalculatorFields';
import { Item, UnitId } from './store/data/items';
import { Keyboard, ScrollView } from 'react-native';
import { selectItems, setItemShopPrice } from './store/dataSlice';
import { Shop } from './store/data/shops';
import { useAppDispatch, useAppSelector } from './store/hooks';
import React, { useState } from 'react';

export function FillFromHistoryList(props: {
    item: Item;
    shop?: Shop;
    onPress?: (item: Item) => void;
    onIconPress?: (name: string, quantity: string | undefined) => void;
}) {
    const [showCalculator, setShowCalculator] = useState<
        {
            visible: boolean;
            item?: Item;
        }
    >({ visible: false });
    const items = useAppSelector(selectItems);
    const dispatch = useAppDispatch();

    function handleCalculatorClose(values?: { value?: number | undefined; unitId?: UnitId | undefined; state?: any; }[] | undefined): void {
        setShowCalculator({ visible: false });
        if (values && (values.length > 0)) {
            const value = values[0];
            const item = value.state as Item;
            dispatch(setItemShopPrice({ itemId: item.id, shopId: props.shop!.id, price: value.value, unitId: value.unitId }))
        }
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
                    .map(x => <FillFromHistoryListItem
                        key={x.id}
                        item={{ ...x, quantity: props.item.quantity }}
                        shopId={props.shop?.id}
                        onPress={props.onPress}
                        onCalculatorPress={handleCalculatorPress}
                        onIconPress={props.onIconPress}
                    />)
            }
            <Calculator
                fields={[getCalculatorFields(props.shop, showCalculator.item)[1]]}
                visible={showCalculator.visible}
                onClose={handleCalculatorClose}
            />
        </ScrollView>
    );
}
