import React, { useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { SafeAreaView, ScrollView } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { RootStackParamList } from '../App';
import { allShop, selectActiveShop } from './store/shopsSlice';
import { useAppSelector } from './store/hooks';
import { ShoppingList } from './ShoppingList';

export function ShoppingScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const shop = useAppSelector(selectActiveShop);

    function handleSettingsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Settings");
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={shop?.name ?? allShop.name} />
                <Menu
                    anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
                    anchorPosition="bottom"
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                >
                    <Menu.Item leadingIcon="cog-outline" title="Einstellungen" onPress={handleSettingsPress} />
                </Menu>
            </Appbar.Header>
            <ScrollView>
                <ShoppingList shop={shop} />
            </ScrollView>
        </SafeAreaView>
    );
}
