import { SafeAreaView, ScrollView, View } from "react-native";
import { Card, List, RadioButton } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setColorTheme } from "./store/settingsSlice";

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
            </ScrollView>
        </SafeAreaView>
    );
}
