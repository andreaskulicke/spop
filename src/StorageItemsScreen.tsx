import { allStorage, selectStorage } from "./store/dataSlice";
import { Appbar } from "react-native-paper";
import { StorageItemsList } from "./StorageItemsList";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { SearchBarList } from "./SearchBarList";
import { StatusBarView } from "./StatusBarView";
import { StoragesStackParamList } from "./StoragesNavigationScreen";
import { useAppSelector } from "./store/hooks";
import React, { useState } from "react";

export function StorageItemsScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<StoragesStackParamList, "Fill">;
}) {
    const [selectedItemId, setSelectedItemId] = useState("");
    const storage = useAppSelector((state) =>
        selectStorage(state, props.route.params.storageId),
    );

    function handleEditPress(): void {
        props.navigation.navigate("Storage", { id: storage.id });
    }

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={storage?.name ?? allStorage.name} />
                {storage.id !== allStorage.id && (
                    <Appbar.Action
                        icon="pencil-outline"
                        onPress={handleEditPress}
                    />
                )}
            </Appbar.Header>
            <SearchBarList
                list={
                    <StorageItemsList
                        storage={storage}
                        selectedItemId={selectedItemId}
                    />
                }
                storage={storage}
                onItemPress={(itemId) => setSelectedItemId(itemId)}
            />
        </StatusBarView>
    );
}
