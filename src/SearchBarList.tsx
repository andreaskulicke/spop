import { addItem, allStorage, allShop } from './store/dataSlice';
import { FillFromHistoryList } from './FillFromHistoryList';
import { Item } from './store/data/items';
import { View } from 'react-native';
import { SearchBar } from './SearchBar';
import { Shop } from './store/data/shops';
import { Storage } from './store/data/storages';
import { useAppDispatch } from './store/hooks';
import React, { useEffect, useState } from 'react';
import uuid from 'react-native-uuid';

export function SearchBarList(props: {
    list: React.ReactNode;
    shop?: Shop;
    storage?: Storage;
}) {
    const [filter, setFilter] = useState<{ text: string; name?: string; amount?: string; }>();
    const dispatch = useAppDispatch();

    const [newItem, setNewItem] = useState<Item>({
        id: uuid.v4() as string,
        name: "",
        amount: "",
        shops: (!props.shop || (props.shop.id === allShop.id)) ? [] : [{ shopId: props.shop.id }],
        storages: (!props.storage || (props.storage.id === allStorage.id)) ? [] : [{ storageId: props.storage.id }],
    });

    function handlePress(item: Item): void {
        if (item?.name) {
            dispatch(addItem(
                {
                    item: { ...item, amount: filter?.amount },
                    shop: props.shop,
                    storage: props.storage,
                }));
            setFilter(undefined);
            setNewItem(v => ({ ...v, id: uuid.v4() as string }));
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
        <View style={{ flexGrow: 1, flexShrink: 1 }}>
            <SearchBar
                text={filter?.text}
                onChange={handleSearchChange}
                onSubmitEditing={() => handlePress(newItem)}
            />
            {
                !filter
                    ? props.list
                    : <FillFromHistoryList
                        item={newItem}
                        onPress={handlePress}
                        onIconPress={handleIconPress} />
            }
        </View>
    );
}
