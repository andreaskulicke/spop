import { SafeAreaView } from "react-native";

export function StatusBarView(props: React.PropsWithChildren<{
    bottomPadding?: boolean;
}>) {
    return (
        <SafeAreaView style={{ flexGrow: 1, flexShrink: 1, paddingBottom: props.bottomPadding ? 46 : 0 }}>
            {props.children}
        </SafeAreaView>
    );
}
