import { addStorage, allStorage, setStorages } from "./store/dataSlice";
import { Appbar, Badge, Divider, List, Menu, Text, Tooltip, useTheme } from "react-native-paper";
import { AvatarText } from "./AvatarText";
import { CategoryIcon } from "./CategoryIcon";
import { Count } from "./Count";
import { NavigationProp } from "@react-navigation/native";
import { NestableDraggableFlatList, NestableScrollContainer, RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { ReactNode, useState } from "react";
import { RootStackParamList } from "../App";
import { StatusBarView } from "./StatusBarView";
import { Storage } from "./store/data/storages";
import { StoragesStackParamList } from "./StoragesNavigationScreen";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { View } from "react-native";
import uuid from 'react-native-uuid';

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
        props.navigation.navigate("Storage", { id });
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
        <StatusBarView>
            <Appbar.Header elevated>
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
            <List.Item
                title={allStorage.name}
                left={p => <CategoryIcon {...p} icon="check-all" />}
                right={p => {
                    const count = items.items.filter(i => i.wanted).length;
                    const unassignedCount = items.items.filter(i => i.wanted && ((i.storages?.length ?? 0) === 0)).length;
                    return <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Tooltip title="Gewünschte Dinge und ohne Storage">
                            <Count {...p} count={count} />
                        </Tooltip>
                        <Badge visible={unassignedCount > 0} style={{ position: "absolute", top: 0, right: -20 }}>{unassignedCount}</Badge>
                    </View>;
                }
                }
                onPress={() => handleStoragePress(allStorage.id)}
            />
            <Divider />
            <NestableScrollContainer>
                <NestableDraggableFlatList
                    data={storages}
                    keyExtractor={x => x.id}
                    renderItem={handleRenderItem}
                    onDragEnd={({ data }) => dispatch(setStorages(data))}
                />
            </NestableScrollContainer>
        </StatusBarView>
    );
}
