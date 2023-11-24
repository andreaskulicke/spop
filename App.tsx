import { CategoryScreen } from './src/CategoryScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { HomeNavigationScreen } from './src/HomeNavigationScreen';
import { ItemScreen } from './src/ItemScreen';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import { SettingsScreen } from './src/SettingsScreen';
import { ShopScreen } from './src/ShopScreen';
import { StorageScreen } from './src/StorageScreen';
import { store } from './src/store/store';
import { useAppSelector } from './src/store/hooks';
import { useColorScheme } from 'react-native';
import merge from 'deepmerge';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

export type RootStackParamList = {
    Category: { id: string };
    Home: undefined;
    Item: { id: string };
    Settings: undefined;
    Shop: { id: string };
    Storage: { id: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <Provider store={store}>
            <AppWithStore />
        </Provider>
    );
}

const storeNames = {
    categories: "categories",
    items: "items",
    shops: "shops",
    storages: "storages",
    settings: "settings",
};

function AppWithStore() {
    const colorScheme = useColorScheme();
    const settings = useAppSelector(state => state.settings);

    const theme = ((settings.display.colorTheme ?? colorScheme) === "dark")
        ? CombinedDarkTheme
        : CombinedDefaultTheme;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={theme}>
                    <RootStack.Navigator screenOptions={{
                        statusBarColor: theme.colors.elevation.level2,
                        statusBarStyle: theme.dark ? "light" : "dark",
                        navigationBarColor: theme.colors.elevation.level2,
                    }}
                    >
                        <RootStack.Screen
                            component={HomeNavigationScreen}
                            name="Home"
                            options={{ headerShown: false, statusBarHidden: false }}
                        />

                        <RootStack.Screen
                            component={CategoryScreen}
                            name="Category"
                            options={{ headerShown: false, statusBarHidden: false }}
                        />
                        <RootStack.Screen
                            component={ItemScreen}
                            name="Item"
                            options={{ headerShown: false, statusBarHidden: false }}
                        />
                        <RootStack.Screen
                            component={SettingsScreen}
                            name="Settings"
                            options={{ headerShown: false, statusBarHidden: false }}
                        />
                        <RootStack.Screen
                            component={ShopScreen}
                            name="Shop"
                            options={{ headerShown: false, statusBarHidden: false }}
                        />
                        <RootStack.Screen
                            component={StorageScreen}
                            name="Storage"
                            options={{ headerShown: false, statusBarHidden: false }}
                        />
                    </RootStack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
