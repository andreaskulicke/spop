import { SafeAreaView, ScrollView } from "react-native";
import { Button, Card, List, RadioButton } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setColorTheme } from "./store/settingsSlice";
import { resetItems } from "./store/itemsSlice";
import { resetCategories } from "./store/categoriesSlice";
import { resetShops } from "./store/shopsSlice";
import { resetStorages } from "./store/storagesSlice";

export function SettingsScreen() {
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
                                status={settings.colorTheme === undefined ? "checked" : "unchecked"}
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
                                status={settings.colorTheme === "light" ? "checked" : "unchecked"}
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
                                status={settings.colorTheme === "dark" ? "checked" : "unchecked"}
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
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
