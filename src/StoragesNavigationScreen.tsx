import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FillScreen } from "./FillScreen";
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
                options={{ headerShown: false }}
            />
            <Stack.Screen
                component={FillScreen}
                name="Fill"
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
