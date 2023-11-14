import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { ScrollView, View } from "react-native";
import { Appbar, Card, Portal, TextInput, Dialog } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { deleteCategory, selectCategory, setCategoryIcon, setCategoryName } from "./store/dataSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { CategoryIcon } from "./CategoryIcon";

const categoryIcons = [
    "baguette",
    "barley",
    "candy-outline",
    "carrot",
    "coffee",
    "corn",
    "cow",
    "egg-outline",
    "flower-outline",
    "food-apple-outline",
    "fridge-outline",
    "fruit-cherries",
    "fruit-grapes",
    "glass-cocktail",
    "home-outline",
    "ice-cream",
    "ice-pop",
    "kettle-outline",
    "leaf",
    "liquor",
    "muffin",
    "noodles",
    "peanut-outline",
    "pig-variant-outline",
    "pizza",
    "popcorn",
    "pot-outline",
    "rice",
    "shaker-outline",
    "soy-sauce",
    "tea-outline",

    "dots-horizontal",
];

export function CategoryScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Category">;
}) {
    const [iconModalVisible, setIconModalVisible] = useState(false);
    const category = useAppSelector(selectCategory(props.route.params.id));
    const dispatch = useAppDispatch();

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

    function handleNameChange(text: string): void {
        if (category) {
            dispatch(setCategoryName({ categoryId: category.id, name: text }));
        }
    }

    return (
        <SafeAreaView>
            <Appbar.Header elevated statusBarHeight={0}>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={category?.name ?? "Category"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <ScrollView>
                <Card
                    style={{ margin: 8 }}
                >
                    <Card.Title title="Allgemein" />
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <CategoryIcon icon={category?.icon} onPress={handleIconPress} />
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
                            style={{ flex: 1, marginVertical: 8, marginRight: 8 }}
                            value={category?.name ?? ""}
                            onChangeText={handleNameChange}
                        />
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

function IconModal(props: {
    icons: string[];
    selectedIcon?: string;
    visible?: boolean;
    onClose: (icon?: string) => void;
}) {
    return (
        <Portal>
            <Dialog
                visible={!!props.visible}
                onDismiss={() => props.onClose()}
            >
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
                            {
                                props.icons.map(x => (
                                    <CategoryIcon key={x} icon={x} selected={x === props.selectedIcon} onPress={() => props.onClose(x)} />
                                ))
                            }
                        </View>
                    </ScrollView>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
}
