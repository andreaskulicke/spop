import { SafeAreaView } from "react-native";

export function StatusBarView(props: React.PropsWithChildren<{}>) {
    return (
        <SafeAreaView
            style={{
                flexGrow: 1,
                flexShrink: 1,
            }}
        >
            {props.children}
        </SafeAreaView>
    );
}
