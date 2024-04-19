import { Style } from "react-native-paper/lib/typescript/components/List/utils";
import { Text } from "react-native-paper";
import React from "react";

export function AreaItemTitle(props: {
    p: {
        color?: string;
        style?: Style;
    };
    title: string;
    bold?: boolean;
}) {
    return (
        <Text
            {...props.p}
            variant="bodyLarge"
            style={{ fontWeight: props.bold ? "bold" : "normal" }}
        >
            {props.title}
        </Text>
    );
}
