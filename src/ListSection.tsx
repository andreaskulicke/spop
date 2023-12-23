import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, IconButton, Text, useTheme } from 'react-native-paper';

export function ListSection(props: React.PropsWithChildren<{
    collapsed?: boolean | undefined;
    count?: number;
    icon?: string;
    title: string;
    visible?: "dynamic" | "always";
    onExpandChange?: (expanded: boolean) => void;
}>) {
    const [expanded, setExpanded] = useState(!props.collapsed);
    const theme = useTheme();

    function handlePress(): void {
        if (props.collapsed !== undefined) {
            props.onExpandChange?.(!expanded);
            setExpanded(v => !v);
        }
    }

    useEffect(() => {
        if (props.collapsed !== undefined) {
            setExpanded(!props.collapsed);
        }
    }, [props.collapsed]);

    if ((props.visible !== "always")
        && React.Children.count(props.children) === 0) {
        return <></>;
    }

    return (
        <View
            style={{
                marginBottom: 2,
            }}
        >
            <TouchableOpacity style={{ backgroundColor: theme.colors.secondaryContainer }} onPress={handlePress}>
                <View style={{
                    alignItems: "center",
                    flexDirection: "row",
                    height: 52,
                }}>
                    <View style={{
                        alignItems: "center",
                        flex: 1,
                        flexDirection: "row",
                        gap: 8,
                        justifyContent: "center",
                    }}>
                        {
                            props.icon
                            && <Icon size={16} source={props.icon} />
                        }
                        <Text variant="titleSmall">
                            {props.title + ((props.count !== undefined) ? ` (${props.count})` : "")}
                        </Text>
                    </View>
                    {
                        (props.collapsed !== undefined)
                        && <IconButton
                            icon={expanded ? "chevron-up" : "chevron-down"}
                            style={{ marginLeft: -20 }}
                        />
                    }

                </View>
            </TouchableOpacity>
            {
                expanded && props.children
            }
        </View>
    );
}
