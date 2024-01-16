import { addItem, allStorage, allShop } from './store/dataSlice';
import { Category, emptyCategory } from './store/data/categories';
import { HistoryList } from './HistoryList';
import { Item, UnitId } from './store/data/items';
import { KeyboardAvoidingView, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { parseQuantityUnit, quantityToString } from './numberToString';
import { RootStackParamList } from '../App';
import { SearchBar } from './SearchBar';
import { Shop } from './store/data/shops';
import { Storage } from './store/data/storages';
import { useAppDispatch } from './store/hooks';
import React, { useEffect, useState } from 'react';
import uuid from 'react-native-uuid';

export function SearchBarList(props: {
    list: React.ReactNode;
    category?: Category;
    shop?: Shop;
    storage?: Storage;
    onItemPress?: (itemId: string) => void;
}) {
    const categoryId = (!props.category || props.category.id === emptyCategory.id) ? undefined : props.category.id;

    const [filter, setFilter] = useState<{ text: string; name?: string; quantity?: string; }>();
    const [newItem, setNewItem] = useState<Item>({
        id: uuid.v4() as string,
        name: "",
        quantity: undefined,
        categoryId: categoryId,
        shops: (!props.shop || (props.shop.id === allShop.id)) ? [] : [{ checked: true, shopId: props.shop.id }],
        storages: (!props.storage || (props.storage.id === allStorage.id)) ? [] : [{ storageId: props.storage.id }],
    });
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    function handlePress(item: Item): void {
        if (item?.name) {
            const [q, u] = parseQuantityUnit(filter?.quantity);
            dispatch(addItem(
                {
                    item: { ...item, categoryId: categoryId ?? item.categoryId, quantity: q, unitId: u },
                    shop: props.shop,
                    storage: props.storage,
                }));
            setFilter(undefined);
            setNewItem(v => ({ ...v, id: uuid.v4() as string }));
            props.onItemPress?.(item.id);
        }
    }

    function handleIconPress(name: string, quantity: number | undefined, unitId: UnitId | undefined): void {
        name = name.trim() + " ";
        setFilter({ text: quantity ? `${quantity}${unitId} ${name}` : name, name, quantity: quantityToString(quantity) + unitId });
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
        const [q, u] = parseQuantityUnit(filter?.quantity);
        setNewItem(v => ({
            ...v,
            name: filter?.name ?? filter?.text ?? "",
            quantity: q,
            unitId: u,
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
            <View
                style={{
                    flex: 1,
                }}
            >
                {
                    (!filter || !filter.name)
                        ? props.list
                        : <HistoryList
                            item={newItem}
                            shop={props.shop}
                            storage={props.storage}
                            onPress={handlePress}
                            onIconPress={handleIconPress} />
                }
            </View>
        </KeyboardAvoidingView>
    );
}
