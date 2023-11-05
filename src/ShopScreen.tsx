import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Appbar, Card, IconButton, List, Text, TextInput, TouchableRipple } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { deleteShop, selectShop, setShopCategoryShow, setShopName } from "./store/shopsSlice";
import { useState } from "react";
import { AvatarText } from "./AvatarText";
import uuid from 'react-native-uuid';
import { addCategory } from "./store/categoriesSlice";

export function ShopScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Shop">;
}) {
    const [categoriesExpanded, setCategoriesExpanded] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const categories = useAppSelector(state => state.categories);
    const shop = useAppSelector(selectShop(props.route.params.id));
    const dispatch = useAppDispatch();

    function handleAddCategoryPress(): void {
        const id = uuid.v4() as string;
        dispatch(addCategory(id));
        dispatch(setShopCategoryShow({ id: shop.id, categoryId: id, show: true }));
        props.navigation.navigate("Category", { id });
    }

    function handleDeletePress(): void {
        dispatch(deleteShop(shop.id));
        props.navigation.goBack();
    }

    function handleNameChange(text: string): void {
        dispatch(setShopName({ id: shop.id, name: text }));
    }

    const c = new Map(categories.map(x => [x.id, x]));
    const catsShown = shop.categoryIds?.map(x => c.get(x)).filter(x => !!x) ?? categories;
    const catsHidden = categories.filter(x => !catsShown.includes(x));

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={shop?.name ?? "Shop"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <ScrollView>
                <Card
                    style={{ margin: 8 }}
                >
                    <Card.Title title="Allgemein" />
                    <TextInput
                        label="Name"
                        mode="outlined"
                        style={{ margin: 8 }}
                        value={shop.name}
                        onChangeText={handleNameChange}
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
                                    {
                                        (catsHidden.length > 0)
                                        && <IconButton
                                            {...p}
                                            icon={showAllCategories ? "eye-off-outline" : "eye-outline"}
                                            onPress={() => {
                                                setShowAllCategories(v => !v);
                                                setCategoriesExpanded(true);
                                            }}
                                        />
                                    }
                                    <IconButton
                                        {...p}
                                        icon="plus"
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
                        && catsShown.map(x => {
                            return (
                                <List.Item
                                    key={x.id}
                                    title={x.name}
                                    left={p => <AvatarText {...p} label={x.name} />}
                                    right={p => <IconButton icon="eye-off-outline" onPress={() => dispatch(setShopCategoryShow({ id: shop.id, categoryId: x.id, show: false }))} />}
                                    onPress={() => props.navigation.navigate("Category", { id: x.id })}
                                />
                            );
                        })
                    }
                    {
                        categoriesExpanded && showAllCategories && (catsHidden.length > 0)
                        && <List.Section title="Nicht verwendet">
                            {
                                catsHidden.map(x => {
                                    return (
                                        <List.Item
                                            key={x.id}
                                            title={x.name}
                                            left={p => <AvatarText {...p} label={x.name} />}
                                            right={p => <IconButton icon="eye-outline" onPress={() => dispatch(setShopCategoryShow({ id: shop.id, categoryId: x.id, show: true }))} />}
                                            onPress={() => props.navigation.navigate("Category", { id: x.id })}
                                        />
                                    );
                                })
                            }
                        </List.Section>
                    }
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
