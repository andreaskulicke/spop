import {
    Appbar,
    Button,
    Card,
    Checkbox,
    Dialog,
    Icon,
    IconButton,
    List,
    Menu,
    Portal,
    Text,
    TextInput,
    TouchableRipple,
} from "react-native-paper";
import {
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    useColorScheme,
    View,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import {
    addItem,
    resetCategories,
    resetData,
    resetShops,
    resetStorages,
    setData,
    setItems,
    setShops,
    setStorages,
} from "./store/dataSlice";
import {
    resetSettings,
    selectKeepAwakeCategories,
    selectKeepAwakeShops,
    selectKeepAwakeStorages,
    selectSettings,
    setColorTheme,
    setHideShoppingListInTitle,
    setKeepAwake,
    setSettings,
    setTheme,
} from "./store/settingsSlice";
import { RootStackParamList } from "../App";
import { StatusBarView } from "./StatusBarView";
import { isRootState, store } from "./store/store";
import { themes } from "./store/themes/themes";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useState } from "react";
import {
    resetOtherData,
    setOtherData,
    setShoppingLists,
} from "./store/otherDataSlice";
import * as Application from "expo-application";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import {
    resetUi,
    selectUiSettingsDataExpanded,
    setUi,
    setUiSettingsData,
} from "./store/uiSlice";

const styles = StyleSheet.create({
    button: {
        width: 96,
    },
    buttons: {
        flexDirection: "row",
        gap: 4,
    },
});

