import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { HomeNavigationScreen } from './src/HomeNavigationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setItems } from './src/store/itemsSlice';
import { useAppDispatch, useAppSelector } from './src/store/hooks';
import { SettingsScreen } from './src/SettingsScreen';
import { ItemScreen } from './src/ItemScreen';

export type RootStackParamList = {
    Home: undefined;
    Item: { id: string };
    Settings: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <Provider store={store}>
            <PaperProvider>
                <AppWithPersistence />
            </PaperProvider>
        </Provider>
    );
}

function AppWithPersistence() {
    const items = useAppSelector(state => state.items);
    const dispatch = useAppDispatch();

    useEffect(() => {
        AsyncStorage.getItem("items").then(data => {
            if (data) {
                dispatch(setItems(JSON.parse(data)));
                console.log("get items: " + data)
            }
        });
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("items", JSON.stringify(items));
        console.log("set items: " + JSON.stringify(items))
    }, [items]);

    return (
        <NavigationContainer>
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
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });
