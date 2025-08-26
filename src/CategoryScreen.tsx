import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { Keyboard, ScrollView, View } from "react-native";
import { Appbar, Card, Portal, TextInput, Dialog } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
    deleteCategory,
    selectCategory,
    setCategoryIcon,
    setCategoryName,
} from "./store/dataSlice";
import { useEffect, useState } from "react";
import { CategoryIcon } from "./CategoryIcon";
import { StatusBarView } from "./StatusBarView";
import { categoryIcons } from "./store/data/categories";

export function CategoryScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Category">;
}) {
    const [name, setName] = useState("");
    const [iconModalVisible, setIconModalVisible] = useState(false);
    const category = useAppSelector((state) =>
        selectCategory(state, props.route.params.id),
    );
    const dispatch = useAppDispatch();

    function handleGoBack() {
        handleTextInputNameBlur();
        props.navigation.goBack();
    }

    function handleDeletePress(): void {
        if (category) {
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
        <StatusBarView bottomPadding>
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
