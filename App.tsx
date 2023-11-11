import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeNavigationScreen } from './src/HomeNavigationScreen';
import { ItemScreen } from './src/ItemScreen';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import { setCategories, setData, setItems, setShops, setStorages } from './src/store/dataSlice';
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

function AppWithStore() {
    const colorScheme = useColorScheme();
    const data = useAppSelector(state => state.data);
    const settings = useAppSelector(state => state.settings);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log("data: restoring...")
        AsyncStorage.getItem("data").then(data => {
            if (data) {
                dispatch(setData(JSON.parse(data)));
            }
        });
        AsyncStorage.getItem("settings").then(data => {
            if (data) {
                dispatch(setSettings(JSON.parse(data)));
            }
        });
    }, []);

    useEffect(() => {
        console.log("data: storing...")
        AsyncStorage.setItem("data", JSON.stringify(data));
        AsyncStorage.setItem("settings", JSON.stringify(settings));
    }, [data, settings]);

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
