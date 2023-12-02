import { Avatar, useTheme } from "react-native-paper";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";

export function AvatarText(props: {
    style?: Style;
    label: string;
}) {
    const theme = useTheme();

    return (
        <Avatar.Text
            style={{
                ...props.style,
                alignSelf: "center",
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
    );
}
