import { selectItem, selectItemShopsWithMinPrice } from "./store/dataSlice";
import { useTheme, Icon } from "react-native-paper";
import { useAppSelector } from "./store/hooks";
import React from "react";

export function SummaryPriceIcon(props: {
    itemId: string;
    shopId: string | undefined;
}) {
    const item = useAppSelector(selectItem(props.itemId));
    const itemShopsWithMinPrice = useAppSelector(
        selectItemShopsWithMinPrice(props.itemId),
    );
    const theme = useTheme();

    const numberOfShopsWithPrices =
        item?.shops.filter((x) => x.price).length ?? 0;
    const hasMinPackagePrice = itemShopsWithMinPrice.prices.find(
        (x) => x.shopId === props.shopId,
    );
    const hasMinNormalizedPrice = itemShopsWithMinPrice.normalizedPrices.find(
        (x) => x.shopId === props.shopId,
    );

    let color = "";
    let icon = "";
    if (hasMinPackagePrice) {
        if (hasMinNormalizedPrice) {
            color = "green";
            if (
                itemShopsWithMinPrice.prices.length > 1 ||
                itemShopsWithMinPrice.normalizedPrices.length > 1
            ) {
                icon = "arrow-right";
            } else {
                icon = "arrow-up";
            }
        } else {
            color = theme.colors.error;
            icon = "arrow-bottom-right";
        }
    } else {
        if (hasMinNormalizedPrice) {
            color = "green";
            icon = "arrow-top-right";
        } else {
            color = theme.colors.error;
            icon = "arrow-down";
        }
    }

    return numberOfShopsWithPrices > 1 ? (
        <Icon color={color} source={icon} size={16} />
    ) : (
        <></>
    );
}

export function PriceIcon(props: {
    normalized?: boolean;
    itemId: string;
    shopId: string | undefined;
}) {
    const item = useAppSelector(selectItem(props.itemId));
    const itemShopsWithMinPrice = useAppSelector(
        selectItemShopsWithMinPrice(props.itemId),
    );
    const theme = useTheme();

    const prices = props.normalized
        ? itemShopsWithMinPrice.normalizedPrices
        : itemShopsWithMinPrice.prices;
    const hasMinPrice = prices.find((x) => x.shopId === props.shopId);
    const numberOfShopsWithPrices =
        item?.shops.filter((x) => x.price).length ?? 0;

    return numberOfShopsWithPrices > 1 ? (
        <Icon
            color={hasMinPrice ? "green" : theme.colors.error}
            source={
                hasMinPrice
                    ? prices.length === 1
                        ? "arrow-up"
                        : "arrow-right"
                    : "arrow-down"
            }
            size={16}
        />
    ) : (
        <></>
    );
}
