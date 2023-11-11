import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SafeAreaView, ScrollView } from "react-native";
import { Appbar, Card, TextInput, Text } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { selectStorage, deleteStorage, setStorageName, setStorageDefaultCategory } from "./store/dataSlice";
import { CategoryMenu } from "./CategoryMenu";

export function StorageScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Storage">;
}) {
    // Just register on category change in case the default category gets deleted via edit from here.
    // Re-render would be missing otherwise.
    const categories = useAppSelector(state => state.data.categories);
    const storage = useAppSelector(selectStorage(props.route.params.id));
    const dispatch = useAppDispatch();

    function handleDeletePress(): void {
        dispatch(deleteStorage(storage.id));
        props.navigation.goBack();
    }

    function handleNameChange(text: string): void {
        dispatch(setStorageName({ storageId: storage.id, name: text }));
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={storage?.name ?? "Storage"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <ScrollView>
                <Card
                    style={{ margin: 8 }}
                >
                    <Card.Title title={<Text>{"Allgemein"}</Text>} />
                    <TextInput
                        label="Name"
                        mode="outlined"
                        style={{ margin: 8 }}
                        value={storage.name}
                        onChangeText={handleNameChange}
                    />
                    <CategoryMenu
                        categoryId={storage.defaultCategoryId}
                        onSetCategory={categoryId => dispatch(setStorageDefaultCategory({ storageId: storage.id, categoryId }))}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
