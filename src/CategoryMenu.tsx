import { addCategory, selectSortedCategories } from "./store/dataSlice";
import { CategoryIcon } from "./CategoryIcon";
import { emptyCategory } from "./store/data/categories";
import {
    IconButton,
    Menu,
    TextInput,
    TouchableRipple,
    useTheme,
} from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { View } from "react-native";
import React, { useState } from "react";
import uuid from "react-native-uuid";

export function CategoryMenu(props: {
    categoryId: string | undefined;
    title?: string;
    onSetCategory: (categoryId: string) => void;
}) {
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const categories = useAppSelector(selectSortedCategories);
    const dispatch = useAppDispatch();
    const theme = useTheme();
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

    const category = categories.find((x) => x.id === props.categoryId);

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 8,
                marginBottom: 8,
            }}
        >
            <View style={{ flexGrow: 1, flexShrink: 1 }}>
                <Menu
                    anchor={
                        <TouchableRipple
                            onPress={() => setCategoryMenuVisible(true)}
                        >
                            <TextInput
                                editable={false}
                                label={props.title ?? "Kategorie"}
                                mode="outlined"
                                style={{ marginVertical: 8 }}
                                value={category?.name ?? emptyCategory.name}
                                left={
                                    <TextInput.Icon
                                        icon={
                                            category?.icon ?? "dots-horizontal"
                                        }
                                        color={theme.colors.primary}
                                        style={{}}
                                    />
                                }
                                right={
                                    <TextInput.Icon
                                        icon={
                                            categoryMenuVisible
                                                ? "chevron-up"
                                                : "chevron-down"
                                        }
                                        onPress={() =>
                                            setCategoryMenuVisible(true)
                                        }
                                    />
                                }
                            />
                        </TouchableRipple>
                    }
                    anchorPosition="top"
                    visible={categoryMenuVisible}
                    onDismiss={() => setCategoryMenuVisible(false)}
                >
                    {[emptyCategory, ...categories].map((x) => (
                        <Menu.Item
                            key={x.id}
                            contentStyle={{ marginLeft: 32 }}
                            title={x.name}
                            leadingIcon={(p) => (
                                <CategoryIcon
                                    {...p}
                                    icon={x.icon}
                                    selected={x.icon === category?.icon}
                                />
                            )}
                            onPress={() => {
                                setCategoryMenuVisible(false);
                                props.onSetCategory(x.id);
                            }}
                        />
                    ))}
                </Menu>
            </View>
            {props.categoryId && (
                <IconButton
                    icon="pencil-outline"
                    style={{ marginRight: 0 }}
                    onPress={handleEditCategoryPress}
                />
            )}
            <IconButton icon="plus-outline" onPress={handleAddCategoryPress} />
        </View>
    );
}
