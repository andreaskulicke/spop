import React from "react";
import { Text, View } from "react-native";

export function ItemsListTitle(props: { title: string }) {
    return (
        <View>
            <Text style={{ fontSize: 16, maxHeight: 42 }}>{props.title}</Text>
        </View>
    );
}
