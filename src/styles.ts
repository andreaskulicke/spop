import { StyleProp, ViewStyle } from "react-native";
import { MD3Theme } from "react-native-paper";

export function modalContainerStyle(): StyleProp<ViewStyle> {
    return {
        alignSelf: "center",
        padding: 12,
        minWidth: 360,
        maxWidth: 400,
    };
}

export function modalViewStyle(theme: MD3Theme): StyleProp<ViewStyle> {
    return {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.primary,
        borderRadius: theme.roundness,
        borderWidth: 1,
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 16,
    };
}
