import { Text } from "react-native-paper";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";


export function Count(props: {
    count: number;
    style?: Style | undefined;
}) {
    return (
        <Text {...props.style} variant="labelMedium" style={{ paddingLeft: 32, paddingVertical: 12 }}>
            {props.count}
        </Text>
    );
}
