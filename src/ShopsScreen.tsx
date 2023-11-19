import { addShop, addShopStopper, allShop, selectAllShops, setShops } from "./store/dataSlice";
import { Appbar, Avatar, List, Menu, useTheme, Text, Divider, Badge, Tooltip, Icon } from "react-native-paper";
import { AvatarText, avatarSize } from "./AvatarText";
import { NavigationProp } from "@react-navigation/native";
import { NestableDraggableFlatList, NestableScrollContainer, RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { ReactNode, useState } from "react";
import { RootStackParamList } from "../App";
import { Shop } from "./store/data/shops";
import { ShopsStackParamList } from "./ShopsNavigationScreen";
import { StatusBarView } from "./StatusBarView";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { TouchableWithoutFeedback, View } from "react-native";
import uuid from 'react-native-uuid';

export function ShopsScreen(props: {
    navigation: NavigationProp<RootStackParamList & ShopsStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [draggingStopper, setDraggingStopper] = useState(false);
    const items = useAppSelector(state => state.data.items);
    const shops = useAppSelector(selectAllShops);
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

    function handleRenderItem(params: RenderItemParams<Shop>): ReactNode {
        const count = items.filter(i => i.wanted && i.shops.find(s => s.shopId === params.item.id)).length;
        return (
            params.item.stopper
                ? <ScaleDecorator activeScale={2}>
                    <TouchableWithoutFeedback
                        onLongPress={() => {
                            setDraggingStopper(true);
                            params.drag();
                        }}
                    >
                        <View style={{ backgroundColor: theme.colors.elevation.level1, height: 24 }}>
                            {
                                draggingStopper
                                    ? <View style={{ alignItems: "center", paddingTop: 8 }}>
                                        <Icon size={8} source="trash-can" />
                                        <Icon size={8} source="chevron-down" />
                                    </View>
                                    : <View style={{ alignItems: "center", paddingTop: 4 }}>
                                        <Icon size={16} source="tray" />
                                    </View>
                            }
                        </View>
                    </TouchableWithoutFeedback>
                </ScaleDecorator>
                : <ScaleDecorator>
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
                        onPress={() => handleShopPress(params.item.id)}
                        onLongPress={() => params.drag()}
                    />
                </ScaleDecorator>
        );
    }

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
            <Divider />
            <NestableScrollContainer>
                <List.Item
                    title={allShop.name}
                    left={p =>
                        <Avatar.Icon
                            {...p}
                            color={theme.colors.primaryContainer}
                            icon="check-all"
                            size={avatarSize}
                        />}
                    right={p => {
                        const count = items.filter(i => i.wanted).length;
                        const unassignedCount = items.filter(i => i.wanted && ((i.shops?.length ?? 0) === 0)).length;
                        return <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Tooltip title="Gewünschte Dinge und ohne Shop">
                                <Text {...p} variant="labelMedium" style={{ paddingLeft: 32, paddingVertical: 12 }}>
                                    {count}
                                </Text>
                            </Tooltip>
                            <Badge visible={unassignedCount > 0} style={{ position: "absolute", top: 0, right: -20 }}>{unassignedCount}</Badge>
                        </View>;
                    }
                    }
                    onPress={() => handleShopPress(allShop.id)}
                />
                <Divider />
                <NestableDraggableFlatList
                    data={shops}
                    keyExtractor={x => x.id}
                    renderItem={handleRenderItem}
                    onDragEnd={({ data }) => {
                        setDraggingStopper(false);
                        dispatch(setShops(data));
                    }}
                />
            </NestableScrollContainer>
        </StatusBarView>
    );
}
