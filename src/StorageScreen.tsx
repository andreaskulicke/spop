import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { ScrollView } from "react-native";
import { Appbar, Card, TextInput } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { selectStorage, deleteStorage, setStorageName, setStorageDefaultCategory, selectCategories } from "./store/dataSlice";
import { CategoryMenu } from "./CategoryMenu";
import { StatusBarView } from "./StatusBarView";
import { useEffect, useState } from "react";

export function StorageScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Storage">;
}) {
    const [name, setName] = useState("");
    // Just register on category change in case the default category gets deleted via edit from here.
    // Re-render would be missing otherwise.
    const categories = useAppSelector(selectCategories);
    const storage = useAppSelector(selectStorage(props.route.params.id));
    const dispatch = useAppDispatch();

    function handleGoBack() {
        handleTextInputNameBlur();
        props.navigation.goBack();
    }

    function handleDeletePress(): void {
        dispatch(deleteStorage(storage.id));
        props.navigation.goBack();
    }

    function handleTextInputNameBlur(): void {
        if (storage) {
            dispatch(setStorageName({ storageId: storage.id, name: name.trim() }));
            setName(name.trim());
        }
    }

    function handleTextInputNameChange(text: string): void {
        setName(text);
    }

    useEffect(() => {
        setName(storage?.name ?? "");
    }, [storage])

    return (
        <StatusBarView bottomPadding>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title={storage?.name ?? "Vorrat"} />
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <ScrollView>
                <Card
                    style={{ margin: 8 }}
                >
                    <Card.Title title={"Allgemein"} />
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
                        categoryId={storage.defaultCategoryId}
                        title="Standart Kategorie"
                        onSetCategory={categoryId => dispatch(setStorageDefaultCategory({ storageId: storage.id, categoryId }))}
                    />
                </Card>
            </ScrollView>
        </StatusBarView>
    );
}
