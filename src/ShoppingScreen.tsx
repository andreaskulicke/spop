import React, { useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { RootStackParamList } from '../App';
import { useAppSelector } from './store/hooks';
import { ShoppingList } from './ShoppingList';
import { allShop, selectShop } from './store/dataSlice';
import { ShopsStackParamList } from './ShopsNavigationScreen';
import { SearchBarList } from './SearchBarList';
import { StatusBarView } from './StatusBarView';

export function ShoppingScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<ShopsStackParamList, "Shopping">;
}) {
    const [selectedItemId, setSelectedItemId] = useState("");
    const shop = useAppSelector(selectShop(props.route.params.id));

    function handleEditPress(): void {
        props.navigation.navigate("Shop", { id: shop.id });
    }

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={shop?.name ?? allShop.name} />
                {
                    (shop.id !== allShop.id)
                    && <Appbar.Action icon="pencil-outline" onPress={handleEditPress} />
                }
            </Appbar.Header>
            <SearchBarList
                list={<ShoppingList shop={shop} selectedItemId={selectedItemId} />}
                shop={shop}
                onItemPress={itemId => setSelectedItemId(itemId)}
            />
        </StatusBarView>
    );
}
