import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { Icon } from 'react-native-paper';
import { StoragesNavigationScreen } from './StoragesNavigationScreen';
import { ShopsNavigationScreen } from './ShopsNavigationScreen';

export type TabParamList = {
    StoragesEntry: undefined;
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
                    tabBarLabel: "Storages",
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
