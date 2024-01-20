import { selectItem, selectItemShopsWithMinPrice } from './store/dataSlice';
import { useTheme, Icon } from 'react-native-paper';
import { useAppSelector } from './store/hooks';
import React from 'react';

export function PriceIcon(props: {
    itemId: string;
    shopId: string | undefined;
}) {
    const item = useAppSelector(selectItem(props.itemId));
    const itemShopsWithMinPrice = useAppSelector(selectItemShopsWithMinPrice(props.itemId));
    const theme = useTheme();

    const numberOfShopsWithPrices = item?.shops.filter(x => x.price).length ?? 0;
    const hasMinPriceTmp = itemShopsWithMinPrice.find(x => x.shopId === props.shopId);

    return (
        (numberOfShopsWithPrices > 1)
            ? <Icon
                color={hasMinPriceTmp ? "green" : theme.colors.error}
                source={hasMinPriceTmp ? (itemShopsWithMinPrice.length === 1 ? "arrow-up" : "arrow-right") : "arrow-down"}
                size={16}
            />
            : <></>
    );
}
