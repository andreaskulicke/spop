import { CategoriesNavigationScreen } from "./CategoriesNavigationScreen";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { Icon } from "react-native-paper";
import { ShopsNavigationScreen } from "./ShopsNavigationScreen";
import { StoragesNavigationScreen } from "./StoragesNavigationScreen";
import React from "react";
import { useAppSelector } from "./store/hooks";
import {
    selectKeepAwakeCategories,
    selectKeepAwakeShops,
    selectKeepAwakeStorages,
} from "./store/settingsSlice";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

export type TabParamList = {
    StoragesEntry: undefined;
    CategoriesEntry: undefined;
    ShopsEntry: undefined;
};

const Tab = createMaterialBottomTabNavigator<TabParamList>();

export function HomeNavigationScreen() {
    const isKeepAwakeCategories = useAppSelector(selectKeepAwakeCategories);
    const isKeepAwakeShops = useAppSelector(selectKeepAwakeShops);
    const isKeepAwakeStorages = useAppSelector(selectKeepAwakeStorages);

    return (
        <Tab.Navigator>
            <Tab.Screen
                component={StoragesNavigationScreen}
                name="StoragesEntry"
                listeners={{
                    blur: () => {
                        deactivateKeepAwake();
                    },
                    focus: () => {
                        if (isKeepAwakeStorages) {
                            activateKeepAwakeAsync();
                        }
                    },
                }}
                options={{
                    tabBarIcon: (p: TabBarIconProps) => (
                        <Icon {...p} size={24} source="home-plus-outline" />
                    ),
                    tabBarLabel: "Vorratsorte",
                }}
            />
            <Tab.Screen
                component={CategoriesNavigationScreen}
                name="CategoriesEntry"
                listeners={{
                    blur: () => {
                        deactivateKeepAwake();
                    },
                    focus: () => {
                        if (isKeepAwakeCategories) {
                            activateKeepAwakeAsync();
                        }
                    },
                }}
                options={{
                    tabBarIcon: (p: TabBarIconProps) => (
                        <Icon {...p} size={24} source="archive-outline" />
                    ),
                    tabBarLabel: "Kategorien",
                }}
            />
            <Tab.Screen
                component={ShopsNavigationScreen}
                name="ShopsEntry"
                listeners={{
                    blur: () => {
                        deactivateKeepAwake();
                    },
                    focus: () => {
                        if (isKeepAwakeShops) {
                            activateKeepAwakeAsync();
                        }
                    },
                }}
                options={{
                    tabBarIcon: (p: TabBarIconProps) => (
                        <Icon {...p} size={24} source="cart-outline" />
                    ),
                    tabBarLabel: "Shops",
                }}
            />
        </Tab.Navigator>
    );
}

interface TabBarIconProps {
    focused: boolean;
    color: string;
    size: number;
}
