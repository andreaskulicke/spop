import { Appbar, Button, Card, List, RadioButton, Switch } from "react-native-paper";
import { resetCategories, resetItems, resetShops, resetStorages, setData } from "./store/dataSlice";
import { ColorSchemeName, ScrollView } from "react-native";
import { setColorTheme, setSettings } from "./store/settingsSlice";
import { StatusBarView } from "./StatusBarView";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";

export function SettingsScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
}) {
    const data = useAppSelector(state => state.data);
    const settings = useAppSelector(state => state.settings);
    const dispatch = useAppDispatch();

    function handleSetColor(colorTheme: ColorSchemeName): void {
        dispatch(setColorTheme(colorTheme));
    }

    return (
        <StatusBarView bottomPadding>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={"Einstellungen"} />
            </Appbar.Header>
            <ScrollView>
                <Card
                    style={{ margin: 8 }}
                >
                    <Card.Title title="Anzeige" />
                    <List.Item
                        title="System"
                        right={p =>
                            <RadioButton
                                {...p}
                                value="undefined"
                                status={settings.display.colorTheme === undefined ? "checked" : "unchecked"}
                                onPress={() => handleSetColor(undefined)}
                            />
                        }
                    />
                    <List.Item
                        title="Hell"
                        right={p =>
                            <RadioButton
                                {...p}
                                value="light"
                                status={settings.display.colorTheme === "light" ? "checked" : "unchecked"}
                                onPress={() => handleSetColor("light")}
                            />
                        }
                    />
                    <List.Item
                        title="Dunkel"
                        right={p =>
                            <RadioButton
                                {...p}
                                value="dark"
                                status={settings.display.colorTheme === "dark" ? "checked" : "unchecked"}
                                onPress={() => handleSetColor("dark")}
                            />
                        }
                    />
                </Card>
                <Card style={{ margin: 8 }}>
                    <Card.Title title="Daten" />
                    <List.Item
                        title="Dinge"
                        right={p =>
                            <Button {...p} mode="outlined" onPress={() => dispatch(resetItems())}>
                                Zurücksetzten
                            </Button>
                        }
                    />
                    <List.Item
                        title="Kategorien"
                        right={p =>
                            <Button {...p} mode="outlined" onPress={() => dispatch(resetCategories())}>
                                Zurücksetzten
                            </Button>
                        }
                    />
                    <List.Item
                        title="Shops"
                        right={p =>
                            <Button {...p} mode="outlined" onPress={() => dispatch(resetShops())}>
                                Zurücksetzten
                            </Button>
                        }
                    />
                    <List.Item
                        title="Storages"
                        right={p =>
                            <Button {...p} mode="outlined" onPress={() => dispatch(resetStorages())}>
                                Zurücksetzten
                            </Button>
                        }
                    />
                    <List.Item
                        title="Alles in AsyncStorage"
                        right={p =>
                            <Button {...p} mode="outlined" onPress={async () => {
                                const keys = await AsyncStorage.getAllKeys();
                                await AsyncStorage.multiRemove(keys, errors => { })
                                dispatch(setData({
                                    categories: [...data.categories],
                                    items: [...data.items],
                                    shops: [...data.shops],
                                    storages: [...data.storages],
                                }));
                                dispatch(setSettings({ ...settings }));
                            }}>
                                Löschen
                            </Button>
                        }
                    />
                </Card>
            </ScrollView>
        </StatusBarView>
    );
}
