import { addCategory, selectItems, selectSortedCategories } from "./store/dataSlice";
import { Appbar, Tooltip, Menu, Divider, List } from "react-native-paper";
import { AreaItemTitle } from "./AreaItemTitle";
import { CategoriesStackParamList } from "./CategoriesNavigationScreen";
import { Category } from "./store/data/categories";
import { Count } from "./Count";
import { CategoryIcon } from "./CategoryIcon";
import { JSXElementConstructor, ReactElement, useState } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SearchBarList } from "./SearchBarList";
import { StatusBarView } from "./StatusBarView";
import { UnassignedBadge } from "./UnassignedBadge";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import uuid from 'react-native-uuid';

export function CategoriesScreen(props: {
    navigation: NavigationProp<RootStackParamList & CategoriesStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(selectItems);
    const categories = useAppSelector(selectSortedCategories);
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

    function handleCategoryPress(id: string | undefined): void {
        props.navigation.navigate("CategoryItems", { id });
    }

    function handleRenderItem(info: ListRenderItemInfo<Category>): ReactElement<any, string | JSXElementConstructor<any>> | null {
        const count = items.filter(i => i.wanted && i.categoryId === info.item.id).length;
        return (
            <List.Item
                key={info.item.id}
                title={p => <AreaItemTitle p={p} title={info.item.name} bold={count > 0} />}
                left={p => <CategoryIcon {...p} icon={info.item.icon} />}
                right={p => <Count {...p} count={count} />}
                onPress={() => handleCategoryPress(info.item.id)}
            />
        );
    }

    const heightOfAllThingsListItem = 68;

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
            <SearchBarList
                list={
                    <View style={{ paddingBottom: heightOfAllThingsListItem }}>
                        <Divider />
                        <List.Item
                            title="Alle Dinge"
                            style={{ height: heightOfAllThingsListItem }}
                            left={p => <CategoryIcon {...p} icon="check-all" />}
                            right={p =>
                                <UnassignedBadge
                                    p={p}
                                    tooltip="Gewünschte Dinge und ohne Kategorie"
                                    unassignedFilter={item => !item.categoryId}
                                />
                            }
                            onPress={() => handleCategoryPress(undefined)}
                        />
                        <Divider />
                        <FlatList
                            data={categories}
                            renderItem={handleRenderItem}
                        >
                        </FlatList>
                    </View>
                }
            />
        </StatusBarView>
    )
}
