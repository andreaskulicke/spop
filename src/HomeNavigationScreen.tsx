import { CategoriesNavigationScreen } from './CategoriesNavigationScreen';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { Icon } from 'react-native-paper';
import { ShopsNavigationScreen } from './ShopsNavigationScreen';
import { StoragesNavigationScreen } from './StoragesNavigationScreen';
import React from 'react';

export type TabParamList = {
    StoragesEntry: undefined;
    CategoriesEntry: undefined;
    ShopsEntry: undefined;
};

const Tab = createMaterialBottomTabNavigator<TabParamList>();

export function HomeNavigationScreen() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                component={StoragesNavigationScreen}
                name="StoragesEntry"
                options={{
                    tabBarIcon: p => <Icon {...p} size={24} source="home-plus-outline" />,
                    tabBarLabel: "Vorratsorte",
                }}
            />
            <Tab.Screen
                component={CategoriesNavigationScreen}
                name="CategoriesEntry"
                options={{
                    tabBarIcon: p => <Icon {...p} size={24} source="archive-outline" />,
                    tabBarLabel: "Kategorien",
                }}
            />
            <Tab.Screen
                component={ShopsNavigationScreen}
                name="ShopsEntry"
                options={{
                    tabBarIcon: p => <Icon {...p} size={24} source="cart-outline" />,
                    tabBarLabel: "Shops",
                }}
            />
        </Tab.Navigator>
    );
}
