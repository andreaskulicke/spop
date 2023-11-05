import { useState } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Appbar, Avatar, List, Menu, useTheme, Text, Divider } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { ShopsStackParamList } from "./ShopsNavigationScreen";
import { addShop, allShop, setActiveShop } from "./store/shopsSlice";
import uuid from 'react-native-uuid';
import { AvatarText } from "./AvatarText";

export function ShopsScreen(props: {
    navigation: NavigationProp<RootStackParamList & ShopsStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(state => state.items);
    const shops = useAppSelector(state => state.shops);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    function handleDotsPress(): void {
        setMenuVisible(true);
    }

    function handleAddShopPress(): void {
        setMenuVisible(false);
        const id = uuid.v4() as string;
        dispatch(addShop(id));
        props.navigation.navigate("Shop", { id });
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
                <Appbar.Action icon="plus" onPress={handleAddShopPress} />
                <Menu
                    anchor={<Appbar.Action icon="dots-vertical" onPress={handleDotsPress} />}
                    anchorPosition="bottom"
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                >
                    <Menu.Item leadingIcon="cog-outline" title="Einstellungen" onPress={handleSettingsPress} />
                </Menu>
            </Appbar.Header>
            <Divider />
            <List.Item
                left={p =>
                    <Avatar.Icon
                        {...p}
                        color={theme.colors.primaryContainer}
                        icon="check-all"
                        size={40}
                    />}
                right={p =>
                    <Text {...p} variant="labelMedium">
                        {items.items.filter(i => i.wanted).length}
                    </Text>
                }
                title={allShop.name}
                onPress={() => handleShopPress(allShop.id)}
            />
            <Divider />
            <List.Section>
                <ScrollView keyboardShouldPersistTaps="always">
                    {
                        shops.shops.map(x => <List.Item
                            key={x.id}
                            title={x.name}
                            left={p => <AvatarText {...p} label={x.name} />}
                            right={p =>
                                <Text {...p} variant="labelMedium">
                                    {items.items.filter(i => i.wanted && i.shops.find(s => s.shopId === x.id)).length}
                                </Text>
                            }
                            onPress={() => handleShopPress(x.id)}
                        />)
                    }
                </ScrollView>
            </List.Section>
        </SafeAreaView>
    );
}
