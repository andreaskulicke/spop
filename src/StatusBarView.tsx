import { SafeAreaView, StatusBar } from "react-native";
import { useTheme } from "react-native-paper";
import { useEffect, useState } from "react";

export function StatusBarView(props: React.PropsWithChildren<{}>) {
    const theme = useTheme();
    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        setToggle(v => !v);
    }, [theme]);

    return (
        <SafeAreaView style={{ flexGrow: 1, flexShrink: 1 }}>
            <StatusBar
                backgroundColor={theme.colors.elevation.level2}
                barStyle={theme.dark ? "light-content" : "dark-content"}
                hidden={false}
            />
            {props.children}
        </SafeAreaView>
    );
}
