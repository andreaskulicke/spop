import { Text } from "react-native-paper";
import { Style } from "react-native-paper/lib/typescript/components/List/utils";
import { selectItemsWithCategory } from "./store/dataSlice";
import { useAppSelector } from "./store/hooks";

export function CategoryCount(props: {
    categoryId: string | undefined;
    style?: Style | undefined;
}) {
    const itemsCategory = useAppSelector(selectItemsWithCategory(props.categoryId));

    return (
        <Count count={itemsCategory.length} style={props.style} />
    );
}

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
