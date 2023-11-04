import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { Icon, MD3Colors } from 'react-native-paper';
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
                    tabBarIcon: () => <Icon color={MD3Colors.primary0} size={24} source="home-plus" />,
                    tabBarLabel: "Storages",
                }}
            />
            <Tab.Screen
                component={ShopsNavigationScreen}
                name="ShopsEntry"
                options={{
                    tabBarIcon: () => <Icon color={MD3Colors.primary0} size={24} source="cart" />,
                    tabBarLabel: "Shops",
                }}
            />
        </Tab.Navigator>
    );
}
