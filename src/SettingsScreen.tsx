import { SafeAreaView, ScrollView } from "react-native";
import { Button, Card, List, RadioButton } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setColorTheme, setSettings } from "./store/settingsSlice";
import { resetCategories, resetItems, resetShops, resetStorages, setData } from "./store/dataSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function SettingsScreen() {
    const data = useAppSelector(state => state.data);
    const settings = useAppSelector(state => state.settings);
    const dispatch = useAppDispatch();

    return (
        <SafeAreaView>
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
                                onPress={() => dispatch(setColorTheme(undefined))}
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
                                onPress={() => dispatch(setColorTheme("light"))}
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
                                onPress={() => dispatch(setColorTheme("dark"))}
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
                            <Button {...p} mode="outlined" onPress={() => {
                                AsyncStorage.clear();
                                dispatch(setData({ ...data }));
                                dispatch(setSettings({ ...settings }));
                            }}>
                                Löschen
                            </Button>
                        }
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
