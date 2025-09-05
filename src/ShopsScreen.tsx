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
import { Pressable, View } from "react-native";
import { UnassignedBadge } from "./UnassignedBadge";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import uuid from "react-native-uuid";
import { MainMenu } from "./MainMenu";
import { AppbarContentTitle } from "./AppbarContentTitle";
import { UndoSnackBar } from "./UndoSnackBar";

export function ShopsScreen(props: {
    navigation: NavigationProp<RootStackParamList & ShopsStackParamList>;
}) {
    const [draggingStopper, setDraggingStopper] = useState("");
    const items = useAppSelector(selectItems);
    const shops = useAppSelector(selectShops);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    function handleAddShopPress(): void {
        const id = uuid.v4() as string;
        dispatch(addShop(id));
        props.navigation.navigate("Shop", { id });
    }

    function handleAddShopStopperPress(): void {
        const id = uuid.v4() as string;
        dispatch(addShopStopper(id));
    }

    function handleShopPress(id: string): void {
        props.navigation.navigate("Shopping", { id });
    }

    function handleRenderItem(params: RenderItemParams<Shop>): ReactNode {
        if (params.item.id === allShop.id) {
            return (
                <View>
                    <List.Item
                        title={allShop.name}
                        style={{ backgroundColor: theme.colors.background }}
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
                </View>
            );
        }

        const shopIndex = shops.findIndex((x) => x.id === params.item.id);
        const isFallThrough =
            shopIndex < shops.length - 1 && !shops[shopIndex + 1]?.stopper;

        const count = items.filter(
            (i) =>
                i.wanted &&
                i.shops.find((s) => s.checked && s.shopId === params.item.id),
        ).length;

        if (params.item.stopper) {
            return (
                <ScaleDecorator activeScale={2}>
                    <Pressable
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
                                    style={{
                                        alignItems: "center",
                                        paddingTop: 8,
                                    }}
                                >
                                    <Icon size={8} source="trash-can" />
                                    <Icon size={8} source="chevron-down" />
                                </View>
                            ) : (
                                <View
                                    style={{
                                        alignItems: "center",
                                        paddingTop: 2,
                                    }}
                                >
                                    <Icon size={16} source="tray" />
                                </View>
                            )}
                        </View>
                    </Pressable>
                </ScaleDecorator>
            );
        }

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
                    left={(p) => (
                        <View>
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: -8,
                                    right: -4,
                                    zIndex: 999,
                                }}
                            >
                                <Icon
                                    size={16}
                                    source={
                                        isFallThrough ? "arrow-down" : "tray"
                                    }
                                />
                            </View>
                            {getShopImage(params.item, theme, { ...p })}
                        </View>
                    )}
                    right={(p) => <Count {...p} count={count} />}
                    onPress={() => handleShopPress(params.item.id)}
                    onLongPress={() => params.drag()}
                />
            </ScaleDecorator>
        );
    }

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <AppbarContentTitle title="Shops" />
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
                <MainMenu
                    navigation={
                        props.navigation as NavigationProp<RootStackParamList>
                    }
                />
            </Appbar.Header>
            <SearchBarList
                list={
                    <View>
                        <Divider />
                        <NestableScrollContainer>
                            <NestableDraggableFlatList
                                data={[allShop].concat(shops)}
                                keyExtractor={(x) => x.id}
                                renderItem={handleRenderItem}
                                stickyHeaderIndices={[0]}
                                stickyHeaderHiddenOnScroll={true}
                                onDragEnd={({ data }) => {
                                    setDraggingStopper("");
                                    dispatch(setShops(data.slice(1)));
                                }}
                            />
                        </NestableScrollContainer>
                    </View>
                }
                shop={allShop}
            />
            <UndoSnackBar contextName="ShopsScreen" />
        </StatusBarView>
    );
}
