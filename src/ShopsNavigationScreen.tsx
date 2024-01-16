import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ShopsScreen } from "./ShopsScreen";
import { ShopItemsScreen } from "./ShopItemsScreen";

export type ShopsStackParamList = {
    Shops: undefined;
    Shopping: { id: string };
};

const Stack = createNativeStackNavigator<ShopsStackParamList>();

export function ShopsNavigationScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                component={ShopsScreen}
                name="Shops"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                component={ShopItemsScreen}
                name="Shopping"
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
