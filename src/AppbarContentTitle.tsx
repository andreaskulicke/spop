import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { selectData } from "./store/dataSlice";
import { useAppSelector } from "./store/hooks";
import { selectSettings } from "./store/settingsSlice";

export function AppbarContentTitle(props: { title: string }) {
    const data = useAppSelector(selectData);
    const settings = useAppSelector(selectSettings);

    return (
        <Appbar.Content
            title={
                <View>
                    <Text variant="titleLarge">{props.title}</Text>
                    {!settings.display.hideShoppingListInTitle && (
                        <Text variant="titleSmall">{data.name}</Text>
                    )}
                </View>
            }
            style={{ marginLeft: 12 }}
        />
    );
}
