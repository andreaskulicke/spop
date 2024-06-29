import { selectItem, selectItemShopsWithMinPrice } from "./store/dataSlice";
import { useTheme, Icon } from "react-native-paper";
import { useAppSelector } from "./store/hooks";
import React, { useEffect, useState } from "react";

export function SummaryPriceIcon(props: {
    itemId: string;
    shopId: string | undefined;
    onTooltipText?: (text: string) => void;
}) {
    const item = useAppSelector((state) => selectItem(state, props.itemId));
    const itemShopsWithMinPrice = useAppSelector((state) =>
        selectItemShopsWithMinPrice(state, props.itemId),
    );
    const theme = useTheme();

    const [numberOfShopsWithPrices, setNumberOfShopsWithPrices] = useState(0);
    const [color, setColor] = useState(theme.colors.background);
    const [icon, setIcon] = useState("");

    useEffect(() => {
        setNumberOfShopsWithPrices(
            item?.shops.filter((x) => x.price).length ?? 0,
        );
        const hasMinPackagePrice = itemShopsWithMinPrice.prices.find(
            (x) => x.shopId === props.shopId,
        );
        const hasMinNormalizedPrice =
            itemShopsWithMinPrice.normalizedPrices.find(
                (x) => x.shopId === props.shopId,
            );

        let tooltipText = "";
        if (hasMinPackagePrice) {
            if (hasMinNormalizedPrice) {
                setColor("green");
                if (
                    itemShopsWithMinPrice.prices.length > 1 ||
                    itemShopsWithMinPrice.normalizedPrices.length > 1
                ) {
                    setIcon("arrow-right");
                    tooltipText = "Gleiche Preise";
                } else {
                    setIcon("arrow-up");
                    tooltipText = "Bester Preis";
                }
            } else {
                setColor(theme.colors.error);
                setIcon("arrow-bottom-right");
                tooltipText = "Woanders Preis pro Einheit besser!";
            }
        } else {
            if (hasMinNormalizedPrice) {
                setColor("green");
                setIcon("arrow-top-right");
                tooltipText = "Bester Preis pro Einheit";
            } else {
                setColor(theme.colors.error);
                setIcon("arrow-down");
                tooltipText = "Woanders billiger!";
            }
        }
        props.onTooltipText?.(tooltipText);
    }, [itemShopsWithMinPrice]);

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
    const item = useAppSelector((state) => selectItem(state, props.itemId));
    const itemShopsWithMinPrice = useAppSelector((state) =>
        selectItemShopsWithMinPrice(state, props.itemId),
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
