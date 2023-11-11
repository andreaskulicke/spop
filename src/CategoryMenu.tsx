import React, { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { IconButton, Menu, TextInput, TouchableRipple } from "react-native-paper";
import { RootStackParamList } from "../App";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { addCategory } from "./store/dataSlice";
import { Dimensions, View } from "react-native";
import { AvatarText } from "./AvatarText";
import uuid from 'react-native-uuid';

export function CategoryMenu(props: {
    categoryId: string | undefined;
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

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flexGrow: 1 }}>
                <Menu
                    anchor={<TouchableRipple
                        onPress={() => setCategoryMenuVisible(true)}
                    >
                        <TextInput
                            editable={false}
                            label="Kategorie"
                            mode="outlined"
                            style={{ margin: 8 }}
                            value={categories.find(x => x.id === props.categoryId)?.name}
                            right={<TextInput.Icon icon={categoryMenuVisible ? "chevron-up" : "chevron-down"} onPress={() => setCategoryMenuVisible(true)} />} />
                    </TouchableRipple>}
                    anchorPosition="bottom"
                    style={{ marginLeft: 8, width: Dimensions.get("window").width - 32 }}
                    visible={categoryMenuVisible}
                    onDismiss={() => setCategoryMenuVisible(false)}
                >
                    {[...categories]
                        .sort((x, y) => x.name.localeCompare(y.name))
                        .map(x => (
                            <Menu.Item
                                key={x.id}
                                contentStyle={{ marginLeft: 24 }}
                                title={x.name}
                                leadingIcon={p => <AvatarText {...p} label={x.name} />}
                                onPress={() => {
                                    setCategoryMenuVisible(false);
                                    props.onSetCategory(x.id);
                                }} />
                        ))}
                </Menu>
            </View>
            {
                props.categoryId
                && <IconButton icon="pencil-outline" onPress={handleEditCategoryPress} />
            }
            <IconButton icon="plus-outline" onPress={handleAddCategoryPress} />
        </View>
    );
}
