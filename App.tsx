import { CategoryScreen } from "./src/CategoryScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HomeNavigationScreen } from "./src/HomeNavigationScreen";
import { ItemScreen } from "./src/ItemScreen";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { SettingsScreen } from "./src/SettingsScreen";
import { ShopScreen } from "./src/ShopScreen";
import { StorageScreen } from "./src/StorageScreen";
import { persistor, store } from "./src/store/store";
import { useAppSelector } from "./src/store/hooks";
import { useColorScheme } from "react-native";
import { selectSettings, selectTheme } from "./src/store/settingsSlice";
import { PersistGate } from "redux-persist/integration/react";
import { StrictMode } from "react";
import { ShoppingListScreen } from "./src/ShoppingListScreen";
import { ShoppingListsScreen } from "./src/ShoppingListsScreen";

export type RootStackParamList = {
    Category: { id: string };
    Home: undefined;
    Item: { id: string; storageId?: string; shopId?: string };
    Settings: undefined;
    Shop: { id: string };
    ShoppingList: { id: string };
    ShoppingLists: { id: string };
    Storage: { id: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <StrictMode>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AppWithStore />
                </PersistGate>
            </Provider>
        </StrictMode>
    );
}

function AppWithStore() {
    const colorScheme = useColorScheme();
    const settings = useAppSelector(selectSettings);
    const theme = useAppSelector((state) =>
        selectTheme(
            state,
            (settings.display.colorTheme ?? colorScheme) === "dark",
        ),
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={theme}>
                    <RootStack.Navigator
                        screenOptions={{
                            statusBarStyle: theme.dark ? "light" : "dark",
                            orientation: "portrait",
                        }}
                    >
                        <RootStack.Screen
                            component={HomeNavigationScreen}
                            name="Home"
                            options={{
                                headerShown: false,
                                statusBarHidden: false,
                            }}
                        />

                        <RootStack.Screen
                            component={CategoryScreen}
                            name="Category"
                            options={{
                                headerShown: false,
                                statusBarHidden: false,
                            }}
                        />
                        <RootStack.Screen
                            component={ItemScreen}
                            name="Item"
                            options={{
                                headerShown: false,
                                statusBarHidden: false,
                            }}
                        />
                        <RootStack.Screen
                            component={SettingsScreen}
                            name="Settings"
                            options={{
                                headerShown: false,
                                statusBarHidden: false,
                            }}
                        />
                        <RootStack.Screen
                            component={ShoppingListsScreen}
                            name="ShoppingLists"
                            options={{
                                headerShown: false,
                                statusBarHidden: false,
                            }}
                        />
                        <RootStack.Screen
                            component={ShoppingListScreen}
                            name="ShoppingList"
                            options={{
                                headerShown: false,
                                statusBarHidden: false,
                            }}
                        />
                        <RootStack.Screen
                            component={ShopScreen}
                            name="Shop"
                            options={{
                                headerShown: false,
                                statusBarHidden: false,
                            }}
                        />
                        <RootStack.Screen
                            component={StorageScreen}
                            name="Storage"
                            options={{
                                headerShown: false,
                                statusBarHidden: false,
                            }}
                        />
                    </RootStack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
