import { Portal, useTheme, Modal, Button, TextInput, Divider } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { UnitId, getUnitName } from './store/data/items';
import React, { useEffect, useState } from 'react';

export function Calculator(props: {
    fields: {
        title: string;
        value?: number;
        unitId?: UnitId;
        state?: any;
        selected?: boolean;
    }[];
    visible: boolean;
    onClose: (values?: { value?: number; unitId?: UnitId; state?: any }[]) => void;
}) {
    const [selectedField, setSelectedField] = useState(-1);
    const [values, setValues] = useState<{ value: string; unitId?: UnitId, state?: any }[]>(props.fields
        ?.filter(x => !!x)
        .map(x => ({
            value: x.value?.toString().replace(".", ",") ?? "",
            unitId: x.unitId,
            state: x.state,
        })) ?? []);
    const [operation, setOperation] = useState<"+" | "-" | "*" | "/">();
    const theme = useTheme();

    function evaluateCalculateOperation(value: string): [boolean, string] {
        if (value) {
            const valueTmp = new Function(`"use strict";return (${value.replaceAll(",", ".")}).toFixed(2);`)();
            return [true, valueTmp];
        }
        return [false, value];
    }

    function handleButtonPress(enteredValue: number | string): void {
        let valueTmp = values[selectedField].value;
        let unitIdTmp = values[selectedField].unitId;

        if (typeof enteredValue === "string") {
            switch (enteredValue) {
                case "AC":
                    valueTmp = "";
                    unitIdTmp = undefined;
                    setOperation(undefined);
                    break;
                case "<":
                    valueTmp = valueTmp.substring(0, valueTmp.length - 1);
                    break;
                case "pkg":
                    unitIdTmp = "pkg";
                    break;
                case "ml":
                    unitIdTmp = "ml";
                    break;
                case "l":
                    unitIdTmp = "l";
                    break;
                case "g":
                    unitIdTmp = "g";
                    break;
                case "kg":
                    unitIdTmp = "kg";
                    break;
                case "/":
                    if (evaluateOperation()) {
                        setOperation("/");
                    }
                    break;
                case "*":
                    if (evaluateOperation()) {
                        setOperation("*");
                    }
                    break;
                case "-":
                    if (evaluateOperation()) {
                        setOperation("-");
                    }
                    break;
                case "+":
                    if (evaluateOperation()) {
                        setOperation("+");
                    }
                    break;
                case "%":
                    if (evaluateOperation()) {
                        valueTmp = (parseFloat(valueTmp.replace(",", ".")) / 100).toFixed(2).toString();
                    }
                    break;
                case ".":
                    const lastIndexOfOp = Math.max(valueTmp.lastIndexOf("/"), valueTmp.lastIndexOf("*"), valueTmp.lastIndexOf("+"), valueTmp.lastIndexOf("-"));
                    if (lastIndexOfOp !== -1) {
                        valueTmp = valueTmp.substring(0, lastIndexOfOp + 1) + valueTmp.substring(lastIndexOfOp + 1).replace(",", "");
                    } else {
                        valueTmp = valueTmp.replace(",", "");
                    }
                    valueTmp = (valueTmp ? valueTmp : "0") + ",";
                    break;
                case "=":
                    evaluateOperation();
                    break;
            }
        } else {
            if (operation) {
                valueTmp = `${valueTmp} ${operation} ${enteredValue}`;
                setOperation(undefined);
            } else {
                valueTmp = valueTmp + enteredValue;
            }
        }

        // Make sure it is a string
        valueTmp = valueTmp.toString().replace(".", ",");
        // Remove leading '0's
        valueTmp = valueTmp.replace(/^0+(\d+.*)/, "$1");
        // Remove trailing `0`s
        valueTmp = valueTmp.replace(",00", "");
        // No negative numbers
        if (parseFloat(valueTmp) < 0) {
            valueTmp = "0";
        }

        // Toggle unit
        unitIdTmp = (enteredValue === values[selectedField].unitId) ? undefined : unitIdTmp;

        const valuesTmp = [...values];
        valuesTmp[selectedField] = { ...valuesTmp[selectedField], value: valueTmp, unitId: unitIdTmp };
        setValues(valuesTmp);

        function evaluateOperation(): boolean {
            const v = evaluateCalculateOperation(valueTmp);
            valueTmp = v[1];
            return v[0];
        }
    }

    function handleOkClose(): void {
        const valueTmp = evaluateCalculateOperation(values[selectedField].value)[1];
        const valuesTmp = [...values];
        valuesTmp[selectedField] = { ...valuesTmp[selectedField], value: valueTmp };

        const vs = valuesTmp.map(x => {
            const v = parseFloat(x.value.replace(",", "."));
            return (
                {
                    value: Number.isNaN(v) ? undefined : ((v > 0) ? v : undefined),
                    unitId: x.unitId ?? "-",
                    state: x.state,
                }
            );
        });
        props.onClose(vs);
    }

    useEffect(() => {
        const sf = props.fields?.filter(x => !!x).findIndex(x => x.selected) ?? -1;
        setSelectedField((sf === -1) ? 0 : sf);

        setValues(props.fields
            ?.filter(x => !!x)
            .map(x => ({
                value: Number.isNaN(x.value) ? "" : x.value?.toString().replace(".", ",") ?? "",
                unitId: x.unitId,
                state: x.state,
            })) ?? []);
    }, [props.fields]);

    return (
        <Portal>
            <Modal
                visible={props.visible ?? false}
                contentContainerStyle={{
                    alignSelf: "center",
                    padding: 16,
                    minWidth: 360,
                    maxWidth: 400,
                }}
                onDismiss={props.onClose}
            >
                <View
                    style={{
                        backgroundColor: theme.colors.background,
                        paddingVertical: 24,
                    }}
                >
                    {
                        props.fields
                            ?.filter(x => !!x)
                            .map((field, i) => {
                                let displayValue = values[i]?.value;
                                if (operation) {
                                    displayValue += ` ${operation}`;
                                }
                                if (values[i]?.unitId) {
                                    displayValue += ` ${getUnitName(values[i]?.unitId)}`;
                                }
                                return (
                                    <View
                                        key={field.title}
                                        style={{
                                            borderColor: (selectedField === i) ? theme.colors.outline : theme.colors.background,
                                            borderWidth: 2,
                                            marginHorizontal: 24,
                                            marginBottom: 8,
                                            padding: 2,
                                        }}
                                    >
                                        <TouchableWithoutFeedback
                                            onPress={() => setSelectedField(i)}
                                        >
                                            <View pointerEvents="none">
                                                <TextInput
                                                    editable={false}
                                                    label={field.title}
                                                    selectTextOnFocus
                                                    textAlign="right"
                                                    value={displayValue}
                                                    style={{
                                                        textAlign: "right",
                                                    }} />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                );
                            })
                    }
                    <View style={style.row}>
                        <UnitButton activeUnitId={values[selectedField]?.unitId} unitId="pkg" onPress={unitId => handleButtonPress(unitId)} />
                        <Button mode="text" compact style={style.col4}>{""}</Button>
                        <Button mode="outlined" compact style={style.col4} onPress={() => handleButtonPress("<")}>{"<"}</Button>
                        <Button mode="contained-tonal" compact style={style.col4} onPress={() => handleButtonPress("AC")}>AC</Button>
                    </View>
                    <View style={style.row}>
                        <UnitButton activeUnitId={values[selectedField]?.unitId} unitId="ml" onPress={unitId => handleButtonPress(unitId)} />
                        <UnitButton activeUnitId={values[selectedField]?.unitId} unitId="l" onPress={unitId => handleButtonPress(unitId)} />
                        <UnitButton activeUnitId={values[selectedField]?.unitId} unitId="g" onPress={unitId => handleButtonPress(unitId)} />
                        <UnitButton activeUnitId={values[selectedField]?.unitId} unitId="kg" onPress={unitId => handleButtonPress(unitId)} />
                    </View>
                    <Divider bold horizontalInset style={{ marginVertical: 4 }} />
                    <View style={style.row}>
                        <Button mode="outlined" onPress={() => handleButtonPress(7)}>7</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(8)}>8</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(9)}>9</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress("/")}>/</Button>
                    </View>
                    <View style={style.row}>
                        <Button mode="outlined" onPress={() => handleButtonPress(4)}>4</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(5)}>5</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(6)}>6</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress("*")}>*</Button>
                    </View>
                    <View style={style.row}>
                        <Button mode="outlined" onPress={() => handleButtonPress(1)}>1</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(2)}>2</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(3)}>3</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress("-")}>-</Button>
                    </View>
                    <View style={style.row}>
                        <Button mode="outlined" onPress={() => handleButtonPress("%")}>%</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(0)}>0</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress(".")}>,</Button>
                        <Button mode="outlined" onPress={() => handleButtonPress("+")}>+</Button>
                    </View>
                    <View style={style.row}>
                        <Button mode="contained-tonal" style={style.actionButton} onPress={() => props.onClose()}>Abbrechen</Button>
                        <Button mode="contained" style={style.actionButton} onPress={handleOkClose}>OK</Button>
                        <Button mode="contained" style={style.actionButton} onPress={() => handleButtonPress("=")}>=</Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}

function UnitButton(props: {
    activeUnitId?: UnitId;
    unitId: UnitId;
    onPress: (unitId: UnitId, unitName: string) => void;
}) {
    const unitName = getUnitName(props.unitId);

    return (
        <Button
            mode={(props.unitId === props.activeUnitId) ? "contained" : "outlined"}
            compact
            style={style.col4}
            onPress={() => props.onPress(props.unitId, unitName)}
        >
            {unitName}
        </Button>
    );
}

const style = StyleSheet.create({
    "actionButton": {
        marginTop: 8,
        width: "30%",
    },
    "row": {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        marginVertical: 8,
        marginHorizontal: 16
    },
    "col4": {
        width: 68,
    },
})
