import { Avatar, TouchableRipple, useTheme } from "react-native-paper";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";

export function AvatarText(props: {
    style?: Style;
    label: string;
    onPress?: () => void;
}) {
    const theme = useTheme();

    // Use first chars of first  two words or first two chars of one word only
    const label = props.label
        .split(" ")
        .concat(props.label[1] ?? "")
        .slice(0, 2)
        .map((x) => x[0])
        .join("")
        .toUpperCase();

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
                label={label}
                size={40}
            />
        </TouchableRipple>
    );
}
