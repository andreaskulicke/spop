import { selectCategories, selectCategory, selectItemsNotWanted, selectItemsNotWantedWithCategory, selectItemsNotWantedWithDifferentCategory, selectItemsWanted, selectItemsWantedWithCategory, setItemCategory, setItemWanted, sortItemsByCategory } from "./store/dataSlice";
import { Appbar, IconButton, List, useTheme } from "react-native-paper";
import { CategoriesStackParamList } from "./CategoriesNavigationScreen";
import { Item, itemListStyle } from "./store/data/items";
import { ItemsSectionList, ItemsSectionListSection } from "./ItemsSectionList";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { ReactElement, JSXElementConstructor } from "react";
import { RootStackParamList } from "../App";
import { View } from "react-native";
import { StatusBarView } from "./StatusBarView";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { SearchBarList } from "./SearchBarList";

export function CategoryItemsScreen(props: {
    navigation: NavigationProp<RootStackParamList & CategoriesStackParamList>;
    route: RouteProp<CategoriesStackParamList, "CategoryItems">;
}) {
    const category = useAppSelector(selectCategory(props.route.params.id));
    const categories = useAppSelector(selectCategories);
    const itemsWanted = useAppSelector(selectItemsWanted);
    const itemsWantedThisCategory = useAppSelector(selectItemsWantedWithCategory(category?.id));
    const itemsWantedWithoutCategory = useAppSelector(selectItemsWantedWithCategory(undefined));
    const itemsNotWanted = useAppSelector(selectItemsNotWanted);
    const itemsNotWantedThisCategory = useAppSelector(selectItemsNotWantedWithCategory(category?.id));
    const itemsNotWantedDifferentCategory = useAppSelector(selectItemsNotWantedWithDifferentCategory(category?.id));
    const dispatch = useAppDispatch();
    const theme = useTheme();

    function getCategoryName(categoryId: string | undefined): string | undefined {
        return categories.find(x => x.id === categoryId)?.name;
    }

    function handleEditPress(): void {
        if (category) {
            props.navigation.navigate("Category", { id: category.id });
        }
    }

    function handleRenderItem(item: Item): ReactElement<any, string | JSXElementConstructor<any>> | null {
        return (
            <List.Item
                title={item.name}
                description={(item.categoryId !== category?.id) ? getCategoryName(item.categoryId) : undefined}
                style={itemListStyle(theme)}
                right={p =>
                    <View style={{ flexDirection: "row", alignItems: "center", height: 42 }}>
                        <IconButton
                            {...p}
                            icon={item.wanted ? "minus-thick" : "plus-outline"}
                            onPress={() => dispatch(setItemWanted({ itemId: item.id, wanted: !item.wanted }))}
                        />
                        {
                            !item.wanted && item.categoryId
                            && <IconButton {...p} icon="archive-minus-outline" onPress={() => dispatch(setItemCategory({ itemId: item.id, categoryId: undefined }))} />
                        }
                        {
                            category && (!item.categoryId || (item.categoryId !== category?.id))
                            && <IconButton {...p} icon="archive-plus-outline" onPress={() => dispatch(setItemCategory({ itemId: item.id, categoryId: category?.id }))} />
                        }
                    </View>
                }
                onPress={() => props.navigation.navigate("Item", { id: item.id })}
            />
        );
    }

    const c = new Map(categories.map(x => [x.id, x]));

    const data: ItemsSectionListSection[] = [
        {
            title: "Dinge",
            icon: "cart",
            data: !category
                ? itemsWanted.sort((a, b) => sortItemsByCategory(c, a, b))
                : itemsWantedThisCategory,
        },
        {
            title: "Ohne Kategorie",
            icon: "archive-off-outline",
            data: itemsWantedWithoutCategory,
        },
    ];

    if (category === undefined) {
        data.push(
            {
                title: "Zuletzt",
                icon: "history",
                data: itemsNotWanted.sort((a, b) => sortItemsByCategory(c, a, b)),
            },
        );
    } else {
        data.push(
            {
                title: `Zuletzt in ${category?.name}`,
                icon: "history",
                collapsed: true,
                data: itemsNotWantedThisCategory,
            },
            {
                title: "Zuletzt in anderen Kategorien",
                icon: "history",
                collapsed: true,
                data: itemsNotWantedDifferentCategory,
            },
        );
    }

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={category?.name ?? "Alle Dinge"} />
                {
                    category
                    && <Appbar.Action icon="pencil-outline" onPress={handleEditPress} />
                }
            </Appbar.Header>
            <SearchBarList
                list={
                    <ItemsSectionList
                        data={data}
                        renderItem={handleRenderItem}
                    />
                }
                category={category}
            />
        </StatusBarView>
    )
}
