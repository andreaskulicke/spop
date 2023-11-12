import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeNavigationScreen } from './src/HomeNavigationScreen';
import { ItemScreen } from './src/ItemScreen';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import { setData } from './src/store/dataSlice';
import { SettingsScreen } from './src/SettingsScreen';
import { store } from './src/store/store';
import { useAppDispatch, useAppSelector } from './src/store/hooks';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import merge from 'deepmerge';
import { StorageScreen } from './src/StorageScreen';
import { ShopScreen } from './src/ShopScreen';
import { CategoryScreen } from './src/CategoryScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setSettings } from './src/store/settingsSlice';

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
    Storage: { id: string, new?: boolean };
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
    const categories = useAppSelector(state => state.data.categories);
    const items = useAppSelector(state => state.data.items);
    const shops = useAppSelector(state => state.data.shops);
    const storages = useAppSelector(state => state.data.storages);
    const settings = useAppSelector(state => state.settings);
    const dispatch = useAppDispatch();

    useEffect(() => {
        AsyncStorage.multiGet(Object.keys(storeNames), (errors, result) => {
            console.log(`data: restoring '${Object.keys(storeNames)}'...`);
            if (result) {
                const indices = new Map(Object.keys(storeNames).map((x, i) => [x, i]));
                dispatch(setData({
                    categories: JSON.parse(result[indices.get(storeNames.categories)!][1] ?? "[]"),
                    items: JSON.parse(result[indices.get(storeNames.items)!][1] ?? "[]"),
                    shops: JSON.parse(result[indices.get(storeNames.shops)!][1] ?? "[]"),
                    storages: JSON.parse(result[indices.get(storeNames.storages)!][1] ?? "[]"),
                }));
                dispatch(setSettings(JSON.parse(result[indices.get(storeNames.settings)!][1] ?? "[]")));
            }
        });
    }, []);

    useEffect(() => {
        console.log(`data: storing '${storeNames.categories}'...`)
        AsyncStorage.setItem(storeNames.categories, JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        console.log(`data: storing '${storeNames.items}'...`)
        AsyncStorage.setItem(storeNames.items, JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        console.log(`data: storing '${storeNames.shops}'...`)
        AsyncStorage.setItem(storeNames.shops, JSON.stringify(shops));
    }, [shops]);

    useEffect(() => {
        console.log(`data: storing '${storeNames.storages}'...`)
        AsyncStorage.setItem(storeNames.storages, JSON.stringify(storages));
    }, [storages]);

    useEffect(() => {
        console.log(`data: storing '${storeNames.settings}'...`)
        AsyncStorage.setItem(storeNames.settings, JSON.stringify(settings));
    }, [settings]);

    const theme = ((settings.display.colorTheme ?? colorScheme) === "dark")
        ? CombinedDarkTheme
        : CombinedDefaultTheme;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={theme}>
                    <RootStack.Navigator>
                        <RootStack.Screen
                            component={HomeNavigationScreen}
                            name="Home"
                            options={{ headerShown: false }}
                        />

                        <RootStack.Screen
                            component={CategoryScreen}
                            name="Category"
                            options={{ headerShown: false }}
                        />
                        <RootStack.Screen
                            component={ItemScreen}
                            name="Item"
                            options={{ headerShown: false }}
                        />
                        <RootStack.Screen
                            component={SettingsScreen}
                            name="Settings"
                        />
                        <RootStack.Screen
                            component={ShopScreen}
                            name="Shop"
                            options={{ headerShown: false }}
                        />
                        <RootStack.Screen
                            component={StorageScreen}
                            name="Storage"
                            options={{ headerShown: false }}
                        />
                    </RootStack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
