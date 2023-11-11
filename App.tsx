import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeNavigationScreen } from './src/HomeNavigationScreen';
import { ItemScreen } from './src/ItemScreen';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import { setCategories, setItems, setShops, setStorages } from './src/store/dataSlice';
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

function AppWithStore() {
    const colorScheme = useColorScheme();
    const categories = useAppSelector(state => state.data.categories);
    const items = useAppSelector(state => state.data.items);
    const shops = useAppSelector(state => state.data.shops);
    const settings = useAppSelector(state => state.settings);
    const storages = useAppSelector(state => state.data.storages);
    const dispatch = useAppDispatch();

    useEffect(() => {
        AsyncStorage.getItem("categories").then(data => {
            if (data) {
                dispatch(setCategories(JSON.parse(data)));
            }
        });
        AsyncStorage.getItem("items").then(data => {
            if (data) {
                dispatch(setItems(JSON.parse(data)));
            }
        });
        AsyncStorage.getItem("shops").then(data => {
            if (data) {
                dispatch(setShops(JSON.parse(data)));
            }
        });
        AsyncStorage.getItem("storages").then(data => {
            if (data) {
                dispatch(setStorages(JSON.parse(data)));
            }
        });
    }, []);

    useEffect(() => {
        // console.log("items: " + JSON.stringify(items));
        AsyncStorage.setItem("categories", JSON.stringify(categories));
        AsyncStorage.setItem("items", JSON.stringify(items));
        AsyncStorage.setItem("shops", JSON.stringify(shops));
        AsyncStorage.setItem("storages", JSON.stringify(storages));
    }, [categories, items, shops, storages]);

    const theme = ((settings.colorTheme ?? colorScheme) === "dark")
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
