import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import React, { useEffect, useRef, useState } from 'react';

export function ColoredTextInput(props: {
    value: string | undefined;
    onChange?: (text: string) => void;
}) {
    const theme = useTheme();
    const [backgroundColor, setBackgroundColor] = useState(theme.colors.elevation.level0);
    const [value, setValue] = useState(props.value);
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
    }

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    return (
        <TouchableOpacity onPress={() => ref.current?.focus()}>
            <View pointerEvents="none">
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
            </View>
        </TouchableOpacity>
    );
}
