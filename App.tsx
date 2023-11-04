import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeNavigationScreen } from './src/HomeNavigationScreen';
import { ItemScreen } from './src/ItemScreen';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { Provider } from 'react-redux';
import { setItems } from './src/store/itemsSlice';
import { SettingsScreen } from './src/SettingsScreen';
import { store } from './src/store/store';
import { useAppDispatch, useAppSelector } from './src/store/hooks';
import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import merge from 'deepmerge';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

export type RootStackParamList = {
    Home: undefined;
    Item: { id: string };
    Settings: undefined;
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
    const items = useAppSelector(state => state.items);
    const settings = useAppSelector(state => state.settings);
    const dispatch = useAppDispatch();

    useEffect(() => {
        AsyncStorage.getItem("items").then(data => {
            if (data) {
                dispatch(setItems(JSON.parse(data)));
                // console.log("get items: " + data)
            }
        });
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("items", JSON.stringify(items));
        // console.log("set items: " + JSON.stringify(items))
    }, [items]);

    const theme = ((settings.colorTheme ?? colorScheme) === "dark")
        ? CombinedDarkTheme
        : CombinedDefaultTheme;

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
                <RootStack.Navigator>
                    <RootStack.Screen
                        component={HomeNavigationScreen}
                        name="Home"
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
                </RootStack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
