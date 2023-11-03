import { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Appbar, List, Menu } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { ShopsStackParamList } from "./ShopsNavigationScreen";
import { allShop, setActiveShop } from "./store/shopsSlice";

export function ShopsScreen(props: {
    navigation: NavigationProp<RootStackParamList & ShopsStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const shops = useAppSelector(state => state.shops);
    const dispatch = useAppDispatch();

    function handleDotsPress(): void {
        setMenuVisible(true);
    }

    function handleSettingsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Settings");
    }

    function handleShopPress(id: string): void {
        dispatch(setActiveShop(id));
        props.navigation.navigate("Shopping");
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.Content title="Shops" />
                <Appbar.Action icon="plus" />
                <Menu
                    anchor={<Appbar.Action icon="dots-vertical" onPress={handleDotsPress} />}
                    anchorPosition="bottom"
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                >
                    <Menu.Item leadingIcon="cog-outline" title="Einstellungen" onPress={handleSettingsPress} />
                </Menu>
            </Appbar.Header>
            <List.Section>
                <List.Item
                    left={p => <List.Icon {...p} icon="check-all" />}
                    title={allShop.name}
                    onPress={() => handleShopPress(allShop.id)}
                />
            </List.Section>
            <List.Section title="Shops">
                <ScrollView keyboardShouldPersistTaps="always">
                    {
                        shops.shops.map(x => <List.Item
                            key={x.id}
                            title={x.name}
                            onPress={() => handleShopPress(x.id)}
                        />)
                    }
                </ScrollView>
            </List.Section>
        </SafeAreaView>
    );
}
