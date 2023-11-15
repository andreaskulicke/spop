import { StyleProp, ViewStyle } from "react-native";
import { IconButton } from "react-native-paper";

export function CategoryIcon(props: {
    icon: string | undefined;
    selected?: boolean;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}) {
    return (
        <IconButton
            icon={props.icon ?? "dots-horizontal"}
            mode="contained"
            style={{
                ...props.style as object,
                ...(props.selected ? {
                    borderWidth: 1,
                } : {}),
            }}
            onPress={props.onPress}
        />
    );
}
