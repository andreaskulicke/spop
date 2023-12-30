import { addItem, allStorage, allShop } from './store/dataSlice';
import { FillFromHistoryList } from './FillFromHistoryList';
import { Item } from './store/data/items';
import { KeyboardAvoidingView } from 'react-native';
import { SearchBar } from './SearchBar';
import { Shop } from './store/data/shops';
import { Storage } from './store/data/storages';
import { useAppDispatch } from './store/hooks';
import React, { useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

export function SearchBarList(props: {
    list: React.ReactNode;
    shop?: Shop;
    storage?: Storage;
    onItemPress?: (itemId: string) => void;
}) {
    const [filter, setFilter] = useState<{ text: string; name?: string; quantity?: string; }>();
    const [newItem, setNewItem] = useState<Item>({
        id: uuid.v4() as string,
        name: "",
        quantity: "",
        shops: (!props.shop || (props.shop.id === allShop.id)) ? [] : [{ checked: true, shopId: props.shop.id }],
        storages: (!props.storage || (props.storage.id === allStorage.id)) ? [] : [{ storageId: props.storage.id }],
    });
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    function handlePress(item: Item): void {
        if (item?.name) {
            dispatch(addItem(
                {
                    item: { ...item, quantity: filter?.quantity },
                    shop: props.shop,
                    storage: props.storage,
                }));
            setFilter(undefined);
            setNewItem(v => ({ ...v, id: uuid.v4() as string }));
            props.onItemPress?.(item.id);
        }
    }

    function handleIconPress(name: string, quantity: string | undefined): void {
        name = name.trim() + " ";
        setFilter({ text: quantity ? `${quantity} ${name}` : name, name, quantity });
    }

    function handleSearchChange(text: string, name: string, quantity: string): void {
        setFilter({ text, name, quantity });
    }

    useEffect(() => {
        const r = (e: any) => {
            if (filter) {
                e.preventDefault();
                setFilter(undefined);
            }
        };
        navigation.addListener("beforeRemove", r);
        return () => navigation.removeListener("beforeRemove", r);
    })

    useEffect(() => {
        setNewItem(v => ({
            ...v,
            name: filter?.name ?? filter?.text ?? "",
            quantity: filter?.quantity ?? "",
        }));
    }, [filter]);

    return (
        <KeyboardAvoidingView
            behavior="height"
            style={{ flex: 1 }}
        >
            <SearchBar
                text={filter?.text}
                onChange={handleSearchChange}
                onSubmitEditing={() => handlePress(newItem)}
            />
            {
                (!filter || !filter.name)
                    ? props.list
                    : <FillFromHistoryList
                        item={newItem}
                        shop={props.shop}
                        storage={props.storage}
                        onPress={handlePress}
                        onIconPress={handleIconPress} />
            }
        </KeyboardAvoidingView>
    );
}
