import {
    addStorage,
    allStorage,
    selectItems,
    selectStorages,
    setStorages,
} from "./store/dataSlice";
import { Appbar, Divider, List, Menu } from "react-native-paper";
import { AreaItemTitle } from "./AreaItemTitle";
import { AvatarText } from "./AvatarText";
import { CategoryIcon } from "./CategoryIcon";
import { Count } from "./Count";
import { NavigationProp } from "@react-navigation/native";
import {
    NestableDraggableFlatList,
    NestableScrollContainer,
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { RootStackParamList } from "../App";
import { SearchBarList } from "./SearchBarList";
import { StatusBarView } from "./StatusBarView";
import { Storage } from "./store/data/storages";
import { StoragesStackParamList } from "./StoragesNavigationScreen";
import { UnassignedBadge } from "./UnassignedBadge";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { View } from "react-native";
import React, { ReactNode, useState } from "react";
import uuid from "react-native-uuid";

export function StoragesScreen(props: {
    navigation: NavigationProp<RootStackParamList & StoragesStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(selectItems);
    const storages = useAppSelector(selectStorages);
    const dispatch = useAppDispatch();

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
        const count = items.filter(
            (i) =>
                i.wanted &&
                i.storages.find((s) => s.storageId === params.item.id),
        ).length;
        return (
            <ScaleDecorator>
                <List.Item
                    title={(p) => (
                        <AreaItemTitle
                            p={p}
                            title={params.item.name}
                            bold={count > 0}
                        />
                    )}
                    left={(p) => <AvatarText {...p} label={params.item.name} />}
                    right={(p) => <Count {...p} count={count} />}
                    onPress={() => handleStoragePress(params.item.id)}
                    onLongPress={() => params.drag()}
                />
            </ScaleDecorator>
        );
    }

    const heightOfAllThingsListItem = 68;

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.Content title="Vorratsorte" />
                <Appbar.Action
                    icon="plus-outline"
                    onPress={handleAddStoragePress}
                />
                <Menu
                    anchor={
                        <Appbar.Action
                            icon="dots-vertical"
                            onPress={handleDotsPress}
                        />
                    }
                    anchorPosition="bottom"
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                >
                    <Menu.Item
                        leadingIcon="cog-outline"
                        title="Einstellungen"
                        onPress={handleSettingsPress}
                    />
                </Menu>
            </Appbar.Header>
            <SearchBarList
                list={
                    <View style={{ paddingBottom: heightOfAllThingsListItem }}>
                        <Divider />
                        <List.Item
                            title={allStorage.name}
                            style={{ height: heightOfAllThingsListItem }}
                            left={(p) => (
                                <CategoryIcon {...p} icon="check-all" />
                            )}
                            right={(p) => (
                                <UnassignedBadge
                                    p={p}
                                    tooltip="Gewünschte Dinge und ohne Vorratsort"
                                    unassignedFilter={(item) =>
                                        (item.storages?.length ?? 0) === 0
                                    }
                                />
                            )}
                            onPress={() => handleStoragePress(allStorage.id)}
                        />
                        <Divider />
                        <NestableScrollContainer>
                            <NestableDraggableFlatList
                                data={storages}
                                keyExtractor={(x) => x.id}
                                renderItem={handleRenderItem}
                                onDragEnd={({ data }) =>
                                    dispatch(setStorages(data))
                                }
                            />
                        </NestableScrollContainer>
                    </View>
                }
                storage={allStorage}
            />
        </StatusBarView>
    );
}
