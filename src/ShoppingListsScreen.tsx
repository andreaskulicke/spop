import React, { ReactNode } from "react";
import { Appbar, Divider, IconButton, List } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { StatusBarView } from "./StatusBarView";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
    addShoppingList,
    selectShoppingLists,
    setShoppingLists,
    updateActiveShoppingList,
} from "./store/otherDataSlice";
import { selectData, setData } from "./store/dataSlice";
import uuid from "react-native-uuid";
import { View } from "react-native";
import {
    NestableDraggableFlatList,
    NestableScrollContainer,
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Data } from "./store/data/data";
import { AreaItemTitle } from "./AreaItemTitle";
import { AvatarText } from "./AvatarText";
import { CategoryIcon } from "./CategoryIcon";
import { UndoSnackBar } from "./UndoSnackBar";
import { setUiShowUndo } from "./store/uiSlice";

export function ShoppingListsScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
}) {
    const data = useAppSelector(selectData);
    const lists = useAppSelector(selectShoppingLists);
    const dispatch = useAppDispatch();

    function handleAddShoppingListPress(): void {
        const id = uuid.v4() as string;
        dispatch(addShoppingList(id));
        props.navigation.navigate("ShoppingList", { id });
    }

    function handleGoBack() {
        dispatch(setUiShowUndo(false));
        props.navigation.goBack();
    }

    function handlePlayPress(newData: Data): void {
        dispatch(
            updateActiveShoppingList({
                id: newData.id,
                data,
            }),
        );
        dispatch(setData(newData));
    }

    function handleShoppingListPress(id: string): void {
        props.navigation.navigate("ShoppingList", { id });
    }

    function handleRenderItem(params: RenderItemParams<Data>): ReactNode {
        return (
            <ScaleDecorator>
                <List.Item
                    title={(p) => (
                        <AreaItemTitle p={p} title={params.item.name} />
                    )}
                    left={(p) => <AvatarText {...p} label={params.item.name} />}
                    right={(p) => (
                        <IconButton
                            {...p}
                            icon="playlist-play"
                            onPress={() => handlePlayPress(params.item)}
                        />
                    )}
                    onPress={() => handleShoppingListPress(params.item.id)}
                    onLongPress={() => params.drag()}
                />
            </ScaleDecorator>
        );
    }
    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title={"Shopping Listen"} />
                <Appbar.Action
                    icon="plus-outline"
                    onPress={handleAddShoppingListPress}
                />
            </Appbar.Header>
            <View>
                <List.Item
                    title={data.name}
                    left={(p) => <CategoryIcon {...p} icon="playlist-check" />}
                    onPress={() => handleShoppingListPress(data.id)}
                />
                <Divider />
                <NestableScrollContainer>
                    <NestableDraggableFlatList
                        data={lists}
                        keyExtractor={(x) => x.id}
                        renderItem={handleRenderItem}
                        onDragEnd={({ data }) =>
                            dispatch(setShoppingLists(data))
                        }
                    />
                </NestableScrollContainer>
            </View>
            <UndoSnackBar
                contextName="ShoppingListsScreen"
                insetOffset={true}
            />
        </StatusBarView>
    );
}
