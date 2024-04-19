import React from "react";
import { View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

export function CategorySection(
    props: React.PropsWithChildren<{
        icon?: string;
        title: string;
        visible?: "dynamic" | "always";
    }>,
) {
    const theme = useTheme();

    if (
        props.visible !== "always" &&
        React.Children.count(props.children) === 0
    ) {
        return <></>;
    }

    return (
        <View
            style={{
                marginBottom: 2,
                marginHorizontal: 4,
            }}
        >
            <View
                style={{
                    alignItems: "center",
                    backgroundColor: theme.colors.secondaryContainer,
                    flexDirection: "row",
                    gap: 8,
                    padding: 16,
                }}
            >
                <Icon size={16} source={props.icon ?? "dots-horizontal"} />
                <Text variant="bodyMedium">{props.title}</Text>
            </View>
            {props.children}
        </View>
    );
}
