import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Snackbar } from "react-native-paper";
import { ActionCreators } from "redux-undo";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { selectUiShowUndo, setUiShowUndo } from "./store/uiSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function UndoSnackBar(props: {
    contextName: string;
    insetOffset?: boolean;
}) {
    const navigation = useNavigation();
    const showUndo = useAppSelector(selectUiShowUndo);
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();

    function handleDismissSnackBar(): void {
        // console.log(props.contextName + ": dismissing");
        dispatch(setUiShowUndo(false));
    }

    function handlePressUndo(): void {
        dispatch(ActionCreators.undo());
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
            visible={showUndo}
            onDismiss={handleDismissSnackBar}
        >
            Wieder rückgängig machen?
        </Snackbar>
    );
}
