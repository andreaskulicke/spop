import { Appbar, Divider, Menu } from 'react-native-paper';
import { FillList } from './FillList';
import { allStorage, deleteItems, selectStorage } from './store/dataSlice';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { SafeAreaView } from "react-native-safe-area-context";
import { StoragesStackParamList } from './StoragesNavigationScreen';
import { useAppDispatch, useAppSelector } from './store/hooks';
import React, { useState } from 'react';
import { SearchBarList } from './SearchBarList';

export function FillScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<StoragesStackParamList, "Fill">;
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(state => state.data);
    const storage = useAppSelector(selectStorage(props.route.params.storageId));
    const dispatch = useAppDispatch();

    function handleEditPress(): void {
        props.navigation.navigate("Storage", { id: storage.id });
    }

    function handleDeleteAllPress(): void {
        setMenuVisible(false);
        const itemsToDelete = items.items
            .filter(x => (storage.id === allStorage.id) || x.storages.find(x => x.storageId === storage.id))
            .map(x => x.id);
        dispatch(deleteItems(itemsToDelete));
    }

    function handleSettingsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Settings");
    }

    return (
        <SafeAreaView>
            <Appbar.Header elevated statusBarHeight={0}>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={storage?.name ?? allStorage.name} />
                {
                    (storage.id !== allStorage.id)
                    && <Appbar.Action icon="pencil-outline" onPress={handleEditPress} />
                }
                <Menu
                    anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
                    anchorPosition="bottom"
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                >
                    <Menu.Item leadingIcon="trash-can-outline" title="Alles löschen" onPress={handleDeleteAllPress} />
                    <Divider />
                    <Menu.Item leadingIcon="cog-outline" title="Einstellungen" onPress={handleSettingsPress} />
                </Menu>
            </Appbar.Header>
            <SearchBarList
                list={<FillList storageId={storage.id} />}
                storage={storage}
            />
        </SafeAreaView>
    );
}
