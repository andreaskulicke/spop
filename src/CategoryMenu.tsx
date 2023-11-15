import React, { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { IconButton, Menu, TextInput, TouchableRipple } from "react-native-paper";
import { RootStackParamList } from "../App";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { addCategory } from "./store/dataSlice";
import { View } from "react-native";
import uuid from 'react-native-uuid';
import { CategoryIcon } from "./CategoryIcon";

export function CategoryMenu(props: {
    categoryId: string | undefined;
    title?: string;
    onSetCategory: (categoryId: string) => void;
}) {
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const categories = useAppSelector(state => state.data.categories);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    function handleAddCategoryPress(): void {
        const id = uuid.v4() as string;
        dispatch(addCategory(id));
        props.onSetCategory(id);
        navigation.navigate("Category", { id });
    }

    function handleEditCategoryPress(): void {
        if (props.categoryId) {
            navigation.navigate("Category", { id: props.categoryId });
        }
    }

    const category = categories.find(x => x.id === props.categoryId);

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CategoryIcon icon={category?.icon} onPress={() => setCategoryMenuVisible(true)} />
            <View style={{ flexGrow: 1, flexShrink: 1 }}>
                <Menu
                    anchor={
                        <TouchableRipple
                            style={{}}
                            onPress={() => setCategoryMenuVisible(true)}
                        >
                            <TextInput
                                editable={false}
                                label={props.title ?? "Kategorie"}
                                mode="outlined"
                                style={{ marginVertical: 8 }}
                                value={category?.name}
                                right={
                                    <TextInput.Icon icon={categoryMenuVisible ? "chevron-up" : "chevron-down"}
                                        onPress={() => setCategoryMenuVisible(true)}
                                    />
                                }
                            />
                        </TouchableRipple>
                    }
                    anchorPosition="bottom"
                    visible={categoryMenuVisible}
                    onDismiss={() => setCategoryMenuVisible(false)}
                >
                    {
                        [...categories]
                            .sort((x, y) => x.name.localeCompare(y.name))
                            .map(x => (
                                <Menu.Item
                                    key={x.id}
                                    contentStyle={{ marginLeft: 32 }}
                                    title={x.name}
                                    leadingIcon={p => <CategoryIcon {...p} icon={x.icon} selected={x.icon === category?.icon} />}
                                    onPress={() => {
                                        setCategoryMenuVisible(false);
                                        props.onSetCategory(x.id);
                                    }} />
                            ))
                    }
                </Menu>
            </View>
            {
                props.categoryId
                && <IconButton icon="pencil-outline" style={{ marginRight: 0 }} onPress={handleEditCategoryPress} />
            }
            <IconButton icon="plus-outline" onPress={handleAddCategoryPress} />
        </View>
    );
}
