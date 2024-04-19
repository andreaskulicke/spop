import { Badge, Tooltip } from "react-native-paper";
import { Count } from "./Count";
import { Item } from "./store/data/items";
import { selectItems } from "./store/dataSlice";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";
import { useAppSelector } from "./store/hooks";
import { View } from "react-native";

export function UnassignedBadge(props: {
    p: {
        color?: string;
        style?: Style;
    };
    tooltip: string;
    unassignedFilter: (item: Item) => boolean;
}) {
    const items = useAppSelector(selectItems);

    const count = items.filter((i) => i.wanted).length;
    const unassignedCount = items.filter(
        (item) => item.wanted && props.unassignedFilter(item),
    ).length;

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Tooltip title={props.tooltip}>
                <Count {...props.p} count={count} />
            </Tooltip>
            <Badge
                visible={unassignedCount > 0}
                style={{ position: "absolute", top: 0, right: -20 }}
            >
                {unassignedCount}
            </Badge>
        </View>
    );
}
