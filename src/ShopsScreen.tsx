import { ReactNode, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Appbar, Avatar, List, Menu, useTheme, Text, Divider, Badge, Tooltip } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { ShopsStackParamList } from "./ShopsNavigationScreen";
import uuid from 'react-native-uuid';
import { AvatarText } from "./AvatarText";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { addShop, allShop, setShops, Shop } from "./store/dataSlice";

export function ShopsScreen(props: {
    navigation: NavigationProp<RootStackParamList & ShopsStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(state => state.data.items);
    const shops = useAppSelector(state => state.data.shops);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    function handleDotsPress(): void {
        setMenuVisible(true);
    }

    function handleAddShopPress(): void {
        setMenuVisible(false);
        const id = uuid.v4() as string;
        dispatch(addShop(id));
        props.navigation.navigate("Shop", { id });
    }

    function handleSettingsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Settings");
    }

    function handleShopPress(id: string): void {
        props.navigation.navigate("Shopping", { id });
    }

    function handleRenderItem(params: RenderItemParams<Shop>): ReactNode {
        return (
            <List.Item
                title={params.item.name}
                left={p => <AvatarText {...p} label={params.item.name} />}
                right={p =>
                    <Text {...p} variant="labelMedium">
                        {items.filter(i => i.wanted && i.shops.find(s => s.shopId === params.item.id)).length}
                    </Text>
                }
                onPress={() => handleShopPress(params.item.id)}
                onLongPress={() => params.drag()}
            />
        );
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.Content title="Shops" />
                <Appbar.Action icon="plus-outline" onPress={handleAddShopPress} />
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
                right={p => {
                    const count = items.filter(i => i.wanted).length;
                    const unassignedCount = items.filter(i => i.wanted && ((i.shops?.length ?? 0) === 0)).length;
                    return <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Tooltip title="Gewünschte Dinge und ohne Shop">
                            <Text {...p} variant="labelMedium" style={{ paddingLeft: 16, paddingVertical: 12 }}>
                                {count}
                            </Text>
                        </Tooltip>
                        <Badge visible={unassignedCount > 0} style={{ position: "absolute", top: 0, right: -20 }}>{unassignedCount}</Badge>
                    </View>;
                }
                }
                title={allShop.name}
                onPress={() => handleShopPress(allShop.id)}
            />
            <Divider />
            <List.Section>
                <DraggableFlatList
                    data={shops}
                    keyExtractor={x => x.id}
                    renderItem={handleRenderItem}
                    onDragEnd={({ data }) => dispatch(setShops(data))}
                />
            </List.Section>
        </SafeAreaView>
    );
}