export function SettingsScreen(props: {
    navigation: NavigationProp<RootStackParamList>;
}) {
    const settings = useAppSelector(selectSettings);
    const isKeepAwakeCategories = useAppSelector(selectKeepAwakeCategories);
    const isKeepAwakeShops = useAppSelector(selectKeepAwakeShops);
    const isKeepAwakeStorages = useAppSelector(selectKeepAwakeStorages);
    const dataExpanded = useAppSelector(selectUiSettingsDataExpanded);

    const [dialogVisible, setDialogVisible] = useState<
        "items" | "shops" | "storages" | "shoppingLists" | undefined
    >();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [colorThemeMenuVisible, setColorThemeMenuVisible] = useState(false);
    const [themeMenuVisible, setThemeMenuVisible] = useState(false);

    const colorScheme = useColorScheme();
    const dispatch = useAppDispatch();

    function getDialogText(): string {
        switch (dialogVisible) {
            case "items":
                return "Wirklich alle Dinge löschen?";
            case "shops":
                return "Wirklich alle Shops löschen?";
            case "storages":
                return "Wirklich alle Vorratsorte löschen?";
            case "shoppingLists":
                return "Wirklich alle anderen Shopping Listen löschen?";
        }
        return "";
    }

    function handleDataExpandedToggle(): void {
        dispatch(setUiSettingsData({ expanded: !dataExpanded }));
    }

    function handleDeleteYes(): void {
        switch (dialogVisible) {
            case "items":
                dispatch(setItems([]));
                break;
            case "shops":
                dispatch(setShops([]));
                break;
            case "storages":
                dispatch(setStorages([]));
                break;
            case "shoppingLists":
                dispatch(setShoppingLists([]));
                break;
        }
        setDialogVisible(undefined);
    }

    async function handleFeebackPress(): Promise<void> {
        const url = `mailto:andreaskulicke.apps@gmx.de?subject=Spop ${getVersionString()}`;
        if (await Linking.canOpenURL(url)) {
            Linking.openURL(url);
        }
    }

    async function handleExportState(): Promise<void> {
        setButtonsDisabled(true);
        await Share.share({
            message: JSON.stringify(store.getState()),
        });
        setButtonsDisabled(false);
    }

    async function handleImportState(): Promise<void> {
        setButtonsDisabled(true);
        const result = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            type: ["application/json", "text/*"],
        });
        if (!result.canceled) {
            const stateString = await FileSystem.readAsStringAsync(
                result.assets[0].uri,
            );
            const state = JSON.parse(stateString);
            if (isRootState(state)) {
                dispatch(setData(state.data.present));
                dispatch(setOtherData(state.otherData.present));
                dispatch(setSettings(state.settings));
                dispatch(setUi(state.ui));
            }
        }
        setButtonsDisabled(false);
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
        <StatusBarView>
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => props.navigation.goBack()} />
                <Appbar.Content title={"Einstellungen"} />
            </Appbar.Header>
            <ScrollView>
                <Card style={{ margin: 8 }}>
                    <Card.Title title="Allgemein" />
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
                    <List.Item
                        title="System color scheme"
                        right={() => <Text>{`"${colorScheme}"`}</Text>}
                    />
                    <List.Item
                        title="Shopping Liste in Titel anzeigen?"
                        right={() => (
                            <Checkbox
                                status={
                                    settings.display.hideShoppingListInTitle
                                        ? "unchecked"
                                        : "checked"
                                }
                                onPress={() =>
                                    dispatch(
                                        setHideShoppingListInTitle(
                                            !settings.display
                                                .hideShoppingListInTitle,
                                        ),
                                    )
                                }
                            />
                        )}
                    />
                </Card>
                <Card style={{ margin: 8 }}>
                    <Card.Title title="Bildschirm anlassen in" />
                    <View>
                        <List.Item
                            title="Vorratsorte"
                            right={() => (
                                <Checkbox
                                    status={
                                        isKeepAwakeStorages
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() =>
                                        dispatch(
                                            setKeepAwake({
                                                area: "storages",
                                                keepAwake: !isKeepAwakeStorages,
                                            }),
                                        )
                                    }
                                />
                            )}
                        />
                        <List.Item
                            title="Kategorien"
                            right={() => (
                                <Checkbox
                                    status={
                                        isKeepAwakeCategories
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() =>
                                        dispatch(
                                            setKeepAwake({
                                                area: "categories",
                                                keepAwake:
                                                    !isKeepAwakeCategories,
                                            }),
                                        )
                                    }
                                />
                            )}
                        />
                        <List.Item
                            title="Shops"
                            right={() => (
                                <Checkbox
                                    status={
                                        isKeepAwakeShops
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() =>
                                        dispatch(
                                            setKeepAwake({
                                                area: "shops",
                                                keepAwake: !isKeepAwakeShops,
                                            }),
                                        )
                                    }
                                />
                            )}
                        />
                    </View>
                </Card>
                <Card style={{ margin: 8 }}>
                    <TouchableRipple onPress={handleDataExpandedToggle}>
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
                                    onPress={handleDataExpandedToggle}
                                />
                            )}
                        />
                    </TouchableRipple>
                    {dataExpanded && (
                        <View>
                            <List.Item
                                title="Einstellungen"
                                right={(p) => (
                                    <View style={styles.buttons}>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={() => {
                                                dispatch(resetData());
                                                dispatch(resetOtherData());
                                                dispatch(resetSettings());
                                                dispatch(resetUi());
                                            }}
                                        >
                                            Standard
                                        </Button>
                                    </View>
                                )}
                            />
                            <List.Item
                                title="Dinge"
                                right={(p) => (
                                    <View style={styles.buttons}>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={() =>
                                                setDialogVisible("items")
                                            }
                                        >
                                            Löschen
                                        </Button>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={() => {
                                                const d = new Date();
                                                for (
                                                    let index = 0;
                                                    index < 10;
                                                    index++
                                                ) {
                                                    const id = `item_${d.toISOString()}_${index}`;
                                                    dispatch(
                                                        addItem({
                                                            item: {
                                                                id: id,
                                                                name: id,
                                                                shops: [],
                                                                storages: [],
                                                            },
                                                        }),
                                                    );
                                                }
                                            }}
                                        >
                                            Generieren
                                        </Button>
                                    </View>
                                )}
                            />
                            <List.Item
                                title="Kategorien"
                                right={(p) => (
                                    <View style={styles.buttons}>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={() =>
                                                dispatch(resetCategories())
                                            }
                                        >
                                            Standard
                                        </Button>
                                    </View>
                                )}
                            />
                            <List.Item
                                title="Shops"
                                right={(p) => (
                                    <View style={styles.buttons}>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={() =>
                                                setDialogVisible("shops")
                                            }
                                        >
                                            Löschen
                                        </Button>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={() =>
                                                dispatch(resetShops())
                                            }
                                        >
                                            Standard
                                        </Button>
                                    </View>
                                )}
                            />
                            <List.Item
                                title="Vorratsorte"
                                right={(p) => (
                                    <View style={styles.buttons}>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={() =>
                                                setDialogVisible("storages")
                                            }
                                        >
                                            Löschen
                                        </Button>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={() =>
                                                dispatch(resetStorages())
                                            }
                                        >
                                            Standard
                                        </Button>
                                    </View>
                                )}
                            />
                            <List.Item
                                title="Shopping Listen"
                                right={(p) => (
                                    <View style={styles.buttons}>
                                        <Button
                                            {...p}
                                            compact
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={() =>
                                                setDialogVisible(
                                                    "shoppingLists",
                                                )
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
                                    <View style={styles.buttons}>
                                        <Button
                                            {...p}
                                            compact
                                            disabled={buttonsDisabled}
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={handleExportState}
                                        >
                                            Exportieren
                                        </Button>
                                        <Button
                                            {...p}
                                            compact
                                            disabled={buttonsDisabled}
                                            mode="outlined"
                                            style={styles.button}
                                            onPress={handleImportState}
                                        >
                                            Importieren
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
                        right={(p) => <Text {...p}>{getVersionString()}</Text>}
                    />
                </Card>
            </ScrollView>
            <Portal>
                <Dialog
                    visible={!!dialogVisible}
                    onDismiss={() => setDialogVisible(undefined)}
                >
                    <Dialog.Content>
                        <Text>{getDialogText()}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisible(undefined)}>
                            NEIN
                        </Button>
                        <Button onPress={handleDeleteYes}>JA</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </StatusBarView>
    );
}

function getVersionString() {
    return `${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`;
}
