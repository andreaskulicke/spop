import React, { useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputFocusEventData, View } from 'react-native';
import { Portal, useTheme, Text, Modal, Button, TextInput as PaperTextInput } from 'react-native-paper';
import { useAppSelector } from './store/hooks';

export function ColoredTextInput(props: {
    value: string | undefined;
    onChange?: (text: string) => void;
}) {
    const settings = useAppSelector(state => state.settings);
    const theme = useTheme();
    const [backgroundColor, setBackgroundColor] = useState(theme.colors.elevation.level0);
    const [value, setValue] = useState(props.value);
    const [showCalculator, setShowCalculator] = useState(false);
    const ref = useRef<TextInput>(null);

    function handleBlur(e: NativeSyntheticEvent<TextInputFocusEventData>): void {
        setBackgroundColor(theme.colors.elevation.level0);
        props.onChange?.(value ?? "");
    }

    function handleChangeText(text: string): void {
        setValue(text);
    }

    function handleFocus(): void {
        setBackgroundColor(theme.colors.elevation.level3);
        if (settings.things.useCalculator) {
            setShowCalculator(true);
        }
    }

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);


    return (
        <View>
            <TextInput
                ref={ref}
                selectTextOnFocus
                style={{ backgroundColor: backgroundColor, color: theme.colors.onBackground, minWidth: 56, maxWidth: "60%", marginHorizontal: 8 }}
                textAlign="right"
                value={value}
                onBlur={handleBlur}
                onChangeText={handleChangeText}
                onFocus={handleFocus}
            />
            <Calculator visible={showCalculator} onClose={() => {
                setShowCalculator(false);
                ref.current?.blur();
            }} />
        </View>
    );
}

function Calculator(props: {
    visible: boolean;
    onClose: () => void;
}) {
    const theme = useTheme();
    const [value, setValue] = useState("");

    function handleButtonPress(value: number | string): void {
        if (typeof value === "string") {
            switch (value) {
                case "C": setValue(""); break;
                case "<": setValue(v => v.substring(0, v.length - 1)); break;
            }
        } else {
            setValue(v => v + value);
        }
    }

    return (
        <Portal>
            <Modal visible={props.visible ?? false} style={style.modal} onDismiss={props.onClose}>
                <View style={{ backgroundColor: theme.colors.background }}>
                    <PaperTextInput
                        selectTextOnFocus
                        textAlign="right"
                        value={value}
                        style={style.text}
                        onChangeText={v => setValue(v)}
                    />
                    <View style={style.row}>
                        <Button mode="outlined" style={style.col4} onPress={() => handleButtonPress("%")}>%</Button>
                        <Button mode="outlined" style={style.col4} onPress={() => handleButtonPress("C")}>C</Button>
                        <Button mode="outlined" style={style.col4} onPress={() => handleButtonPress("<")}>{"<"}</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress("/")}>/</Button>
                    </View>
                    <View style={style.row}>
                        <Button mode="outlined" style={style.col4} onPress={() => handleButtonPress(7)}>7</Button>
                        <Button mode="outlined" style={style.col4} onPress={() => handleButtonPress(8)}>8</Button>
                        <Button mode="outlined" style={style.col4} onPress={() => handleButtonPress(9)}>9</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress("*")}>*</Button>
                    </View>
                    <View style={style.row}>
                        <Button mode="outlined" onPress={() => handleButtonPress(4)}>4</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(5)}>5</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(6)}>6</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress("-")}>-</Button>
                    </View>
                    <View style={style.row}>
                        <Button mode="outlined" onPress={() => handleButtonPress(1)}>1</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(2)}>2</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(3)}>3</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress("+")}>+</Button>
                    </View>
                    <View style={style.row}>
                        <Button mode="outlined" onPress={() => handleButtonPress(-1)}>-</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(0)}>0</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(",")}>,</Button>
                        <Button mode="contained">OK</Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}

const style = StyleSheet.create({
    "modal": {
        padding: 16,
    },
    "text": {
        margin: 24
    },
    "row": {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        marginVertical: 8,
        marginHorizontal: 16
    },
    "col3": {
    },
    "col4": {
    },
})
