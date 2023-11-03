import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FillScreen } from "./FillScreen";
import { StorageScreen } from "./StorageScreen";

export type StoragesStackParamList = {
    Storage: undefined;
    Fill: undefined;
};

const Stack = createNativeStackNavigator<StoragesStackParamList>();

export function StoragesScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                component={StorageScreen}
                name="Storage"
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
