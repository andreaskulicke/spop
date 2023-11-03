import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { Icon, MD3Colors } from 'react-native-paper';
import { ShopScreen } from './ShopScreen';
import { StoragesScreen } from './StoragesScreen';

export type TabParamList = {
    Storages: undefined;
    Shop: undefined;
};

const Tab = createMaterialBottomTabNavigator<TabParamList>();

export function HomeScreen() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                component={StoragesScreen}
                name="Storages"
                options={{
                    tabBarIcon: () => <Icon color={MD3Colors.primary0} size={20} source="home-plus" />
                }}
            />
            <Tab.Screen
                component={ShopScreen}
                name="Shop"
                options={{
                    tabBarIcon: () => <Icon color={MD3Colors.primary0} size={20} source="cart" />
                }}
            />
        </Tab.Navigator>
    );
}
