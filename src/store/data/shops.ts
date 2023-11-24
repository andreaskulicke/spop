import { categoryIds } from "./categories";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";
import { SvgProps } from "react-native-svg";
import AldiSvg from "../icons/Aldi.svg";
import DmSvg from "../icons/Dm.svg";
import EdekaSvg from "../icons/Edeka.svg";
import HornbachSvg from "../icons/Hornbach.svg";
import LidlSvg from "../icons/Lidl.svg";
import MuellerSvg from "../icons/Mueller.svg";
import NormaSvg from "../icons/Norma.svg";
import ObiSvg from "../icons/Obi.svg";
import ReweSvg from "../icons/Rewe.svg";
import RossmannSvg from "../icons/Rossmann.svg";
import UnknownSvg from "../icons/Unknown.svg";

export interface Shop {
    id: string;
    name: string;
    defaultCategoryId?: (string & {}) | typeof categoryIds[number];
    /** Category IDs that are present here are shown in the order of this array */
    categoryIds?: ((string & {}) | typeof categoryIds[number])[];
    stopper?: boolean;
}

export function getShopSvg(shop: Shop, props: { color: string, style: Style }) {
    const s: SvgProps = {
        height: 42,
        width: 42,
        ...props,
    };
    if (/aldi/i.test(shop.name)) {
        return AldiSvg(s);
    }
    if (/dm/i.test(shop.name)) {
        return DmSvg(s);
    }
    if (/edeka/i.test(shop.name)) {
        return EdekaSvg(s);
    }
    if (/hornbach/i.test(shop.name)) {
        return HornbachSvg(s);
    }
    if (/lidl/i.test(shop.name)) {
        return LidlSvg(s);
    }
    if (/mueller|müller|muller/i.test(shop.name)) {
        return MuellerSvg(s);
    }
    if (/norma/i.test(shop.name)) {
        return NormaSvg(s);
    }
    if (/obi/i.test(shop.name)) {
        return ObiSvg(s);
    }
    if (/rewe/i.test(shop.name)) {
        return ReweSvg(s);
    }
    if (/rossman/i.test(shop.name)) {
        return RossmannSvg(s);
    }
    return UnknownSvg(s);
}

export const defaultShops: Shop[] = [
    {
        id: "fruitmarket",
        name: "Lohhofer Obstmarkt",
        defaultCategoryId: "fruits_vegetables",
        categoryIds: ["fruits_vegetables"],
    },
    {
        id: "polster",
        name: "Polster",
        defaultCategoryId: "bakery",
        categoryIds: ["bakery"],
    },
    {
        id: "aldi",
        name: "Aldi",
        categoryIds: ["fruits_vegetables", "eggs", "sweets", "fridge", "cereals", "drinks", "household", "misc"]
    },
    {
        id: "rewe",
        name: "Rewe",
    },
    {
        id: "edeka",
        name: "Edeka",
        categoryIds: ["misc", "fruits_vegetables", "nuts", "bakery", "backing", "cereals", "coffee_tea", "noodles", "sauces", "tins", "fridge", "spices", "freezer", "meat", "eggs", "sweets", "drinks", "household"]
    },
    {
        id: "rossmann",
        name: "Rossmann",
        defaultCategoryId: "household",
        categoryIds: ["household", "nuts", "sweets"]
    }
];
