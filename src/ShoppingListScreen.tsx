import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { Keyboard, ScrollView, Text } from "react-native";
import { Appbar, Card, List, TextInput } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { StatusBarView } from "./StatusBarView";
import { useEffect, useState } from "react";
import {
    deleteShoppingList,
    selectShoppingList,
    setShoppingListDescription,
    setShoppingListName,
    updateActiveShoppingList,
} from "./store/otherDataSlice";
import {
    initialDataState,
    selectData,
    setData,
    setDataDescription,
    setDataName,
} from "./store/dataSlice";
import { Count } from "./Count";

export function ShoppingListScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
    route: RouteProp<RootStackParamList, "ShoppingList">;
}) {
    const [name, setName] = useState("");
    const data = useAppSelector(selectData);
    const shoppingListTmp = useAppSelector((state) =>
        selectShoppingList(state, props.route.params.id),
    );
    const [description, setDescription] = useState<string>();
    const dispatch = useAppDispatch();

    const shoppingList = shoppingListTmp ?? data;

    function handleGoBack() {
        handleTextInputNameBlur();
        props.navigation.goBack();
    }

    function handleDeletePress(): void {
        if (shoppingListTmp) {
            dispatch(deleteShoppingList(shoppingList.id));
        } else {
            dispatch(setData(initialDataState));
        }
        props.navigation.goBack();
    }

    function handlePlayPress(): void {
        if (shoppingListTmp) {
            dispatch(
                updateActiveShoppingList({
                    id: shoppingListTmp.id,
                    data,
                }),
            );
            dispatch(setData(shoppingListTmp));
        }
    }

    function handleTextInputNameBlur(): void {
        if (shoppingList) {
            const n = name.trim();
            if (n) {
                if (shoppingListTmp) {
                    dispatch(
                        setShoppingListName({ id: shoppingList.id, name: n }),
                    );
                } else {
                    dispatch(setDataName(n));
                }
                setName(n);
            }
        }
    }

    function handleTextInputNameChange(text: string): void {
        setName(text);
    }

    function handleTextInputNotesBlur(): void {
        if (shoppingList) {
            if (shoppingListTmp) {
                dispatch(
                    setShoppingListDescription({
                        id: shoppingList.id,
                        description: description,
                    }),
                );
            } else {
                dispatch(setDataDescription(description));
            }
        }
    }

    useEffect(() => {
        const s = Keyboard.addListener("keyboardDidHide", () =>
            handleTextInputNameBlur(),
        );
        return () => s.remove();
    }, []);

    useEffect(() => {
        setName(shoppingList?.name ?? "");
        setDescription(shoppingList.description ?? "");
    }, [shoppingList]);

    return (
        <StatusBarView bottomPadding>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content
                    title={shoppingList?.name ?? "Shopping Liste"}
                />
                {shoppingListTmp && (
                    <Appbar.Action
                        icon="playlist-play"
                        onPress={handlePlayPress}
                    />
                )}
                <Appbar.Action icon="trash-can" onPress={handleDeletePress} />
            </Appbar.Header>
            <ScrollView>
                <Card style={{ margin: 8 }}>
                    <Card.Title title={"Allgemein"} />
                    <TextInput
                        label="Name"
                        mode="outlined"
                        selectTextOnFocus
                        style={{ margin: 8 }}
                        value={name}
                        onBlur={handleTextInputNameBlur}
                        onChangeText={handleTextInputNameChange}
                    />
                    <TextInput
                        label="Beschreibung"
                        mode="outlined"
                        multiline
                        scrollEnabled
                        style={{ flexGrow: 1, margin: 8 }}
                        value={description}
                        onBlur={handleTextInputNotesBlur}
                        onChangeText={(text) => setDescription(text)}
                    />
                </Card>
                <Card style={{ margin: 8 }}>
                    <Card.Title title={"Statistik"} />
                    <Stat title="Dinge" count={shoppingList?.items.length} />
                    <Stat
                        title="Vorratsorte"
                        count={shoppingList?.storages.length}
                    />
                    <Stat
                        title="Kategorien"
                        count={shoppingList?.categories.length}
                    />
                    <Stat title="Shops" count={shoppingList?.shops.length} />
                </Card>
            </ScrollView>
        </StatusBarView>
    );
}

function Stat(props: { title: string; count: number | undefined }) {
    return (
        <List.Item
            title={props.title}
            right={(p) => <Count {...p} count={props.count ?? 0} />}
        />
    );
}
