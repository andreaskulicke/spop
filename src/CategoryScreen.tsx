import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SafeAreaView, ScrollView } from "react-native";
import { Appbar, Card, TextInput } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { deleteCategory, selectCategory, setCategoryName } from "./store/categoriesSlice";

export function CategoryScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Category">;
}) {
    const category = useAppSelector(selectCategory(props.route.params.id));
    const dispatch = useAppDispatch();

    function handleDeletePress(): void {
        if (category) {
            dispatch(deleteCategory(category.id));
        }
        props.navigation.goBack();
    }

    function handleNameChange(text: string): void {
        if (category) {
            dispatch(setCategoryName({ id: category.id, name: text }));
        }
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={category?.name ?? "Category"} />
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
                        value={category.name}
                        onChangeText={handleNameChange}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
