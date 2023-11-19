import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CategoriesScreen } from "./CategoriesScreen";
import { CategoryItemsScreen } from "./CategoryItemsScreen";

export type CategoriesStackParamList = {
    Categories: undefined;
    CategoryItems: { id: string | undefined };
};

const Stack = createNativeStackNavigator<CategoriesStackParamList>();

export function CategoriesNavigationScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                component={CategoriesScreen}
                name="Categories"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                component={CategoryItemsScreen}
                name="CategoryItems"
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
