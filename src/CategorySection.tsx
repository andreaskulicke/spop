import React from 'react';
import { View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

export function CategorySection(props: React.PropsWithChildren<{
    icon?: string;
    title: string;
}>) {
    const theme = useTheme();

    if (React.Children.count(props.children) === 0) {
        return <></>;
    }

    return (
        <View>
            <View
                style={{
                    alignItems: "center",
                    backgroundColor: theme.colors.tertiaryContainer,
                    flexDirection: "row",
                    gap: 8,
                    padding: 16,
                }}
            >
                <Icon
                    size={16}
                    source={props.icon ?? "dots-horizontal"} />
                <Text
                    variant="bodyMedium"
                >
                    {props.title}
                </Text>
            </View>
            {props.children}
        </View>
    );
}
