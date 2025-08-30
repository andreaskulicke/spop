import { NavigationProp } from "@react-navigation/native";
import { useState } from "react";
import { Appbar, Divider, Menu } from "react-native-paper";
import { RootStackParamList } from "../App";

export function MainMenu(props: {
    navigation: NavigationProp<RootStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);

    function handleDotsPress(): void {
        setMenuVisible(true);
    }

    function handleShoppingListsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("ShoppingLists");
    }

    function handleSettingsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Settings");
    }

    return (
        <Menu
            anchor={
                <Appbar.Action icon="dots-vertical" onPress={handleDotsPress} />
            }
            anchorPosition="bottom"
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
        >
            <Menu.Item
                leadingIcon="format-list-bulleted"
                title="Shopping Listen"
                onPress={handleShoppingListsPress}
            />
            <Divider />
            <Menu.Item
                leadingIcon="cog-outline"
                title="Einstellungen"
                onPress={handleSettingsPress}
            />
        </Menu>
    );
}
