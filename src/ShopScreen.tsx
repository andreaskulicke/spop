import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SafeAreaView, ScrollView } from "react-native";
import { Appbar, Card, TextInput } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { deleteShop, selectShop, setShopName } from "./store/shopsSlice";

export function ShopScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "Shop">;
}) {
    const shop = useAppSelector(selectShop(props.route.params.id));
    const dispatch = useAppDispatch();

    function handleDeletePress(): void {
        dispatch(deleteShop(shop.id));
        props.navigation.goBack();
    }

    function handleNameChange(text: string): void {
        dispatch(setShopName({ id: shop.id, name: text }));
    }

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
            </ScrollView>
        </SafeAreaView>
    );
}
