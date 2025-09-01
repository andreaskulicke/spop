import {
    addStorage,
    allStorage,
    selectItems,
    selectStorages,
    setStorages,
} from "./store/dataSlice";
import { Appbar, Divider, List, Text, useTheme } from "react-native-paper";
import { AreaItemTitle } from "./AreaItemTitle";
import { AvatarText } from "./AvatarText";
import { CategoryIcon } from "./CategoryIcon";
import { Count } from "./Count";
import { NavigationProp } from "@react-navigation/native";
import {
    NestableDraggableFlatList,
    NestableScrollContainer,
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { RootStackParamList } from "../App";
import { SearchBarList } from "./SearchBarList";
import { StatusBarView } from "./StatusBarView";
import { Storage } from "./store/data/storages";
import { StoragesStackParamList } from "./StoragesNavigationScreen";
import { UnassignedBadge } from "./UnassignedBadge";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { View } from "react-native";
import React, { ReactNode } from "react";
import uuid from "react-native-uuid";
import { MainMenu } from "./MainMenu";
import { AppbarContentTitle } from "./AppbarContentTitle";

export function StoragesScreen(props: {
    navigation: NavigationProp<RootStackParamList & StoragesStackParamList>;
}) {
    const items = useAppSelector(selectItems);
    const storages = useAppSelector(selectStorages);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    function handleAddStoragePress(): void {
        const id = uuid.v4() as string;
        dispatch(addStorage(id));
        props.navigation.navigate("Storage", { id });
    }

    function handleStoragePress(id: string): void {
        props.navigation.navigate("Fill", { storageId: id });
    }

    function handleRenderItem(params: RenderItemParams<Storage>): ReactNode {
        if (params.item.id === allStorage.id) {
            return (
                <View>
                    <List.Item
                        title={allStorage.name}
                        style={{ backgroundColor: theme.colors.background }}
                        left={(p) => <CategoryIcon {...p} icon="check-all" />}
                        right={(p) => (
                            <UnassignedBadge
                                p={p}
                                tooltip="Gewünschte Dinge und ohne Vorratsort"
                                unassignedFilter={(item) =>
                                    (item.storages?.length ?? 0) === 0
                                }
                            />
                        )}
                        onPress={() => handleStoragePress(allStorage.id)}
                    />
                    <Divider />
                </View>
            );
        }

        const count = items.filter(
            (i) =>
                i.wanted &&
                i.storages.find((s) => s.storageId === params.item.id),
        ).length;
        return (
            <ScaleDecorator>
                <List.Item
                    title={(p) => (
                        <AreaItemTitle
                            p={p}
                            title={params.item.name}
                            bold={count > 0}
                        />
                    )}
                    left={(p) => <AvatarText {...p} label={params.item.name} />}
                    right={(p) => <Count {...p} count={count} />}
                    onPress={() => handleStoragePress(params.item.id)}
                    onLongPress={() => params.drag()}
                />
            </ScaleDecorator>
        );
    }

    return (
        <StatusBarView>
            <Appbar.Header elevated>
                <AppbarContentTitle title="Vorratsorte" />
                <Appbar.Action
                    icon="plus-outline"
                    onPress={handleAddStoragePress}
                />
                <MainMenu
                    navigation={
                        props.navigation as NavigationProp<RootStackParamList>
                    }
                />
            </Appbar.Header>
            <SearchBarList
                list={
                    <View>
                        <Divider />
                        <NestableScrollContainer>
                            <NestableDraggableFlatList
                                data={[allStorage].concat(storages)}
                                keyExtractor={(x) => x.id}
                                renderItem={handleRenderItem}
                                stickyHeaderIndices={[0]}
                                stickyHeaderHiddenOnScroll={true}
                                onDragEnd={({ data }) =>
                                    dispatch(setStorages(data))
                                }
                            />
                        </NestableScrollContainer>
                    </View>
                }
                storage={allStorage}
            />
        </StatusBarView>
    );
}
