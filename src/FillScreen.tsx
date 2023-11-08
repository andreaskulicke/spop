import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { SearchBar } from './SearchBar';
import { ItemState, addItem, deleteItems } from './store/itemsSlice';
import { FillFromHistoryList } from './FillFromHistoryList';
import { FillList } from './FillList';
import { Appbar, Divider, Menu } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { allStorage, selectActiveStorage } from './store/storagesSlice';
import uuid from 'react-native-uuid';

export function FillScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
}) {
    const [filter, setFilter] = useState<{ text: string; name?: string; amount?: string }>();
    const [menuVisible, setMenuVisible] = useState(false);
    const items = useAppSelector(state => state.items);
    const storage = useAppSelector(selectActiveStorage);
    const dispatch = useAppDispatch();

    const [newItem, setNewItem] = useState<ItemState>({
        id: uuid.v4() as string,
        name: "",
        amount: "",
        shops: [],
        storages: (storage.id === allStorage.id) ? [] : [{ storageId: storage.id }],
    });

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

    function handlePress(item: ItemState): void {
        console.log("handlePress")
        if (item?.name) {
            dispatch(addItem({ item: { ...item, amount: filter?.amount }, storageId: storage.id }));
            setFilter(undefined);
            setNewItem(v => ({ ...v, id: uuid.v4() as string }))
        }
    }

    function handleIconPress(name: string, amount: string | undefined): void {
        setFilter({ text: amount ? `${amount} ${name}` : name, name, amount });
    }

    function handleSearchChange(text: string, name: string, amount: string): void {
        setFilter({ text, name, amount });
    }

    useEffect(() => {
        setNewItem(v => ({
            ...v,
            name: filter?.name ?? filter?.text ?? "",
            amount: filter?.amount ?? "",
        }));
    }, [filter]);

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <Appbar.Header>
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
            <SearchBar
                text={filter?.text}
                onChange={handleSearchChange}
                onSubmitEditing={() => handlePress(newItem)}
            />
            <ScrollView keyboardShouldPersistTaps={filter ? "always" : "never"}>
                {
                    !filter
                        ? <FillList
                            storageId={storage.id}
                        />
                        : <FillFromHistoryList
                            item={newItem}
                            onPress={handlePress}
                            onIconPress={handleIconPress}
                        />
                }
            </ScrollView>
        </SafeAreaView>
    );
}
