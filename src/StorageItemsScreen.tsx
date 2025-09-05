import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { Appbar } from "react-native-paper";
import { RootStackParamList } from "../App";
import { SearchBarList } from "./SearchBarList";
import { StatusBarView } from "./StatusBarView";
import { StorageItemsList } from "./StorageItemsList";
import { StoragesStackParamList } from "./StoragesNavigationScreen";
import { allStorage, selectStorage } from "./store/dataSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setUiShowUndo } from "./store/uiSlice";
import { UndoSnackBar } from "./UndoSnackBar";

export function StorageItemsScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<StoragesStackParamList, "Fill">;
}) {
    const [selectedItemId, setSelectedItemId] = useState("");
    const storage = useAppSelector((state) =>
        selectStorage(state, props.route.params.storageId),
    );

    const dispatch = useAppDispatch();

    function handleEditPress(): void {
        props.navigation.navigate("Storage", { id: storage.id });
    }

    function handleGoBack() {
        dispatch(setUiShowUndo(false));
        props.navigation.goBack();
    }

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={handleGoBack} />
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
            <UndoSnackBar contextName="StorageItemsScreen" />
        </StatusBarView>
    );
}
