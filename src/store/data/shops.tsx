import { Avatar, MD3Theme } from "react-native-paper";
import { categoryIds } from "./categories";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";
import { StyleProp, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";
import AldiSvg from "../icons/Aldi";
import ApothekeSvg from "../icons/Apotheke";
import BaeckerSvg from "../icons/Baecker";
import DmSvg from "../icons/Dm";
import EdekaSvg from "../icons/Edeka";
import FressnapfSvg from "../icons/Fressnapf";
import HornbachSvg from "../icons/Hornbach";
import LidlSvg from "../icons/Lidl";
import MuellerSvg from "../icons/Mueller";
import NormaSvg from "../icons/Norma";
import ObstSvg from "../icons/Obst";
import ObiSvg from "../icons/Obi";
import ReweSvg from "../icons/Rewe";
import RossmannSvg from "../icons/Rossmann";
import UnknownSvg from "../icons/Unknown";

export interface Shop {
    id: string;
    name: string;
    defaultCategoryId?: (string & {}) | (typeof categoryIds)[number];
    /** Category IDs that are present here are shown in the order of this array */
    categoryIds?: ((string & {}) | (typeof categoryIds)[number])[];
    stopper?: boolean;
}

export function getShopImage(
    shop: Shop,
    theme: MD3Theme,
    props: { style: Style },
) {
    const s: SvgProps = {
        height: 28,
        width: 28,
    };

    const avatarBackgroundProps = getAvatarProps(theme.colors.onPrimary);

    function getAvatarProps(backgroundColor: string) {
        const imageStyle: StyleProp<ViewStyle> = {
            backgroundColor: theme.colors.elevation.level3,
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            marginLeft: 16,
        };
        return {
            size: 40,
            style: {
                ...imageStyle,
                backgroundColor: backgroundColor,
            },
        };
    }

    function getAvatarBorderProps(borderColor: string) {
        return {
            ...avatarBackgroundProps,
            style: {
                ...avatarBackgroundProps.style,
                borderColor: borderColor,
                borderWidth: 2,
            },
        };
    }

    if (/aldi/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarProps("#00005f")}
                source={() => <AldiSvg {...s} />}
            />
        );
    }

    if (/apotheke/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarBorderProps("#df091d")}
                source={() => <ApothekeSvg {...s} />}
            />
        );
    }
    if (/baecker|bäcker|backer|polster/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarProps("#2163ad")}
                source={() => <BaeckerSvg {...s} />}
            />
        );
    }
    if (/dm/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarProps("#fec700")}
                source={() => <DmSvg {...s} />}
            />
        );
    }
    if (/edeka/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarProps("#FFD400")}
                source={() => <EdekaSvg {...s} />}
            />
        );
    }
    if (/fressnapf/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarBorderProps("#00652d")}
                source={() => <FressnapfSvg {...s} />}
            />
        );
    }
    if (/hornbach/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarProps("#f7911a")}
                source={() => <HornbachSvg {...s} />}
            />
        );
    }
    if (/lidl/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarProps("#0050aa")}
                source={() => <LidlSvg {...s} />}
            />
        );
    }
    if (/mueller|müller|muller/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarBorderProps("#f16426")}
                source={() => <MuellerSvg {...s} />}
            />
        );
    }
    if (/norma/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarProps("#D60F19")}
                source={() => <NormaSvg {...s} />}
            />
        );
    }
    if (/obi/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarBorderProps("#ff7313")}
                source={() => <ObiSvg {...s} />}
            />
        );
    }
    if (/.*obst.*/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarBorderProps("#757f3f")}
                source={() => <ObstSvg {...s} />}
            />
        );
    }
    if (/rewe/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...getAvatarProps("#cc071e")}
                source={() => <ReweSvg {...s} />}
            />
        );
    }
    if (/rossman/i.test(shop.name)) {
        return (
            <Avatar.Image
                {...avatarBackgroundProps}
                source={() => (
                    <RossmannSvg
                        height={avatarBackgroundProps.size + 8}
                        width={avatarBackgroundProps.size + 10}
                    />
                )}
            />
        );
    }
    return (
        <Avatar.Image
            {...avatarBackgroundProps}
            source={() => <UnknownSvg {...s} color={theme.colors.primary} />}
        />
    );
}

export const defaultShops: Shop[] = [
    {
        id: "fruitmarket",
        name: "Obstmarkt",
        defaultCategoryId: "fruits_vegetables",
        categoryIds: ["fruits_vegetables"],
    },
    {
        id: "backery",
        name: "Bäcker",
        defaultCategoryId: "bakery",
        categoryIds: ["bakery"],
    },
    {
        id: "aldi",
        name: "Aldi",
        categoryIds: [
            "fruits_vegetables",
            "meat",
            "noodles",
            "oil_vinegar",
            "sauces",
            "spices",
            "bakery",
            "eggs",
            "baking",
            "sweets",
            "nuts",
            "canned_fruits",
            "pickled_preserves",
            "alcohol",
            "fridge",
            "cereals",
            "jam_honey",
            "coffee_tea",
            "freezer",
            "drinks",
            "household",
            "stationary",
            "misc",
        ],
    },
    {
        id: "rewe",
        name: "Rewe",
    },
    {
        id: "edeka",
        name: "Edeka",
        categoryIds: [
            "misc",
            "fruits_vegetables",
            "nuts",
            "bakery",
            "baking",
            "jam_honey",
            "cereals",
            "coffee_tea",
            "noodles",
            "asia",
            "rice",
            "sauces",
            "canned_fruits",
            "pickled_preserves",
            "oil_vinegar",
            "fridge",
            "spices",
            "meat",
            "freezer",
            "eggs",
            "sweets",
            "drinks",
            "household",
            "stationary",
            "alcohol",
        ],
    },
    {
        id: "rossmann",
        name: "Rossmann",
        defaultCategoryId: "household",
        categoryIds: [
            "misc",
            "household",
            "stationary",
            "coffee_tea",
            "nuts",
            "sweets",
            "drinks",
            "alcohol",
        ],
    },
];
