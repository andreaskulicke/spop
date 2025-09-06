import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { Keyboard, ScrollView, View } from "react-native";
import {
    Appbar,
    Card,
    Portal,
    TextInput,
    Dialog,
    IconButton,
    List,
    TouchableRipple,
    useTheme,
} from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
    deleteCategory,
    selectCategory,
    selectShops,
    selectShopsHiddenInCategory,
    selectShopsShownInCategory,
    setCategoryIcon,
    setCategoryName,
    setShopCategoryShow,
} from "./store/dataSlice";
import React, { useEffect, useState } from "react";
import { CategoryIcon } from "./CategoryIcon";
import { StatusBarView } from "./StatusBarView";
import { categoryIcons } from "./store/data/categories";
import { SubSection } from "./ShopScreen";
import { getShopImage, Shop } from "./store/data/shops";
import { setUiUndo } from "./store/uiSlice";

export function CategoryScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Category">;
}) {
    const [name, setName] = useState("");
    const [iconModalVisible, setIconModalVisible] = useState(false);
    const [shopsExpanded, setShopsExpanded] = useState(true);
    const category = useAppSelector((state) =>
        selectCategory(state, props.route.params.id),
    );
    const shops = useAppSelector(selectShops);
    const dispatch = useAppDispatch();

    const shopsShown = useAppSelector((state) =>
        selectShopsShownInCategory(state, category?.id),
    );
    const shopsHidden = useAppSelector((state) =>
        selectShopsHiddenInCategory(state, category?.id),
    );

    function handleGoBack() {
        handleTextInputNameBlur();
        props.navigation.goBack();
    }

    function handleAllShopsPress(show: boolean): void {
        if (category) {
            for (const shop of shops) {
                dispatch(
                    setShopCategoryShow({
                        shopId: shop.id,
                        categoryId: category.id,
                        show: show,
                    }),
                );
            }
        }
    }

    function handleDeletePress(): void {
        if (category) {
            dispatch(setUiUndo("UNDO_DATA"));
            dispatch(deleteCategory(category.id));
        }
        props.navigation.goBack();
    }

    function handleIconPress(): void {
        setIconModalVisible(true);
    }

    function handleIconModalClose(icon?: string): void {
        setIconModalVisible(false);
        if (category && icon) {
            dispatch(setCategoryIcon({ categoryId: category.id, icon: icon }));
        }
    }

    function handleTextInputNameBlur(): void {
        if (category) {
            const n = name.trim();
            if (n) {
                dispatch(setCategoryName({ categoryId: category.id, name: n }));
                setName(n);
            }
        }
    }

    function handleTextInputNameChange(text: string): void {
        setName(text);
    }

    useEffect(() => {
        const s = Keyboard.addListener("keyboardDidHide", () =>
            handleTextInputNameBlur(),
        );
        return () => s.remove();
    }, []);

    useEffect(() => {
        setName(category?.name ?? "");
    }, [category]);

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title={category?.name ?? "Category"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <ScrollView>
                <Card style={{ margin: 8 }}>
                    <Card.Title title="Allgemein" />
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <CategoryIcon
                            icon={category?.icon}
                            onPress={handleIconPress}
                        />
                        <IconModal
                            icons={categoryIcons}
                            selectedIcon={category?.icon}
                            visible={iconModalVisible}
                            onClose={handleIconModalClose}
                        />
                        <TextInput
                            label="Name"
                            mode="outlined"
                            selectTextOnFocus
                            style={{
                                flex: 1,
                                marginVertical: 8,
                                marginRight: 8,
                            }}
                            value={name}
                            onBlur={handleTextInputNameBlur}
                            onChangeText={handleTextInputNameChange}
                        />
                    </View>
                </Card>
                <Card style={{ margin: 8 }}>
                    <TouchableRipple
                        onPress={() => setShopsExpanded((x) => !x)}
                    >
                        <Card.Title
                            title="Shops"
                            right={(p) => (
                                <View style={{ flexDirection: "row" }}>
                                    <IconButton
                                        {...p}
                                        icon={
                                            shopsExpanded
                                                ? "chevron-up"
                                                : "chevron-down"
                                        }
                                        onPress={() =>
                                            setShopsExpanded((x) => !x)
                                        }
                                    />
                                </View>
                            )}
                        />
                    </TouchableRipple>
                    {shopsExpanded && (
                        <SubSection
                            title="Verwendet"
                            icon="eye-off-outline"
                            onButtonPress={() => handleAllShopsPress(false)}
                        >
                            {shopsShown.map((x) => (
                                <ListItem
                                    key={x.id}
                                    navigation={props.navigation}
                                    categoryId={category!.id}
                                    shop={x}
                                    show={false}
                                />
                            ))}
                        </SubSection>
                    )}
                    {shopsExpanded && shopsHidden.length > 0 && (
                        <SubSection
                            title="Nicht verwendet"
                            icon="eye-outline"
                            onButtonPress={() => handleAllShopsPress(true)}
                        >
                            {shopsHidden.map((x) => (
                                <ListItem
                                    key={x.id}
                                    navigation={props.navigation}
                                    categoryId={category!.id}
                                    shop={x}
                                    show={true}
                                />
                            ))}
                        </SubSection>
                    )}
                </Card>
            </ScrollView>
        </StatusBarView>
    );
}

function IconModal(props: {
    icons: readonly string[];
    selectedIcon?: string;
    visible?: boolean;
    onClose: (icon?: string) => void;
}) {
    return (
        <Portal>
            <Dialog visible={!!props.visible} onDismiss={() => props.onClose()}>
                <Dialog.Content>
                    <ScrollView>
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "space-evenly",
                                gap: 16,
                            }}
                        >
                            {props.icons.map((x) => (
                                <CategoryIcon
                                    key={x}
                                    icon={x}
                                    selected={x === props.selectedIcon}
                                    onPress={() => props.onClose(x)}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}

function ListItem(props: {
    navigation: NavigationProp<RootStackParamList>;
    shop: Shop;
    categoryId: string;
    show: boolean;
}) {
    const dispatch = useAppDispatch();
    const theme = useTheme();

    return (
        <List.Item
            title={props.shop.name}
            left={(p) => getShopImage(props.shop, theme, { ...p })}
            right={(p) => (
                <IconButton
                    icon={props.show ? "eye-outline" : "eye-off-outline"}
                    onPress={() =>
                        dispatch(
                            setShopCategoryShow({
                                shopId: props.shop.id,
                                categoryId: props.categoryId,
                                show: props.show,
                            }),
                        )
                    }
                />
            )}
            onPress={() =>
                props.navigation.navigate("Shop", {
                    id: props.shop.id,
                })
            }
        />
    );
}
