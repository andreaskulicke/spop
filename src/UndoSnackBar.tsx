import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Snackbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
    selectUiUndo,
    setUiUndo,
    undoData,
    undoOtherData,
} from "./store/uiSlice";

export function UndoSnackBar(props: {
    contextName: string;
    insetOffset?: boolean;
}) {
    const navigation = useNavigation();
    const undo = useAppSelector(selectUiUndo);
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    function handleDismissSnackBar(): void {
        // console.log(props.contextName + ": dismissing");
        dispatch(setUiUndo(undefined));
    }

    function handlePressUndo(): void {
        switch (undo) {
            case "UNDO_DATA":
                dispatch(undoData());
                break;
            case "UNDO_OTHERDATA":
                dispatch(undoOtherData());
                break;
        }
        handleDismissSnackBar();
    }

    useEffect(() => {
        const unsubscribeBlur = navigation.addListener("blur", () => {
            // console.log(props.contextName + ": blur");
            handleDismissSnackBar();
        });
        return () => {
            unsubscribeBlur();
        };
    }, [navigation]);

    return (
        <Snackbar
            action={{
                label: "",
                icon: "undo",
                onPress: handlePressUndo,
            }}
            style={{
                bottom: props.insetOffset ? insets.bottom : 4,
                position: "absolute",
            }}
            visible={undo !== undefined}
            onDismiss={handleDismissSnackBar}
        >
            Wieder rückgängig machen?
        </Snackbar>
    );
}
