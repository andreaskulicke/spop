import { allShop, selectCategories, selectCategory, selectItemsWithCategory, selectItemsWithDifferentCategory, setItemCategory } from "./store/dataSlice";
import { Appbar, IconButton, List } from "react-native-paper";
import { CategoriesStackParamList } from "./CategoriesNavigationScreen";
import { Item } from "./store/data/items";
import { ListSection } from "./ListSection";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { ReactElement, JSXElementConstructor, useState } from "react";
import { RootStackParamList } from "../App";
import { SectionList, SectionListData, SectionListRenderItemInfo, View } from "react-native";
import { StatusBarView } from "./StatusBarView";
import { useAppDispatch, useAppSelector } from "./store/hooks";

interface Data {
    title: string;
    icon: string;
    data: Item[];
    collapsed?: boolean;
    onExpandChange: (expanded: boolean) => void;
}

export function CategoryItemsScreen(props: {
    navigation: NavigationProp<RootStackParamList & CategoriesStackParamList>;
    route: RouteProp<CategoriesStackParamList, "CategoryItems">;
}) {
    const [itemsExpanded, setItemsExpanded] = useState(true);
    const [itemsNoExpanded, setItemsNoExpanded] = useState(true);
    const [itemsDifferentExpanded, setItemsDifferentExpanded] = useState(false);
    const category = useAppSelector(selectCategory(props.route.params.id));
    const categories = useAppSelector(selectCategories);
    const itemsCategory = useAppSelector(selectItemsWithCategory(category?.id));
    const itemsNoCategory = useAppSelector(selectItemsWithCategory(undefined));
    const itemsDifferentCategory = useAppSelector(selectItemsWithDifferentCategory(category?.id));
    const dispatch = useAppDispatch();

    function getCategoryName(categoryId: string | undefined): string | undefined {
        return categories.find(x => x.id === categoryId)?.name;
    }

    function handleEditPress(): void {
        if (category) {
            props.navigation.navigate("Category", { id: category.id });
        }
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
                ? <List.Item
                    title={info.item.name}
                    description={(info.item.categoryId !== category?.id) ? getCategoryName(info.item.categoryId) : undefined}
                    right={p =>
                        <View style={{ flexDirection: "row", alignItems: "center", height: 42 }}>
                            {
                                category && (!info.item.categoryId || (info.item.categoryId !== category?.id))
                                && <IconButton {...p} icon="archive-plus-outline" onPress={() => dispatch(setItemCategory({ itemId: info.item.id, categoryId: category?.id }))} />
                            }
                            {
                                info.item.categoryId
                                && <IconButton {...p} icon="archive-minus-outline" onPress={() => dispatch(setItemCategory({ itemId: info.item.id, categoryId: undefined }))} />
                            }
                        </View>
                    }
                    onPress={() => props.navigation.navigate("Item", { id: info.item.id })}
                />
                : <></>
        );
    }

    const data: SectionListData<Item, Data>[] = [
        {
            title: "Nicht zugewiesen",
            icon: "dots-horizontal",
            data: itemsNoCategory,
            collapsed: !itemsNoExpanded,
            onExpandChange: expanded => setItemsNoExpanded(expanded),
        },
        {
            title: "Dinge aus anderen Kategorien",
            icon: "shape",
            data: itemsDifferentCategory,
            collapsed: !itemsDifferentExpanded,
            onExpandChange: expanded => setItemsDifferentExpanded(expanded),
        },
    ];

    if (category) {
        data.unshift({
            title: "Dinge",
            icon: "cart",
            data: itemsCategory,
            collapsed: !itemsExpanded,
            onExpandChange: expanded => setItemsExpanded(expanded),
        });
    }
    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={category?.name ?? allShop.name} />
                {
                    category
                    && <Appbar.Action icon="pencil-outline" onPress={handleEditPress} />
                }
            </Appbar.Header>
            <SectionList
                sections={data}
                renderSectionHeader={handleRenderSectionHeader}
                renderItem={handleRenderItem}
            >
            </SectionList>
        </StatusBarView>
    )
}
