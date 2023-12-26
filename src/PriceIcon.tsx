import { selecItemShopsWithMinPrice } from './store/dataSlice';
import { useTheme, Icon } from 'react-native-paper';
import { useAppSelector } from './store/hooks';
import React from 'react';

export function PriceIcon(props: {
    itemId: string;
    shopId: string;
}) {
    const itemShopsWithMinPrice = useAppSelector(selecItemShopsWithMinPrice(props.itemId));
    const theme = useTheme();

    const hasMinPriceTmp = itemShopsWithMinPrice.find(x => x.shopId === props.shopId);

    return (
        <Icon
            color={hasMinPriceTmp ? theme.colors.primary : theme.colors.error}
            source={hasMinPriceTmp ? "arrow-up" : "arrow-down"}
            size={16}
        />
    );
}
