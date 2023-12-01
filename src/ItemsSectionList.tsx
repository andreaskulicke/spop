import { Category } from './store/data/categories';
import { CategorySection } from './CategorySection';
import { Item, isItem } from './store/data/items';
import { ListSection } from './ListSection';
import { SectionList, SectionListData, SectionListRenderItemInfo } from 'react-native';
import React, { JSXElementConstructor, ReactElement, useEffect, useRef, useState } from 'react';

export type ItemsSectionListItem = undefined | Category | Item;

export interface ItemsSectionListSection {
    title: string;
    icon: string;
    data: ItemsSectionListItem[];
}

interface Data extends ItemsSectionListSection {
    collapsed?: boolean;
    onExpandChange: (expanded: boolean) => void;
}

export function ItemsSectionList(props: {
    data: ItemsSectionListSection[];
    selectedItemId?: string;
    renderItem: (item: Item) => ReactElement<any, string | JSXElementConstructor<any>> | null;
}) {
    const [expanded, setExpanded] = useState<boolean[]>(Array(props.data.length).fill(true));
    const listRef = useRef<SectionList<ItemsSectionListItem, Data>>(null);

    function handleExpandChange(i: number, exp: boolean): void {
        const expandedTmp = [...expanded];
        expandedTmp[i] = exp;
        setExpanded(expandedTmp);
    }

    function handleRenderSectionHeader(info: { section: SectionListData<ItemsSectionListItem, Data>; }): ReactElement<any, string | JSXElementConstructor<any>> | null {
        return (
            <ListSection
                icon={info.section.icon}
                title={info.section.title}
                collapsed={info.section.collapsed}
                count={info.section.data.filter(x => isItem(x)).length}
                visible="always"
                onExpandChange={info.section.onExpandChange}
            />
        );
    }

    function handleRenderItem(info: SectionListRenderItemInfo<ItemsSectionListItem, Data>): ReactElement<any, string | JSXElementConstructor<any>> | null {
        if (info.section.collapsed) {
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
        for (let sectionIndex = 0; sectionIndex < props.data.length; sectionIndex++) {
            const itemIndex = props.data[sectionIndex].data.findIndex(x => x?.id === props.selectedItemId);
            if (itemIndex !== -1) {
                listRef.current?.scrollToLocation({ sectionIndex: sectionIndex, itemIndex: itemIndex, viewOffset: -52, viewPosition: 0, });
                break;
            }
        }
    }, [props.selectedItemId]);

    const data: Data[] = props.data.map((x, i) => ({ ...x, collapsed: !expanded[i], onExpandChange: (exp) => handleExpandChange(i, exp) }));

    return (
        <SectionList
            ref={listRef}
            sections={data}
            renderSectionHeader={handleRenderSectionHeader}
            renderItem={handleRenderItem}
            getItemLayout={(data, index) => (
                { length: 68, offset: 68 * index, index }
            )}
        >
        </SectionList>
    );
}
