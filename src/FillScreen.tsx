import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { SearchBar } from './SearchBar';
import { ItemState, addItem, deleteItems, setItems } from './store/itemsSlice';
import { FillFromHistoryList } from './FillFromHistoryList';
import { FillList } from './FillList';
import { Appbar, Divider, Menu } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { allStorage, selectActiveStorage } from './store/storagesSlice';

export function FillScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
}) {
    const [filter, setFilter] = useState<{ text: string; name?: string; amount?: string }>();
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(state => state.items);
    const storage = useAppSelector(selectActiveStorage);
    const dispatch = useAppDispatch();

    function handleEditPress(): void {
n    }

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

    function handlePress(item: ItemState): void {
        dispatch(addItem({ item: { ...item, amount: filter?.amount }, storageId: storage.id }));
        setFilter(undefined);
    }

    function handleIconPress(name: string, amount: string | undefined): void {
        setFilter({ text: amount ? `${amount} ${name}` : name, name, amount });
    }

    function handleSearchChange(text: string, name: string, amount: string): void {
        setFilter({ text, name, amount });
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={storage?.name ?? allStorage.name} />
                <Appbar.Action icon="pencil-outline" onPress={handleEditPress} />
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
            <SearchBar
                text={filter?.text}
                onChange={handleSearchChange}
            />
            <ScrollView keyboardShouldPersistTaps={filter ? "always" : "never"}>
                {
                    !filter
                        ? <FillList
                            storageId={storage.id}
                        />
                        : <FillFromHistoryList
                            storageId={storage.id}
                            text={filter?.name ?? filter?.text}
                            amount={filter?.amount}
                            onPress={handlePress}
                            onIconPress={handleIconPress}
                        />
                }
            </ScrollView>
        </SafeAreaView>
    );
}
