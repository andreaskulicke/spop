import { allShop, selectShop } from './store/dataSlice';
import { Appbar } from 'react-native-paper';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { SearchBarList } from './SearchBarList';
import { ShoppingList } from './ShoppingList';
import { ShopsStackParamList } from './ShopsNavigationScreen';
import { StatusBarView } from './StatusBarView';
import { useAppSelector } from './store/hooks';
import React, { useState } from 'react';
import TrayOff from './store/icons/tray-off.svg';

export function ShoppingScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<ShopsStackParamList, "Shopping">;
}) {
    const [selectedItemId, setSelectedItemId] = useState("");
    const [stopperOff, setStopperOff] = useState(false);
    const shop = useAppSelector(selectShop(props.route.params.id));

    function handleEditPress(): void {
        props.navigation.navigate("Shop", { id: shop.id });
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
                    (shop.id !== allShop.id)
                        && stopperOff
                        ? <Appbar.Action icon="tray" onPress={handleStopperPress} />
                        : <Appbar.Action icon={() => <TrayOff />} onPress={handleStopperPress} />
                }
                {
                    (shop.id !== allShop.id)
                    && <Appbar.Action icon="pencil-outline" onPress={handleEditPress} />
                }

            </Appbar.Header>
            <SearchBarList
                list={<ShoppingList shop={shop} selectedItemId={selectedItemId} stopperOff={stopperOff} />}
                shop={shop}
                onItemPress={itemId => setSelectedItemId(itemId)}
            />
        </StatusBarView>
    );
}
