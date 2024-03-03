import { addStorage, allStorage, selectItems, selectStorages, setStorages } from "./store/dataSlice";
import { Appbar, Divider, List, Menu, useTheme } from "react-native-paper";
import { AreaItemTitle } from "./AreaItemTitle";
import { AvatarText } from "./AvatarText";
import { CategoryIcon } from "./CategoryIcon";
import { Count } from "./Count";
import { DraggableList, DraggableListRenderItemInfo } from "./DraggableList";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SearchBarList } from "./SearchBarList";
import { StatusBarView } from "./StatusBarView";
import { Storage } from "./store/data/storages";
import { StoragesStackParamList } from "./StoragesNavigationScreen";
import { UnassignedBadge } from "./UnassignedBadge";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { View } from "react-native";
import React, { ReactNode, useState } from "react";
import uuid from 'react-native-uuid';

export function StoragesScreen(props: {
    navigation: NavigationProp<RootStackParamList & StoragesStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(selectItems);
    const storages = useAppSelector(selectStorages);
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

    function handleRenderItem(info: DraggableListRenderItemInfo<Storage>): ReactNode {
        const count = items.filter(i => i.wanted && i.storages.find(s => s.storageId === info.item.id)).length;
        return (
            <List.Item
                title={p => <AreaItemTitle p={p} title={info.item.name} bold={count > 0} />}
                left={p => <AvatarText {...p} label={info.item.name} />}
                right={p => <Count {...p} count={count} />}
                onPress={() => {
                    handleStoragePress(info.item.id);
                }}
                onLongPress={info.onDragStart}
            />
        );
    }

    const heightOfAllThingsListItem = 68;

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.Content title="Vorratsorte" />
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
            <SearchBarList
                list={
                    <View style={{ paddingBottom: heightOfAllThingsListItem }}>
                        <Divider />
                        <List.Item
                            title={allStorage.name}
                            style={{ height: heightOfAllThingsListItem }}
                            left={p => <CategoryIcon {...p} icon="check-all" />}
                            right={p =>
                                <UnassignedBadge
                                    p={p}
                                    tooltip="Gewünschte Dinge und ohne Vorratsort"
                                    unassignedFilter={item => (item.storages?.length ?? 0) === 0}
                                />
                            }
                            onPress={() => handleStoragePress(allStorage.id)}
                        />
                        <Divider />
                        <DraggableList
                            items={storages}
                            keyExtractor={x => x.id}
                            renderItem={handleRenderItem}
                            onReordered={items => {
                                dispatch(setStorages(items));
                            }}
                        />
                    </View>
                }
                storage={allStorage}
            />
        </StatusBarView>
    );
}
