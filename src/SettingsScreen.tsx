import { Appbar, Button, Card, List, Menu, RadioButton, TextInput, TouchableRipple } from "react-native-paper";
import { resetCategories, resetItems, resetShops, resetStorages, setData, setItems, setShops, setStorages } from "./store/dataSlice";
import { ColorSchemeName, ScrollView, View } from "react-native";
import { setColorTheme, setSettings, setTheme } from "./store/settingsSlice";
import { StatusBarView } from "./StatusBarView";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App";
import { getUnitName } from "./store/data/items";
import { useState } from "react";
import { themes } from "./store/themes/themes";

export function SettingsScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
}) {
    const data = useAppSelector(state => state.data);
    const settings = useAppSelector(state => state.settings);
    const dispatch = useAppDispatch();
    const [colorThemeMenuVisible, setColorThemeMenuVisible] = useState(false);
    const [themeMenuVisible, setThemeMenuVisible] = useState(false);

    function handleSetColor(colorTheme: ColorSchemeName): void {
        dispatch(setColorTheme(colorTheme));
    }

    let colorSchemeLabel = "System";
    switch (settings.display.colorTheme) {
        case "dark":
            colorSchemeLabel = "Dunkel";
            break;
        case "light":
            colorSchemeLabel = "Hell";
            break;
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
                    <Menu
                        anchor={
                            <TouchableRipple
                                onPress={() => setColorThemeMenuVisible(true)}
                            >
                                <TextInput
                                    editable={false}
                                    label="Farbschema"
                                    mode="outlined"
                                    value={colorSchemeLabel}
                                    style={{ margin: 8 }}
                                    right={
                                        <TextInput.Icon icon={colorThemeMenuVisible ? "chevron-up" : "chevron-down"}
                                            onPress={() => setColorThemeMenuVisible(true)}
                                        />
                                    }
                                />
                            </TouchableRipple>
                        }
                        anchorPosition="bottom"
                        visible={colorThemeMenuVisible}
                        style={{ marginLeft: 8 }}
                        onDismiss={() => setColorThemeMenuVisible(false)}
                    >
                        <Menu.Item
                            title="System"
                            onPress={() => {
                                setColorThemeMenuVisible(false);
                                dispatch(setColorTheme(undefined));
                            }}
                        />
                        <Menu.Item
                            title="Hell"
                            onPress={() => {
                                setColorThemeMenuVisible(false);
                                dispatch(setColorTheme("light"));
                            }}
                        />
                        <Menu.Item
                            title="Dunkel"
                            onPress={() => {
                                setColorThemeMenuVisible(false);
                                dispatch(setColorTheme("dark"));
                            }}
                        />
                    </Menu>
                    <Menu
                        anchor={
                            <TouchableRipple
                                onPress={() => setThemeMenuVisible(true)}
                            >
                                <TextInput
                                    editable={false}
                                    label="Schema"
                                    mode="outlined"
                                    value={themes.find(x => x.id === settings.display.theme)?.label}
                                    style={{ margin: 8 }}
                                    right={
                                        <TextInput.Icon icon={themeMenuVisible ? "chevron-up" : "chevron-down"}
                                            onPress={() => setThemeMenuVisible(true)}
                                        />
                                    }
                                />
                            </TouchableRipple>
                        }
                        anchorPosition="bottom"
                        style={{ marginLeft: 8 }}
                        visible={themeMenuVisible}
                        onDismiss={() => setThemeMenuVisible(false)}
                    >
                        {
                            themes.map(t =>
                                <Menu.Item
                                    key={t.id}
                                    title={t.label}
                                    onPress={() => {
                                        setThemeMenuVisible(false);
                                        dispatch(setTheme(t.id));
                                    }}
                                />
                            )
                        }
                    </Menu>
                </Card>
                <Card style={{ margin: 8 }}>
                    <Card.Title title="Daten" />
                    <List.Item
                        title="Dinge"
                        right={p =>
                            <Button {...p} compact mode="outlined" onPress={() => dispatch(setItems([]))}>
                                Löschen
                            </Button>
                        }
                    />
                    <List.Item
                        title="Kategorien"
                        right={p =>
                            <Button {...p} compact mode="outlined" onPress={() => dispatch(resetCategories())}>
                                Zurücksetzten
                            </Button>
                        }
                    />
                    <List.Item
                        title="Shops"
                        right={p =>
                            <View style={{ flexDirection: "row" }}>
                                <Button {...p} compact mode="outlined" onPress={() => dispatch(resetShops())}>
                                    Standard
                                </Button>
                                <Button {...p} compact mode="outlined" onPress={() => dispatch(setShops([]))}>
                                    Löschen
                                </Button>
                            </View>
                        }
                    />
                    <List.Item
                        title="Vorratsorte"
                        right={p =>
                            <View style={{ flexDirection: "row" }}>
                                <Button {...p} compact mode="outlined" onPress={() => dispatch(resetStorages())}>
                                    Standard
                                </Button>
                                <Button {...p} compact mode="outlined" onPress={() => dispatch(setStorages([]))}>
                                    Löschen
                                </Button>
                            </View>
                        }
                    />
                </Card>
            </ScrollView>
        </StatusBarView>
    );
}
