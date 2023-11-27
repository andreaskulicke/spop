import { Item } from './store/data/items';
import { ListSection } from './ListSection';
import { SectionList, SectionListData, SectionListRenderItemInfo } from 'react-native';
import React, { JSXElementConstructor, ReactElement, useState } from 'react';

export interface ItemsSectionListData {
    title: string;
    icon: string;
    data: Item[];
}

interface Data extends ItemsSectionListData {
    collapsed?: boolean;
    onExpandChange: (expanded: boolean) => void;
}

export function ItemsSectionList(props: {
    data: {
        title: string;
        icon: string;
        data: Item[];
    }[];
    renderItem: (info: SectionListRenderItemInfo<Item, ItemsSectionListData>) => ReactElement<any, string | JSXElementConstructor<any>> | null;
}) {
    const [expanded, setExpanded] = useState<boolean[]>(Array(props.data.length).fill(true));

    function handleExpandChange(i: number, exp: boolean): void {
        const expandedTmp = [...expanded];
        expandedTmp[i] = exp;
        setExpanded(expandedTmp);
    }


    function handleRenderSectionHeader(info: { section: SectionListData<Item, Data>; }): ReactElement<any, string | JSXElementConstructor<any>> | null {
        return (
            <ListSection
                icon={info.section.icon}
                title={info.section.title}
                collapsed={info.section.collapsed}
                count={info.section.data.length}
                visible="always"
                onExpandChange={info.section.onExpandChange}
            />
        );
    }

    function handleRenderItem(info: SectionListRenderItemInfo<Item, Data>): ReactElement<any, string | JSXElementConstructor<any>> | null {
        return (
            !info.section.collapsed
                ? props.renderItem(info)
                : <></>
        );
    }

    const data: Data[] = props.data.map((x, i) => ({ ...x, collapsed: !expanded[i], onExpandChange: (exp) => handleExpandChange(i, exp) }));

    return (
        <SectionList
            sections={data}
            renderSectionHeader={handleRenderSectionHeader}
            renderItem={handleRenderItem}
        >
        </SectionList>
    );
}
