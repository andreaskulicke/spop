import { SafeAreaView, View } from "react-native";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Appbar, Avatar, Badge, Divider, List, Menu, Text, Tooltip, useTheme } from "react-native-paper";
import { ReactNode, useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StoragesStackParamList } from "./StoragesNavigationScreen";
import uuid from 'react-native-uuid';
import { AvatarText, avatarSize } from "./AvatarText";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { addStorage, allStorage, setStorages, Storage } from "./store/dataSlice";

export function StoragesScreen(props: {
    navigation: NavigationProp<RootStackParamList & StoragesStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(state => state.data);
    const storages = useAppSelector(state => state.data.storages);
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
        const id = uuid.v4() as string;
        dispatch(addStorage(id));
        props.navigation.navigate("Storage", { id, new: true });
    }

    function handleStoragePress(id: string): void {
        props.navigation.navigate("Fill", { storageId: id });
    }

    function handleRenderItem(params: RenderItemParams<Storage>): ReactNode {
        const count = items.items.filter(i => i.wanted && i.storages.find(s => s.storageId === params.item.id)).length;
        return (
            <ScaleDecorator>
                <List.Item
                    title={p =>
                        <Text {...p} variant="bodyLarge" style={{ fontWeight: (count > 0) ? "bold" : "normal" }}>
                            {params.item.name}
                        </Text>
                    }
                    left={p => <AvatarText {...p} label={params.item.name} />}
                    right={p =>
                        <Text {...p} variant="labelMedium">
                            {count}
                        </Text>
                    }
                    onPress={() => handleStoragePress(params.item.id)}
                    onLongPress={() => params.drag()}
                />
            </ScaleDecorator>
        );
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.Content title="Storages" />
                <Appbar.Action icon="plus-outline" onPress={handleAddStoragePress} />
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
                title={allStorage.name}
                left={p =>
                    <Avatar.Icon
                        {...p}
                        color={theme.colors.primaryContainer}
                        icon="check-all"
                        size={avatarSize}
                    />}
                right={p => {
                    const count = items.items.filter(i => i.wanted).length;
                    const unassignedCount = items.items.filter(i => i.wanted && ((i.storages?.length ?? 0) === 0)).length;
                    return <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Tooltip title="Gewünschte Dinge und ohne Storage">
                            <Text {...p} variant="labelMedium" style={{ paddingLeft: 16, paddingVertical: 12 }}>
                                {count}
                            </Text>
                        </Tooltip>
                        <Badge visible={unassignedCount > 0} style={{ position: "absolute", top: 0, right: -20 }}>{unassignedCount}</Badge>
                    </View>;
                }
                }
                onPress={() => handleStoragePress(allStorage.id)}
            />
            <Divider />
            <List.Section>
                <DraggableFlatList
                    data={storages}
                    keyExtractor={x => x.id}
                    renderItem={handleRenderItem}
                    onDragEnd={({ data }) => dispatch(setStorages(data))}
                />
            </List.Section>
        </SafeAreaView>
    );
}


