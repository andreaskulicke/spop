import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import React, { useEffect, useRef, useState } from 'react';

export function ColoredTextInput(props: {
    value: string | undefined;
    onChange?: (text: string) => void;
}) {
    const theme = useTheme();
    const [value, setValue] = useState(props.value);
    const ref = useRef<TextInput>(null);

    function handleBlur(e: NativeSyntheticEvent<TextInputFocusEventData>): void {
        props.onChange?.(value ?? "");
    }

    function handleChangeText(text: string): void {
        setValue(text);
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
                    style={{ backgroundColor: theme.colors.elevation.level0, color: theme.colors.onBackground, minWidth: 56, maxWidth: "60%", marginHorizontal: 8 }}
                    textAlign="right"
                    value={value}
                    onBlur={handleBlur}
                    onChangeText={handleChangeText}
                />
            </View>
        </TouchableOpacity>
    );
}
