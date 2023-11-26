import { SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function StatusBarView(props: React.PropsWithChildren<{
    bottomPadding?: boolean;
}>) {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{
            flexGrow: 1,
            flexShrink: 1,
            paddingBottom: props.bottomPadding ? insets.bottom : 0,
        }}
        >
            {props.children}
        </SafeAreaView>
    );
}
