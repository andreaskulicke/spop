import {
    Appbar,
    Button,
    Card,
    Icon,
    IconButton,
    List,
    Menu,
    Text,
    TextInput,
    TouchableRipple,
} from "react-native-paper";
import { Linking, ScrollView, Share, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import {
    resetCategories,
    resetShops,
    resetStorages,
    selectCategories,
    selectItems,
    selectShops,
    selectStorages,
    setData,
    setItems,
    setShops,
    setStorages,
} from "./store/dataSlice";
import { resetSettings, setColorTheme, setTheme } from "./store/settingsSlice";
import { RootStackParamList } from "../App";
import { StatusBarView } from "./StatusBarView";
import { store } from "./store/store";
import { themes } from "./store/themes/themes";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useState } from "react";
import appJson from "../app.json";
import packageJson from "../package.json";

export function SettingsScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
}) {
    const settings = useAppSelector((state) => state.settings);
    const dataVersion = useAppSelector((state) => state.data.version);
    const categories = useAppSelector(selectCategories);
    const items = useAppSelector(selectItems);
    const shops = useAppSelector(selectShops);
    const storages = useAppSelector(selectStorages);
    const dispatch = useAppDispatch();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [colorThemeMenuVisible, setColorThemeMenuVisible] = useState(false);
    const [themeMenuVisible, setThemeMenuVisible] = useState(false);
    const [dataExpanded, setDataExpanded] = useState(false);

    async function handleFeebackPress(): Promise<void> {
        const url = `mailto:andreaskulicke.apps@gmx.de?subject=Spop ${packageJson.version} (${appJson.expo.android.versionCode})`;
        if (await Linking.canOpenURL(url)) {
            Linking.openURL(url);
        }
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
                <Card style={{ margin: 8 }}>
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
                                        <TextInput.Icon
                                            icon={
                                                colorThemeMenuVisible
                                                    ? "chevron-up"
                                                    : "chevron-down"
                                            }
                                            onPress={() =>
                                                setColorThemeMenuVisible(true)
                                            }
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
                                    value={
                                        themes.find(
                                            (x) =>
                                                x.id === settings.display.theme,
                                        )?.label
                                    }
                                    style={{ margin: 8 }}
                                    right={
                                        <TextInput.Icon
                                            icon={
                                                themeMenuVisible
                                                    ? "chevron-up"
                                                    : "chevron-down"
                                            }
                                            onPress={() =>
                                                setThemeMenuVisible(true)
                                            }
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
                        {themes.map((t) => (
                            <Menu.Item
                                key={t.id}
                                title={t.label}
                                onPress={() => {
                                    setThemeMenuVisible(false);
                                    dispatch(setTheme(t.id));
                                }}
                            />
                        ))}
                    </Menu>
                </Card>
                <Card style={{ margin: 8 }}>
                    <TouchableRipple onPress={() => setDataExpanded((x) => !x)}>
                        <Card.Title
                            title="Daten"
                            right={(p) => (
                                <IconButton
                                    {...p}
                                    icon={
                                        dataExpanded
                                            ? "chevron-up"
                                            : "chevron-down"
                                    }
                                    onPress={() => setDataExpanded((x) => !x)}
                                />
                            )}
                        />
                    </TouchableRipple>
                    {dataExpanded && (
                        <View>
                            <List.Item
                                title="Einstellungen"
                                right={(p) => (
                                    <Button
                                        {...p}
                                        compact
                                        mode="outlined"
                                        onPress={() => {
                                            dispatch(resetSettings());
                                            dispatch(
                                                setData({
                                                    version: dataVersion,
                                                    categories: categories,
                                                    items: items,
                                                    shops: shops,
                                                    storages: storages,
                                                }),
                                            );
                                        }}
                                    >
                                        Standard
                                    </Button>
                                )}
                            />
                            <List.Item
                                title="Dinge"
                                right={(p) => (
                                    <Button
                                        {...p}
                                        compact
                                        mode="outlined"
                                        onPress={() => dispatch(setItems([]))}
                                    >
                                        Löschen
                                    </Button>
                                )}
                            />
                            <List.Item
                                title="Kategorien"
                                right={(p) => (
                                    <Button
                                        {...p}
                                        compact
                                        mode="outlined"
                                        onPress={() =>
                                            dispatch(resetCategories())
                                        }
                                    >
                                        Standard
                                    </Button>
                                )}
                            />
                            <List.Item
                                title="Shops"
                                right={(p) => (
                                    <View style={{ flexDirection: "row" }}>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            onPress={() =>
                                                dispatch(resetShops())
                                            }
                                        >
                                            Standard
                                        </Button>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            onPress={() =>
                                                dispatch(setShops([]))
                                            }
                                        >
                                            Löschen
                                        </Button>
                                    </View>
                                )}
                            />
                            <List.Item
                                title="Vorratsorte"
                                right={(p) => (
                                    <View style={{ flexDirection: "row" }}>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            onPress={() =>
                                                dispatch(resetStorages())
                                            }
                                        >
                                            Standard
                                        </Button>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            onPress={() =>
                                                dispatch(setStorages([]))
                                            }
                                        >
                                            Löschen
                                        </Button>
                                    </View>
                                )}
                            />
                            <List.Item
                                title="Daten"
                                right={(p) => (
                                    <View style={{ flexDirection: "row" }}>
                                        <Button
                                            {...p}
                                            compact
                                            disabled={buttonsDisabled}
                                            mode="outlined"
                                            onPress={async () => {
                                                setButtonsDisabled(true);
                                                await Share.share({
                                                    message: JSON.stringify(
                                                        store.getState(),
                                                    ),
                                                });
                                                setButtonsDisabled(false);
                                            }}
                                        >
                                            Exportieren
                                        </Button>
                                    </View>
                                )}
                            />
                        </View>
                    )}
                </Card>
                <Card style={{ margin: 8 }}>
                    <Card.Title title="Info" />
                    <List.Item
                        title="Feeback"
                        right={(p) => (
                            <Icon
                                {...p}
                                size={24}
                                source="email-send-outline"
                            />
                        )}
                        onPress={handleFeebackPress}
                    />
                    <List.Item
                        title="Version"
                        right={(p) => (
                            <Text {...p}>
                                {`${packageJson.version} (${appJson.expo.android.versionCode})`}
                            </Text>
                        )}
                    />
                </Card>
            </ScrollView>
        </StatusBarView>
    );
}
