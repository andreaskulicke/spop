import React, {
    JSXElementConstructor,
    ReactElement,
    useEffect,
    useState,
} from "react";
import {
    SectionList,
    SectionListData,
    SectionListRenderItemInfo,
} from "react-native";
import { CategorySection } from "./CategorySection";
import { ListSection } from "./ListSection";
import { Category } from "./store/data/categories";
import { Item, isItem } from "./store/data/items";

export type ItemsSectionListItem = undefined | Category | Item;

export interface ItemsSectionListSection {
    title: string;
    icon: string;
    collapsed: [boolean, (expanded: boolean) => void];
    data: ItemsSectionListItem[];
}

interface Data extends ItemsSectionListSection {
    bold?: boolean;
    onExpandChange: (expanded: boolean) => void;
}

function isExpanded(collapsed: ItemsSectionListSection["collapsed"]): boolean {
    return !collapsed[0];
}

export function ItemsSectionList(props: {
    data: ItemsSectionListSection[];
    renderItem: (
        item: Item,
    ) => ReactElement<any, string | JSXElementConstructor<any>> | null;
}) {
    const [expanded, setExpanded] = useState<boolean[]>(
        props.data.map((x) => isExpanded(x.collapsed)),
    );

    function handleExpandChange(i: number, exp: boolean): void {
        const expandedTmp = [...expanded];
        expandedTmp[i] = exp;
        setExpanded(expandedTmp);
        props.data[i].collapsed[1](exp);
    }

    function handleRenderSectionHeader(info: {
        section: SectionListData<ItemsSectionListItem, Data>;
    }): ReactElement<any, string | JSXElementConstructor<any>> | null {
        return (
            <ListSection
                bold={info.section.bold}
                icon={info.section.icon}
                title={info.section.title}
                collapsed={!isExpanded(info.section.collapsed)}
                count={info.section.data.filter((x) => isItem(x)).length}
                visible="always"
                onExpandChange={info.section.onExpandChange}
            />
        );
    }

    function handleRenderItem(
        info: SectionListRenderItemInfo<ItemsSectionListItem, Data>,
    ): ReactElement<any, string | JSXElementConstructor<any>> | null {
        if (!isExpanded(info.section.collapsed)) {
            return <></>;
        }
        if (isItem(info.item)) {
            return props.renderItem(info.item);
        }
        return (
            <CategorySection
                key={info.item?.id ?? "_"}
                icon={info.item?.icon}
                title={info.item?.name ?? "Unbekannte Kategorie"}
                visible="always"
            />
        );
    }

    useEffect(() => {
        setExpanded(props.data.map((x) => isExpanded(x.collapsed)));
    }, [props.data]);

    const data: Data[] = props.data.map((x, i) => ({
        ...x,
        bold: i === 0,
        collapsed: [!expanded[i], x.collapsed[1]],
        onExpandChange: (exp) => handleExpandChange(i, exp),
    }));

    return (
        <SectionList
            sections={data}
            renderSectionHeader={handleRenderSectionHeader}
            renderItem={handleRenderItem}
        ></SectionList>
    );
}
