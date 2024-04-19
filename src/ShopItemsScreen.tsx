import { allShop, selectItemsWantedWithShopHidden, selectShop } from './store/dataSlice';
import { Appbar, Badge, Tooltip, useTheme } from 'react-native-paper';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { SearchBarList } from './SearchBarList';
import { ShopItemsList } from './ShopItemsList';
import { ShopsStackParamList } from './ShopsNavigationScreen';
import { StatusBarView } from './StatusBarView';
import { useAppSelector } from './store/hooks';
import { View } from 'react-native';
import React, { useState } from 'react';
import TrayOff from './store/icons/tray-off';

export function ShopItemsScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<ShopsStackParamList, "Shopping">;
}) {
    const [selectedItemId, setSelectedItemId] = useState("");
    const [showHidden, setShowHidden] = useState(false);
    const [stopperOff, setStopperOff] = useState(false);

    const shop = useAppSelector(selectShop(props.route.params.id));
    const itemsWantedThisShopHidden = useAppSelector(selectItemsWantedWithShopHidden(shop, stopperOff));

    const theme = useTheme();

    function handleEditPress(): void {
        props.navigation.navigate("Shop", { id: shop.id });
    }

    function handleShowHiddenPress(): void {
        setShowHidden(v => !v);
    }

    function handleStopperPress(): void {
        setStopperOff(v => !v);
    }

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={shop?.name ?? allShop.name} />
                {
                    (shop.id !== allShop.id) && (itemsWantedThisShopHidden.length > 0)
                    && <View>
                        {

                            (showHidden
                                ? <Tooltip title="Versteckte Dinge ausblenden (Kategorien)">
                                    <Appbar.Action icon="eye-off-outline" onPress={handleShowHiddenPress} />
                                </Tooltip>
                                : <Tooltip title="Versteckte Dinge einblenden (Kategorien)">
                                    <Appbar.Action icon="eye-outline" onPress={handleShowHiddenPress} />
                                </Tooltip>
                            )
                        }
                        <Badge
                            style={{
                                position: "absolute"
                            }}
                        >
                            {itemsWantedThisShopHidden.length}
                        </Badge>
                    </View>
                }
                {
                    (shop.id !== allShop.id)
                    && (stopperOff
                        ? <Tooltip title="Stopper einschalten">
                            <Appbar.Action icon="tray" onPress={handleStopperPress} />
                        </Tooltip>
                        : <Tooltip title="Stopper ausschalten">
                            <Appbar.Action icon={() => <TrayOff color={theme.colors.onBackground} />} onPress={handleStopperPress} />
                        </Tooltip>
                    )
                }
                {
                    (shop.id !== allShop.id)
                    && <Appbar.Action icon="pencil-outline" onPress={handleEditPress} />
                }

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
                onItemPress={itemId => setSelectedItemId(itemId)}
            />
        </StatusBarView>
    );
}
