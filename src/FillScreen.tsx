import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { SearchBar } from './SearchBar';
import { ItemState, addItem, setItems } from './store/itemsSlice';
import { FillFromHistoryList } from './FillFromHistoryList';
import { FillList } from './FillList';
import { Appbar, Divider, Menu } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { selectActiveStorage } from './store/storagesSlice';

export function FillScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
}) {
    const [filter, setFilter] = useState("");
    const [menuVisible, setMenuVisible] = useState(false);
    const storage = useAppSelector(selectActiveStorage);
    const dispatch = useAppDispatch();

    function handleDeleteAllPress(): void {
        setMenuVisible(false);
        dispatch(setItems({ items: [] }));
    }

    function handleDotsPress(): void {
        setMenuVisible(true);
    }

    function handleSettingsPress(): void {
        setMenuVisible(false);
        props.navigation.navigate("Settings");
    }

    function handlePress(item: ItemState): void {
        dispatch(addItem({ item: item, storageId: storage.id }));
        setFilter("");
    }

    function handleIconPress(text: string): void {
        setFilter(text);
    }

    function handleSearchChange(text: string): void {
        setFilter(text);
    }

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={storage?.name ?? "Alle"} />
                <Menu
                    anchor={<Appbar.Action icon="dots-vertical" onPress={handleDotsPress} />}
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
                text={filter}
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
                            text={filter}
                            onPress={handlePress}
                            onIconPress={handleIconPress}
                        />
                }
            </ScrollView>
        </SafeAreaView>
    );
}
