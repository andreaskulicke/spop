import { SafeAreaView } from "react-native";

export function StatusBarView(props: React.PropsWithChildren<{}>) {
    return (
        <SafeAreaView style={{ flexGrow: 1, flexShrink: 1, paddingBottom: 46 }}>
            {props.children}
        </SafeAreaView>
    );
}
