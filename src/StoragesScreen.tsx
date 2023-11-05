import { SafeAreaView, ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Appbar, Avatar, Divider, List, Menu, Text, useTheme } from "react-native-paper";
import { useState } from "react";
import { addStorage, allStorage, setActiveStorage } from "./store/storagesSlice";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StoragesStackParamList } from "./StoragesNavigationScreen";
import uuid from 'react-native-uuid';
import { AvatarText } from "./AvatarText";

export function StoragesScreen(props: {
    navigation: NavigationProp<RootStackParamList & StoragesStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(state => state.items);
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

    function handleAddStoragePress(): void {
        setMenuVisible(false);
        const id = uuid.v4() as string;
        dispatch(addStorage(id));
        props.navigation.navigate("Storage", { id });
    }

    function handleStoragePress(id: string): void {
        dispatch(setActiveStorage(id));
        props.navigation.navigate("Fill");
    }

    function handleStorageLongPress(id: string): void {
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.Content title="Storages" />
                <Appbar.Action icon="plus" onPress={handleAddStoragePress} />
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
                title={allStorage.name}
                onPress={() => handleStoragePress(allStorage.id)}
            />
            <Divider />
            <List.Section>
                <ScrollView keyboardShouldPersistTaps="always">
                    {
                        storages.storages.map(x => <List.Item
                            key={x.id}
                            title={x.name}
                            left={p => <AvatarText {...p} label={x.name} />}
                            right={p =>
                                <Text {...p} variant="labelMedium">
                                    {items.items.filter(i => i.wanted && i.storages.find(s => s.storageId === x.id)).length}
                                </Text>
                            }
                            onPress={() => handleStoragePress(x.id)}
                            onLongPress={() => handleStorageLongPress(x.id)}
                        />)
                    }
                </ScrollView>
            </List.Section>
        </SafeAreaView>
    );
}
