import {
    addShop,
    addShopStopper,
    allShop,
    selectItems,
    selectShops,
    setShops,
} from "./store/dataSlice";
import {
    Appbar,
    List,
    Menu,
    useTheme,
    Divider,
    Tooltip,
    Icon,
} from "react-native-paper";
import { AreaItemTitle } from "./AreaItemTitle";
import { Count } from "./Count";
import { NavigationProp } from "@react-navigation/native";
import {
    NestableDraggableFlatList,
    NestableScrollContainer,
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { ReactNode, useState } from "react";
import { RootStackParamList } from "../App";
import { SearchBarList } from "./SearchBarList";
import { Shop, getShopImage } from "./store/data/shops";
import { ShopsStackParamList } from "./ShopsNavigationScreen";
import { StatusBarView } from "./StatusBarView";
import { TouchableWithoutFeedback, View } from "react-native";
import { UnassignedBadge } from "./UnassignedBadge";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import uuid from "react-native-uuid";

export function ShopsScreen(props: {
    navigation: NavigationProp<RootStackParamList & ShopsStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [draggingStopper, setDraggingStopper] = useState("");
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

    function handleRenderItem(params: RenderItemParams<Shop>): ReactNode {
        const count = items.filter(
            (i) =>
                i.wanted &&
                i.shops.find((s) => s.checked && s.shopId === params.item.id),
        ).length;
        return params.item.stopper ? (
            <ScaleDecorator activeScale={2}>
                <TouchableWithoutFeedback
                    onLongPress={() => {
                        setDraggingStopper(params.item.id);
                        params.drag();
                    }}
                >
                    <View
                        style={{
                            backgroundColor: theme.colors.elevation.level1,
                            height: 24,
                        }}
                    >
                        {draggingStopper === params.item.id ? (
                            <View
                                style={{ alignItems: "center", paddingTop: 8 }}
                            >
                                <Icon size={8} source="trash-can" />
                                <Icon size={8} source="chevron-down" />
                            </View>
                        ) : (
                            <View
                                style={{ alignItems: "center", paddingTop: 2 }}
                            >
                                <Icon size={16} source="tray" />
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </ScaleDecorator>
        ) : (
            <ScaleDecorator>
                <List.Item
                    title={(p) => (
                        <AreaItemTitle
                            p={p}
                            title={params.item.name}
                            bold={count > 0}
                        />
                    )}
                    left={(p) => getShopImage(params.item, theme, { ...p })}
                    right={(p) => <Count {...p} count={count} />}
                    onPress={() => handleShopPress(params.item.id)}
                    onLongPress={() => params.drag()}
                />
            </ScaleDecorator>
        );
    }

    const heightOfAllThingsListItem = 68;

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.Content title="Shops" />
                <Tooltip title="Dinge-Stopper hinzufügen">
                    <Appbar.Action
                        icon="tray-plus"
                        onPress={handleAddShopStopperPress}
                    />
                </Tooltip>
                <Tooltip title="Neuen Shop hinzufügen">
                    <Appbar.Action
                        icon="plus-outline"
                        onPress={handleAddShopPress}
                    />
                </Tooltip>
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
                            title={allShop.name}
                            style={{ height: heightOfAllThingsListItem }}
                            left={(p) => getShopImage(allShop, theme, { ...p })}
                            right={(p) => (
                                <UnassignedBadge
                                    p={p}
                                    tooltip="Gewünschte Dinge und ohne Shop"
                                    unassignedFilter={(item) =>
                                        (item.shops?.filter((x) => x.checked)
                                            .length ?? 0) === 0
                                    }
                                />
                            )}
                            onPress={() => handleShopPress(allShop.id)}
                        />
                        <Divider />
                        <NestableScrollContainer>
                            <NestableDraggableFlatList
                                data={shops}
                                keyExtractor={(x) => x.id}
                                renderItem={handleRenderItem}
                                onDragEnd={({ data }) => {
                                    setDraggingStopper("");
                                    dispatch(setShops(data));
                                }}
                            />
                        </NestableScrollContainer>
                    </View>
                }
                shop={allShop}
            />
        </StatusBarView>
    );
}
