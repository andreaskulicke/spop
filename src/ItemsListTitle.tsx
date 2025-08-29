import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";

export function ItemsListTitle(props: { title: string }) {
    const theme = useTheme();

    return (
        <View>
            <Text
                style={{
                    fontSize: 16,
                    maxHeight: 42,
                    color: theme.colors.onPrimaryContainer,
                }}
            >
                {props.title}
            </Text>
        </View>
    );
}
