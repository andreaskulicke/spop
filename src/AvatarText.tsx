import { Avatar, TouchableRipple, useTheme } from "react-native-paper";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";

export function AvatarText(props: {
    style?: Style;
    label: string;
    onPress?: () => void;
}) {
    const theme = useTheme();

    return (
        <TouchableRipple
            style={{
                alignSelf: "center",
            }}
            onPress={props.onPress}
        >
            <Avatar.Text
                style={{
                    ...props.style,
                    backgroundColor: theme.colors.elevation.level3,
                }}
                labelStyle={{
                    fontSize: 16,
                    fontWeight: "bold",
                }}
                color={theme.colors.primary}
                label={props.label.substring(0, 2).toUpperCase()}
                size={40}
            />
        </TouchableRipple>
    );
}
