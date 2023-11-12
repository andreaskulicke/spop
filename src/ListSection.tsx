import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Icon, IconButton, Text, useTheme } from 'react-native-paper';

export function ListSection(props: React.PropsWithChildren<{
    collapsed?: boolean | undefined;
    icon?: string;
    title: string;
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

    if (React.Children.count(props.children) === 0) {
        return <></>;
    }

    return (
        <View>
            <TouchableOpacity style={{ backgroundColor: theme.colors.secondaryContainer }} onPress={handlePress}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{
                        alignItems: "center",
                        flex: 1,
                        flexDirection: "row",
                        gap: 4,
                        justifyContent: "center",
                    }}>
                        {
                            props.icon
                            && <Icon size={16} source={props.icon} />
                        }
                        <Text variant="titleSmall">
                            {props.title}
                        </Text>
                    </View>
                    <IconButton icon={""} />
                    {
                        (props.collapsed !== undefined)
                        && <IconButton
                            icon={expanded ? "chevron-up" : "chevron-down"}
                            style={{ marginRight: 24 }} />
                    }

                </View>
            </TouchableOpacity>
            {expanded
                && props.children}
        </View>
    );
}
