import { addCategory, selectItems, selectSortedCategories } from "./store/dataSlice";
import { Appbar, Tooltip, Menu, Divider, List } from "react-native-paper";
import { CategoriesStackParamList } from "./CategoriesNavigationScreen";
import { Category } from "./store/data/categories";
import { CategoryIcon } from "./CategoryIcon";
import { CategoryCount, Count } from "./Count";
import { FlatList } from "react-native-gesture-handler";
import { JSXElementConstructor, ReactElement, useState } from "react";
import { ListRenderItemInfo } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StatusBarView } from "./StatusBarView";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import uuid from 'react-native-uuid';

export function CategoriesScreen(props: {
    navigation: NavigationProp<RootStackParamList & CategoriesStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const categories = useAppSelector(selectSortedCategories);
    const items = useAppSelector(selectItems);
    const dispatch = useAppDispatch();

    function handleAddCategoryPress(): void {
        const id = uuid.v4() as string;
        dispatch(addCategory(id));
        props.navigation.navigate("Category", { id });
    }

    function handleDotsPress(): void {
        setMenuVisible(true);
    }

    function handleSettingsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Settings");
    }

    function handleRenderItem(info: ListRenderItemInfo<Category>): ReactElement<any, string | JSXElementConstructor<any>> | null {
        return (
            <List.Item
                key={info.item.id}
                title={info.item.name}
                left={p => <CategoryIcon {...p} icon={info.item.icon} />}
                right={p => <CategoryCount {...p} categoryId={info.item.id} />}
                onPress={() => props.navigation.navigate("CategoryItems", { id: info.item.id })}
            />
        );
    }

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.Content title="Kategorien" />
                <Tooltip title="Neue Kategorie hinzufügen">
                    <Appbar.Action icon="plus-outline" onPress={handleAddCategoryPress} />
                </Tooltip>
                <Menu
                    anchor={<Appbar.Action icon="dots-vertical" onPress={handleDotsPress} />}
                    anchorPosition="bottom"
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                >
                    <Menu.Item leadingIcon="cog-outline" title="Einstellungen" onPress={handleSettingsPress} />
                </Menu>
            </Appbar.Header>
            <List.Item
                title="Nicht zugewiesen"
                left={p => <CategoryIcon {...p} icon="check-all" />}
                right={p => <CategoryCount {...p} categoryId={undefined} />}
                onPress={() => props.navigation.navigate("CategoryItems", { id: undefined })}
            />
            <Divider />
            <FlatList
                data={categories}
                renderItem={handleRenderItem}
            >
            </FlatList>
        </StatusBarView>
    )

    function getCount(categoryId: string | undefined): number {
        return items.reduce((total, i) => (i.categoryId === categoryId) ? (total + 1) : total, 0);
    }
}
