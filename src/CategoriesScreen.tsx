import { NavigationProp } from "@react-navigation/native";
import { JSXElementConstructor, ReactElement } from "react";
import { ListRenderItemInfo, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Appbar, Divider, List, Tooltip, useTheme } from "react-native-paper";
import uuid from "react-native-uuid";
import { RootStackParamList } from "../App";
import { AppbarContentTitle } from "./AppbarContentTitle";
import { AreaItemTitle } from "./AreaItemTitle";
import { CategoriesStackParamList } from "./CategoriesNavigationScreen";
import { CategoryIcon } from "./CategoryIcon";
import { Count } from "./Count";
import { MainMenu } from "./MainMenu";
import { SearchBarList } from "./SearchBarList";
import { StatusBarView } from "./StatusBarView";
import { UnassignedBadge } from "./UnassignedBadge";
import { UndoSnackBar } from "./UndoSnackBar";
import { Category } from "./store/data/categories";
import {
    addCategory,
    allCategory,
    selectItems,
    selectSortedCategories,
} from "./store/dataSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";

export function CategoriesScreen(props: {
    navigation: NavigationProp<RootStackParamList & CategoriesStackParamList>;
}) {
    const items = useAppSelector(selectItems);
    const categories = useAppSelector(selectSortedCategories);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    function handleAddCategoryPress(): void {
        const id = uuid.v4() as string;
        dispatch(addCategory(id));
        props.navigation.navigate("Category", { id });
    }

    function handleCategoryPress(id: string | undefined): void {
        props.navigation.navigate("CategoryItems", { id });
    }

    function handleRenderItem(
        info: ListRenderItemInfo<Category>,
    ): ReactElement<any, string | JSXElementConstructor<any>> | null {
        if (info.item.id === allCategory.id) {
            return (
                <View>
                    <List.Item
                        title="Alle Dinge"
                        style={{ backgroundColor: theme.colors.background }}
                        left={(p) => <CategoryIcon {...p} icon="check-all" />}
                        right={(p) => (
                            <UnassignedBadge
                                p={p}
                                tooltip="Gewünschte Dinge und ohne Kategorie"
                                unassignedFilter={(item) => !item.categoryId}
                            />
                        )}
                        onPress={() => handleCategoryPress(undefined)}
                    />
                    <Divider />
                </View>
            );
        }

        const count = items.filter(
            (i) => i.wanted && i.categoryId === info.item.id,
        ).length;
        return (
            <List.Item
                key={info.item.id}
                title={(p) => (
                    <AreaItemTitle
                        p={p}
                        title={info.item.name}
                        bold={count > 0}
                    />
                )}
                left={(p) => <CategoryIcon {...p} icon={info.item.icon} />}
                right={(p) => <Count {...p} count={count} />}
                onPress={() => handleCategoryPress(info.item.id)}
            />
        );
    }

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <AppbarContentTitle title="Kategorien" />
                <Tooltip title="Neue Kategorie hinzufügen">
                    <Appbar.Action
                        icon="plus-outline"
                        onPress={handleAddCategoryPress}
                    />
                </Tooltip>
                <MainMenu
                    navigation={
                        props.navigation as NavigationProp<RootStackParamList>
                    }
                />
            </Appbar.Header>
            <SearchBarList
                list={
                    <View>
                        <Divider />
                        <FlatList
                            data={[allCategory].concat(categories)}
                            renderItem={handleRenderItem}
                            // BUG: Does not allow clicking on "Alle Dinge" when not fully scrolled up
                            // stickyHeaderIndices={[0]}
                            // stickyHeaderHiddenOnScroll={true}
                        ></FlatList>
                    </View>
                }
            />
            <UndoSnackBar contextName="CategoriesScreen" />
        </StatusBarView>
    );
}
