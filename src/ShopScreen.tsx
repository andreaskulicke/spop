import { Appbar, Card, IconButton, List, TextInput, TouchableRipple } from "react-native-paper";
import { Category } from "./store/data/categories";
import { CategoryIcon } from "./CategoryIcon";
import { CategoryMenu } from "./CategoryMenu";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { NestableDraggableFlatList, NestableScrollContainer, RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { ReactNode, useEffect, useState } from "react";
import { RootStackParamList } from "../App";
import { selectShop, addCategory, addShopCategory, setShopCategoryShow, deleteShop, setShopName, setShopCategories, setShopDefaultCategory, selectCategories, setStorageName } from "./store/dataSlice";
import { StatusBarView } from "./StatusBarView";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { View } from "react-native";
import uuid from 'react-native-uuid';

export function ShopScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Shop">;
}) {
    const [name, setName] = useState("");
    const [categoriesExpanded, setCategoriesExpanded] = useState(false);
    const categories = useAppSelector(selectCategories);
    const shop = useAppSelector(selectShop(props.route.params.id));
    const dispatch = useAppDispatch();

    function handleGoBack() {
        handleTextInputNameBlur();
        props.navigation.goBack();
    }

    function handleAddCategoryPress(): void {
        const id = uuid.v4() as string;
        dispatch(addCategory(id));
        dispatch(addShopCategory({ shopId: shop.id, categoryId: id }));
        dispatch(setShopCategoryShow({ shopId: shop.id, categoryId: id, show: true }));
        props.navigation.navigate("Category", { id });
    }

    function handleDeletePress(): void {
        dispatch(deleteShop(shop.id));
        props.navigation.goBack();
    }

    function handleRenderItem(params: RenderItemParams<Category>): ReactNode {
        return (
            <ScaleDecorator>
                <List.Item
                    key={params.item.id}
                    title={params.item.name}
                    left={p => <CategoryIcon {...p} icon={params.item.icon} />}
                    right={p => <IconButton icon="eye-off-outline" onPress={() => dispatch(setShopCategoryShow({ shopId: shop.id, categoryId: params.item.id, show: false }))} />}
                    onPress={() => props.navigation.navigate("Category", { id: params.item.id })}
                    onLongPress={() => params.drag()}
                />
            </ScaleDecorator>
        );
    }

    function handleTextInputNameBlur(): void {
        if (shop) {
            dispatch(setShopName({ shopId: shop.id, name: name.trim() }));
            setName(name.trim());
        }
    }

    function handleTextInputNameChange(text: string): void {
        setName(text);
    }

    useEffect(() => {
        setName(shop?.name ?? "");
    }, [shop])

    const c = new Map(categories.map(x => [x.id, x]));
    const catsShown = shop.categoryIds?.map(x => c.get(x)!).filter(x => !!x) ?? categories;
    const catsHidden = categories.filter(x => !catsShown.includes(x));

    return (
        <StatusBarView bottomPadding>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title={shop?.name ?? "Shop"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <NestableScrollContainer>
                <Card
                    style={{ margin: 8 }}
                >
                    <Card.Title title="Allgemein" />
                    <TextInput
                        label="Name"
                        mode="outlined"
                        selectTextOnFocus
                        style={{ margin: 8 }}
                        value={name}
                        onBlur={handleTextInputNameBlur}
                        onChangeText={handleTextInputNameChange}
                    />
                    <CategoryMenu
                        categoryId={shop.defaultCategoryId}
                        title="Standart Kategorie"
                        onSetCategory={categoryId => dispatch(setShopDefaultCategory({ shopId: shop.id, categoryId }))}
                    />
                </Card>
                <Card
                    style={{ margin: 8 }}
                >
                    <TouchableRipple
                        onPress={() => setCategoriesExpanded(x => !x)}
                    >
                        <Card.Title
                            title="Kategorien"
                            right={p =>
                                <View style={{ flexDirection: "row" }}>
                                    <IconButton
                                        {...p}
                                        icon="plus-outline"
                                        onPress={handleAddCategoryPress}
                                    />
                                    <IconButton
                                        {...p}
                                        icon={categoriesExpanded ? "chevron-up" : "chevron-down"}
                                        onPress={() => setCategoriesExpanded(x => !x)}
                                    />
                                </View>
                            }
                        />
                    </TouchableRipple>
                    {
                        categoriesExpanded
                        && <NestableDraggableFlatList
                            data={catsShown}
                            keyExtractor={x => x.id}
                            renderItem={handleRenderItem}
                            onDragEnd={({ data }) => dispatch(setShopCategories({ shopId: shop.id, categoryIds: [...data.map(x => x.id), ...catsHidden.map(x => x.id)] }))}
                        />
                    }
                    {
                        categoriesExpanded && (catsHidden.length > 0)
                        && <List.Section title="Nicht verwendet">
                            {
                                catsHidden.map(x => {
                                    return (
                                        <List.Item
                                            key={x.id}
                                            title={x.name}
                                            left={p => <CategoryIcon {...p} icon={x.icon} />}
                                            right={p => <IconButton icon="eye-outline" onPress={() => dispatch(setShopCategoryShow({ shopId: shop.id, categoryId: x.id, show: true }))} />}
                                            onPress={() => props.navigation.navigate("Category", { id: x.id })}
                                        />
                                    );
                                })
                            }
                        </List.Section>
                    }
                </Card>
            </NestableScrollContainer>
        </StatusBarView>
    );
}
