import { Avatar, TouchableRipple, useTheme } from "react-native-paper";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";

export function AvatarIcon(props: {
    style?: Style;
    icon: string;
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
            <Avatar.Icon
                style={{
                    ...props.style,
                    backgroundColor: theme.colors.elevation.level3,
                }}
                color={theme.colors.primary}
                icon={props.icon}
                size={40}
            />
        </TouchableRipple>
    );
}
