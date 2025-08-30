import {
    allShop,
    selectItemsWantedWithShopHidden,
    selectShop,
} from "./store/dataSlice";
import { Appbar, Badge, Tooltip, useTheme } from "react-native-paper";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SearchBarList } from "./SearchBarList";
import { ShopItemsList } from "./ShopItemsList";
import { ShopsStackParamList } from "./ShopsNavigationScreen";
import { StatusBarView } from "./StatusBarView";
import { useAppSelector } from "./store/hooks";
import { Linking, View } from "react-native";
import React, { useState } from "react";
import TrayOff from "./store/icons/tray-off";
import { getShopImage } from "./store/data/shops";

export function ShopItemsScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<ShopsStackParamList, "Shopping">;
}) {
    const [selectedItemId, setSelectedItemId] = useState("");
    const [showHidden, setShowHidden] = useState(false);
    const [stopperOff, setStopperOff] = useState(false);

    const shop = useAppSelector((state) =>
        selectShop(state, props.route.params.id),
    );
    const itemsWantedThisShopHidden = useAppSelector((state) =>
        selectItemsWantedWithShopHidden(state, shop, stopperOff),
    );

    const theme = useTheme();

    function handleEditPress(): void {
        props.navigation.navigate("Shop", { id: shop.id });
    }

    async function handleOpenPress(): Promise<void> {
        if (shop.externalAppId) {
            const url = `market://launch?id=${shop.externalAppId}`;
            try {
                if (await Linking.canOpenURL(url)) {
                    await Linking.openURL(url);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    function handleShowHiddenPress(): void {
        setShowHidden((v) => !v);
    }

    function handleStopperPress(): void {
        setStopperOff((v) => !v);
    }

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                {getShopImage(shop, theme, { style: {} })}
                <View style={{ marginRight: 8 }}></View>
                <Appbar.Content title={shop?.name ?? allShop.name} />
                {shop.externalAppId && (
                    <Appbar.Action
                        icon="open-in-new"
                        onPress={handleOpenPress}
                    />
                )}
                {shop.id !== allShop.id &&
                    itemsWantedThisShopHidden.length > 0 && (
                        <View>
                            {showHidden ? (
                                <Tooltip title="Versteckte Dinge ausblenden (Kategorien)">
                                    <Appbar.Action
                                        icon="eye-off-outline"
                                        onPress={handleShowHiddenPress}
                                    />
                                </Tooltip>
                            ) : (
                                <View>
                                    <Tooltip title="Versteckte Dinge einblenden (Kategorien)">
                                        <Appbar.Action
                                            icon="eye-outline"
                                            onPress={handleShowHiddenPress}
                                        />
                                    </Tooltip>
                                    <Badge
                                        style={{
                                            position: "absolute",
                                        }}
                                    >
                                        {itemsWantedThisShopHidden.length}
                                    </Badge>
                                </View>
                            )}
                        </View>
                    )}
                {shop.id !== allShop.id &&
                    (stopperOff ? (
                        <Tooltip title="Stopper einschalten">
                            <Appbar.Action
                                icon="tray"
                                onPress={handleStopperPress}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Stopper ausschalten">
                            <Appbar.Action
                                icon={() => (
                                    <TrayOff
                                        color={theme.colors.onBackground}
                                    />
                                )}
                                onPress={handleStopperPress}
                            />
                        </Tooltip>
                    ))}
                {shop.id !== allShop.id && (
                    <Appbar.Action
                        icon="pencil-outline"
                        onPress={handleEditPress}
                    />
                )}
            </Appbar.Header>
            <SearchBarList
                list={
                    <ShopItemsList
                        shop={shop}
                        selectedItemId={selectedItemId}
                        stopperOff={stopperOff}
                        showHidden={showHidden}
                    />
                }
                shop={shop}
                onItemPress={(itemId) => setSelectedItemId(itemId)}
            />
        </StatusBarView>
    );
}
