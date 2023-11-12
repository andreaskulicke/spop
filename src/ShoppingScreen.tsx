import React, { useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Appbar, Menu } from 'react-native-paper';
import { RootStackParamList } from '../App';
import { useAppSelector } from './store/hooks';
import { ShoppingList } from './ShoppingList';
import { allShop, selectShop } from './store/dataSlice';
import { ShopsStackParamList } from './ShopsNavigationScreen';
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchBarList } from './SearchBarList';

export function ShoppingScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<ShopsStackParamList, "Shopping">;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const shop = useAppSelector(selectShop(props.route.params.id));

    function handleEditPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Shop", { id: shop.id });
    }

    function handleSettingsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Settings");
    }

    return (
        <SafeAreaView>
            <Appbar.Header elevated statusBarHeight={0}>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={shop?.name ?? allShop.name} />
                {
                    (shop.id !== allShop.id)
                    && <Appbar.Action icon="pencil-outline" onPress={handleEditPress} />
                }
                <Menu
                    anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
                    anchorPosition="bottom"
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                >
                    <Menu.Item leadingIcon="cog-outline" title="Einstellungen" onPress={handleSettingsPress} />
                </Menu>
            </Appbar.Header>
            <SearchBarList
                list={<ShoppingList shop={shop} />}
                shop={shop}
            />
        </SafeAreaView>
    );
}
