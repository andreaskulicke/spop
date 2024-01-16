import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StorageItemsScreen } from "./StorageItemsScreen";
import { StoragesScreen } from "./StoragesScreen";

export type StoragesStackParamList = {
    Storages: undefined;
    Fill: { storageId: string };
};

const Stack = createNativeStackNavigator<StoragesStackParamList>();

export function StoragesNavigationScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                component={StoragesScreen}
                name="Storages"
                options={{ headerShown: false, statusBarHidden: false }}
            />
            <Stack.Screen
                component={StorageItemsScreen}
                name="Fill"
                options={{ headerShown: false, statusBarHidden: false }}
            />
        </Stack.Navigator>
    );
}
