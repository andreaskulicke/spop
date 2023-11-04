import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SafeAreaView, ScrollView } from "react-native";
import { Appbar, Card, TextInput } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { deleteStorage, selectStorage, setStorageName } from "./store/storagesSlice";

export function StorageScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Storage">;
}) {
    const storage = useAppSelector(selectStorage(props.route.params.id));
    const dispatch = useAppDispatch();

    function handleDeletePress(): void {
        dispatch(deleteStorage(storage.id));
        props.navigation.goBack();
    }

    function handleNameChange(text: string): void {
        dispatch(setStorageName({ id: storage.id, name: text }));
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
                    <Card.Title title="Allgemein" />
                    <TextInput
                        label="Name"
                        mode="outlined"
                        style={{ margin: 8 }}
                        value={storage.name}
                        onChangeText={handleNameChange}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
