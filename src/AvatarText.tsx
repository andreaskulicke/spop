import { Avatar, useTheme } from "react-native-paper";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";

export function AvatarText(props: {
    style?: Style;
    label: string;
}) {
    const theme = useTheme();

    return (
        <Avatar.Text
            style={props.style}
            color={theme.colors.primaryContainer}
            label={props.label.substring(0, 2).toUpperCase()}
            size={40}
        />
    );
}
