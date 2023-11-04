import { SafeAreaView, ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Appbar, Avatar, List, Menu, Surface, useTheme } from "react-native-paper";
import { useState } from "react";
import { allStorage, setActiveStorage } from "./store/storagesSlice";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StoragesStackParamList } from "./StoragesNavigationScreen";

export function StoragesScreen(props: {
    navigation: NavigationProp<RootStackParamList & StoragesStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const storages = useAppSelector(state => state.storages);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    function handleDotsPress(): void {
        setMenuVisible(true);
    }

    function handleSettingsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Settings");
    }

    function handleStoragePress(id: string): void {
        dispatch(setActiveStorage(id));
        props.navigation.navigate("Fill");
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.Content title="Storages" />
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
            <Surface
                style={{ margin: 8 }}
            >
                <List.Item
                    left={p => <List.Icon {...p} icon="check-all" />}
                    title={allStorage.name}
                    onPress={() => handleStoragePress(allStorage.id)}
                />
            </Surface>
            <List.Section title="Storages">
                <ScrollView keyboardShouldPersistTaps="always">
                    {
                        storages.storages.map(x => <List.Item
                            key={x.id}
                            title={x.name}
                            left={p => <Avatar.Text {...p} color={theme.colors.primaryContainer} label={x.name.substring(0, 1)} size={40} />}
                            onPress={() => handleStoragePress(x.id)}
                        />)
                    }
                </ScrollView>
            </List.Section>
        </SafeAreaView>
    );
}
