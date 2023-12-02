import { allShop, selectCategories, selectCategory, selectItemsWithCategory, selectItemsWithDifferentCategory, setItemCategory } from "./store/dataSlice";
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

export function CategoryItemsScreen(props: {
    navigation: NavigationProp<RootStackParamList & CategoriesStackParamList>;
    route: RouteProp<CategoriesStackParamList, "CategoryItems">;
}) {
    const category = useAppSelector(selectCategory(props.route.params.id));
    const categories = useAppSelector(selectCategories);
    const itemsCategory = useAppSelector(selectItemsWithCategory(category?.id));
    const itemsNoCategory = useAppSelector(selectItemsWithCategory(undefined));
    const itemsDifferentCategory = useAppSelector(selectItemsWithDifferentCategory(category?.id));
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
                        {
                            category && (!item.categoryId || (item.categoryId !== category?.id))
                            && <IconButton {...p} icon="archive-plus-outline" onPress={() => dispatch(setItemCategory({ itemId: item.id, categoryId: category?.id }))} />
                        }
                        {
                            item.categoryId
                            && <IconButton {...p} icon="archive-minus-outline" onPress={() => dispatch(setItemCategory({ itemId: item.id, categoryId: undefined }))} />
                        }
                    </View>
                }
                onPress={() => props.navigation.navigate("Item", { id: item.id })}
            />
        );
    }

    const data: ItemsSectionListSection[] = [
        {
            title: "Nicht zugewiesen",
            icon: "dots-horizontal",
            data: itemsNoCategory,
        },
        {
            title: "Dinge aus anderen Kategorien",
            icon: "shape",
            data: itemsDifferentCategory,
        },
    ];

    if (category) {
        data.unshift({
            title: "Dinge",
            icon: "cart",
            data: itemsCategory,
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
            <ItemsSectionList
                data={data}
                renderItem={handleRenderItem}
            />
        </StatusBarView>
    )
}
