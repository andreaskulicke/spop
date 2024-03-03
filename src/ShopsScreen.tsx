import { addShop, addShopStopper, allShop, selectItems, selectShops, setShops } from "./store/dataSlice";
import { Appbar, List, Menu, useTheme, Divider, Tooltip, Icon } from "react-native-paper";
import { AreaItemTitle } from "./AreaItemTitle";
import { Count } from "./Count";
import { DraggableList, DraggableListRenderItemInfo } from "./DraggableList";
import { LogBox, TouchableWithoutFeedback, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SearchBarList } from "./SearchBarList";
import { Shop, getShopImage } from "./store/data/shops";
import { ShopsStackParamList } from "./ShopsNavigationScreen";
import { StatusBarView } from "./StatusBarView";
import { UnassignedBadge } from "./UnassignedBadge";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import React, { ReactNode, useEffect, useState } from "react";
import uuid from 'react-native-uuid';

export function ShopsScreen(props: {
    navigation: NavigationProp<RootStackParamList & ShopsStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(selectItems);
    const shops = useAppSelector(selectShops);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    function handleDotsPress(): void {
        setMenuVisible(true);
    }

    function handleAddShopPress(): void {
        const id = uuid.v4() as string;
        dispatch(addShop(id));
        props.navigation.navigate("Shop", { id });
    }

    function handleAddShopStopperPress(): void {
        const id = uuid.v4() as string;
        dispatch(addShopStopper(id));
    }

    function handleSettingsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Settings");
    }

    function handleShopPress(id: string): void {
        props.navigation.navigate("Shopping", { id });
    }

    function handleRenderItem(info: DraggableListRenderItemInfo<Shop>): ReactNode {
        const count = items.filter(i => i.wanted && i.shops.find(s => s.checked && (s.shopId === info.item.id))).length;
        return (
            info.item.stopper
                ? <TouchableWithoutFeedback
                    onLongPress={info.onDragStart}
                >
                    <View style={{ backgroundColor: theme.colors.elevation.level1, height: 24, transform: [{ scale: info.active ? 2 : 1 }] }}>
                        {
                            info.active
                                ? <View style={{ alignItems: "center", paddingTop: 8 }}>
                                    <Icon size={8} source="trash-can" />
                                    <Icon size={8} source="chevron-down" />
                                </View>
                                : <View style={{ alignItems: "center", paddingTop: 2 }}>
                                    <Icon size={16} source="tray" />
                                </View>
                        }
                    </View>
                </TouchableWithoutFeedback>
                : <List.Item
                    title={p => <AreaItemTitle p={p} title={info.item.name} bold={count > 0} />}
                    left={p => getShopImage(info.item, theme, { ...p })}
                    right={p => <Count {...p} count={count} />}
                    onPress={() => handleShopPress(info.item.id)}
                    onLongPress={info.onDragStart}
                />
        );
    }

    useEffect(() => {
        // Disable DragList in ScrollView warning
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])

    const heightOfAllThingsListItem = 68;

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.Content title="Shops" />
                <Tooltip title="Dinge-Stopper hinzufügen">
                    <Appbar.Action icon="tray-plus" onPress={handleAddShopStopperPress} />
                </Tooltip>
                <Tooltip title="Neuen Shop hinzufügen">
                    <Appbar.Action icon="plus-outline" onPress={handleAddShopPress} />
                </Tooltip>
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
                            title={allShop.name}
                            style={{ height: heightOfAllThingsListItem }}
                            left={p => getShopImage(allShop, theme, { ...p })}
                            right={p =>
                                <UnassignedBadge
                                    p={p}
                                    tooltip="Gewünschte Dinge und ohne Shop"
                                    unassignedFilter={item => (item.shops?.filter(x => x.checked).length ?? 0) === 0}
                                />
                            }
                            onPress={() => handleShopPress(allShop.id)}
                        />
                        <Divider />
                        <DraggableList
                            items={shops}
                            keyExtractor={x => x.id}
                            renderItem={handleRenderItem}
                            onReordered={items => {
                                dispatch(setShops(items));
                            }}
                        />
                    </View>
                }
                shop={allShop}
            />
        </StatusBarView>
    );
}
