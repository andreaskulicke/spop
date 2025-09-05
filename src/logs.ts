import { LogBox } from "react-native";

export function ignoreKnownLogs(): void {
    LogBox.ignoreLogs([
        new RegExp(".*measureLayout.*"),
        new RegExp(".*findNodeHandle is deprecated in StrictMode.*"),
        new RegExp(
            ".*findHostInstance_DEPRECATED is deprecated in StrictMode.*",
        ),
    ]);
}
