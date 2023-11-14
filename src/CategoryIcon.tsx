import { IconButton } from "react-native-paper";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";
import { IconProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";

export function CategoryIcon(props: {
    icon: string | undefined;
    selected?: boolean;
    style?: Style;
    onPress?: () => void;
}) {
    return (
        <IconButton
            icon={props.icon ?? "dots-horizontal"}
            mode="contained"
            style={{
                ...props.style,
                ...(props.selected ? {
                    borderWidth: 1,
                } : {}),
            }}
            onPress={props.onPress}
        />
    );
}
