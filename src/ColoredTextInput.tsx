import React, { useEffect, useState } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputFocusEventData } from 'react-native';
import { useTheme } from 'react-native-paper';

export function ColoredTextInput(props: {
    value: string;
    onChange?: (text: string) => void;
}) {
    const theme = useTheme();
    const [backgroundColor, setBackgroundColor] = useState(theme.colors.elevation.level0);
    const [value, setValue] = useState(props.value);

    function handleBlur(e: NativeSyntheticEvent<TextInputFocusEventData>): void {
        setBackgroundColor(theme.colors.elevation.level0);
        props.onChange?.(value);
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
        <TextInput
            selectTextOnFocus
            style={{ backgroundColor: backgroundColor, minWidth: 56, maxWidth: "60%", paddingHorizontal: 8 }}
            textAlign="right"
            value={value}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
        />
    );
}
