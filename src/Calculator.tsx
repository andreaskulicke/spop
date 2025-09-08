import { modalContainerStyle, modalViewStyle } from "./styles";
import { numberToString } from "./numberToString";
import {
    Portal,
    useTheme,
    Modal,
    Button,
    TextInput,
    Divider,
} from "react-native-paper";
import { Pressable, StyleSheet, View } from "react-native";
import { Unit, UnitId, getUnit, getUnitName, units } from "./store/data/items";
import React, { useEffect, useRef, useState } from "react";

Array.prototype.with = function <T>(index: number, value: T): T[] {
    const a = [...this];
    a[index] = value;
    return a;
};

export interface CalculatorField {
    title: string;
    value?: number;
    unitId?: UnitId;
    /** Default: "quantity" */
    type?: "quantity" | "price";
    state?: any;
    selected?: boolean;
}

export function Calculator(props: {
    fields: CalculatorField[];
    visible: boolean;
    onClose: (
        values?: { value?: number; unitId?: UnitId; state?: any }[],
    ) => void;
}) {
    const [selectedField, setSelectedField] = useState<{
        index: number;
        clearOnInput?: boolean;
    }>({ index: 0, clearOnInput: true });
    const [values, setValues] = useState<
        { value: string; unitId?: UnitId; state?: any }[]
    >(
        props.fields
            ?.filter((x) => !!x)
            .map((x) => ({
                value: numberToString(x.value),
                unitId: x.unitId,
                state: x.state,
            })) ?? [],
    );
    const [operation, setOperation] = useState<
        ("+" | "-" | "*" | "/" | undefined)[]
    >(Array(3));

    const textInputRef1 = useRef(undefined);
    const textInputRef2 = useRef(undefined);
    const textInputRef3 = useRef(undefined);
    const textInputRefs = [textInputRef1, textInputRef2, textInputRef3];

    const theme = useTheme();

    function evaluateCalculateOperation(value: string): [boolean, string] {
        if (value) {
            const valueTmp = new Function(
                `"use strict";return (${value.replaceAll(",", ".")}).toFixed(2);`,
            )();
            return [true, valueTmp];
        }
        return [false, value];
    }

    function getActiveUnitId(): UnitId | undefined {
        if (props.fields[selectedField.index]?.type === "price") {
            if (props.fields.length <= 2) {
                return values[Math.abs(selectedField.index - 1)]?.unitId;
            }
        } else {
            return values[selectedField.index]?.unitId;
        }
    }

    function getOrignialUnitId(): UnitId | undefined {
        if (props.fields[selectedField.index]?.type === "price") {
            if (props.fields.length <= 2) {
                return props.fields[Math.abs(selectedField.index - 1)]?.unitId;
            }
        } else {
            return props.fields.find((x) => getUnit(x.unitId).id !== "-")
                ?.unitId;
        }
    }

    function handleButtonPress(enteredValue: number | string): void {
        let valueTmp = values[selectedField.index].value;
        let unitIdTmp = values[selectedField.index].unitId;
        let operationTmp = operation[selectedField.index];

        if (
            selectedField.clearOnInput &&
            !units.find((x) => x.id === enteredValue) &&
            enteredValue !== "="
        ) {
            valueTmp = "";
            setSelectedField((v) => ({ ...v, clearOnInput: false }));
            operationTmp = undefined;
            setOperation((v) => v.with(selectedField.index, undefined));
        }
        if (typeof enteredValue === "string") {
            switch (enteredValue) {
                case "AC":
                    valueTmp = "";
                    unitIdTmp = undefined;
                    setOperation((v) => v.with(selectedField.index, undefined));
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
                        setOperation((v) => v.with(selectedField.index, "/"));
                    }
                    break;
                case "*":
                    if (evaluateOperation()) {
                        setOperation((v) => v.with(selectedField.index, "*"));
                    }
                    break;
                case "-":
                    if (evaluateOperation()) {
                        setOperation((v) => v.with(selectedField.index, "-"));
                    }
                    break;
                case "+":
                    if (evaluateOperation()) {
                        setOperation((v) => v.with(selectedField.index, "+"));
                    }
                    break;
                case "%":
                    if (evaluateOperation()) {
                        valueTmp = (
                            parseFloat(valueTmp.replace(",", ".")) / 100
                        )
                            .toFixed(2)
                            .toString();
                    }
                    break;
                case ".":
                    const lastIndexOfOp = Math.max(
                        valueTmp.lastIndexOf("/"),
                        valueTmp.lastIndexOf("*"),
                        valueTmp.lastIndexOf("+"),
                        valueTmp.lastIndexOf("-"),
                    );
                    if (lastIndexOfOp !== -1) {
                        valueTmp =
                            valueTmp.substring(0, lastIndexOfOp + 1) +
                            valueTmp
                                .substring(lastIndexOfOp + 1)
                                .replace(",", "");
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
            if (operationTmp) {
                valueTmp = `${valueTmp} ${operationTmp} ${enteredValue}`;
                setOperation((v) => v.with(selectedField.index, undefined));
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
        unitIdTmp =
            enteredValue === values[selectedField.index].unitId
                ? undefined
                : unitIdTmp;

        const valuesTmp = [...values];
        valuesTmp[selectedField.index] = {
            ...valuesTmp[selectedField.index],
            value: valueTmp,
            unitId: undefined,
        };
        if (props.fields[selectedField.index]?.type === "price") {
            for (let i = 0; i < props.fields.length; i++) {
                if (i != selectedField.index) {
                    valuesTmp[i].unitId = unitIdTmp;
                }
            }
        } else {
            valuesTmp[selectedField.index].unitId = unitIdTmp;
        }
        setValues(valuesTmp);

        function evaluateOperation(): boolean {
            const v = evaluateCalculateOperation(valueTmp);
            valueTmp = v[1];
            return v[0];
        }
    }

    function handleOkClose(): void {
        const valueTmp = evaluateCalculateOperation(
            values[selectedField.index].value,
        )[1];
        const valuesTmp = [...values];
        valuesTmp[selectedField.index] = {
            ...valuesTmp[selectedField.index],
            value: valueTmp,
        };

        const vs = valuesTmp.map((x) => {
            const v = parseFloat(x.value.replace(",", "."));
            return {
                value: Number.isNaN(v) ? undefined : v > 0 ? v : undefined,
                unitId: x.unitId ?? "-",
                state: x.state,
            };
        });
        props.onClose(vs);
    }

    useEffect(() => {
        const sf =
            props.fields?.filter((x) => !!x).findIndex((x) => x.selected) ?? -1;
        setSelectedField((v) => ({
            index: sf === -1 ? 0 : sf,
            clearOnInput: true,
        }));

        setOperation(Array(3));

        setValues(
            props.fields
                ?.filter((x) => !!x)
                .map((x) => ({
                    value: numberToString(x.value),
                    unitId: x.unitId,
                    state: x.state,
                })) ?? [],
        );
    }, [props.fields]);

    useEffect(() => {
        (textInputRefs[selectedField.index]?.current as any)?.focus();
    });

    const tooManyFieldsForPriceUnit =
        props.fields[selectedField.index]?.type === "price" &&
        props.fields.length > 2;

    const forceUnitsEnabled =
        !tooManyFieldsForPriceUnit &&
        (props.fields.length === 1 ||
            !props.fields.find((x) => getUnit(x.unitId).base !== "-"));

    const activeUnit = getUnit(getActiveUnitId());
    const originalUnit = getUnit(getOrignialUnitId());

    return (
        <Portal>
            <Modal
                visible={props.visible}
                contentContainerStyle={modalContainerStyle()}
                onDismiss={props.onClose}
            >
                <View style={modalViewStyle(theme)}>
                    {props.fields
                        ?.filter((x) => !!x)
                        .map((field, i) => {
                            let displayValue = values[i]?.value;
                            if (operation[i]) {
                                displayValue += ` ${operation[i]}`;
                            }
                            return (
                                <View
                                    key={field.title}
                                    style={{
                                        borderColor:
                                            selectedField.index === i
                                                ? theme.colors.outline
                                                : theme.colors.background,
                                        borderWidth: 2,
                                        marginHorizontal: 8,
                                        padding: 2,
                                    }}
                                >
                                    <Pressable
                                        onPress={() =>
                                            setSelectedField((v) => ({
                                                index: i,
                                                clearOnInput: true,
                                            }))
                                        }
                                    >
                                        <View pointerEvents="none">
                                            <TextInput
                                                cursorColor={
                                                    theme.colors.outlineVariant
                                                }
                                                editable
                                                inputMode="none"
                                                label={field.title}
                                                ref={(r: any) =>
                                                    (textInputRefs[i].current =
                                                        r)
                                                }
                                                selection={{
                                                    start: 0,
                                                    end:
                                                        selectedField.index ===
                                                            i &&
                                                        selectedField.clearOnInput
                                                            ? displayValue.length
                                                            : 0,
                                                }}
                                                textAlign="right"
                                                value={displayValue}
                                                style={{
                                                    textAlign: "right",
                                                }}
                                                right={
                                                    <TextInput.Affix
                                                        text={
                                                            values[i]?.unitId &&
                                                            values[i]
                                                                ?.unitId !== "-"
                                                                ? ` ${props.fields[i].type === "price" ? "€/" : ""}${getUnitName(values[i]?.unitId)}`
                                                                : props.fields[
                                                                        i
                                                                    ].type ===
                                                                    "price"
                                                                  ? " €"
                                                                  : " "
                                                        }
                                                    />
                                                }
                                            />
                                        </View>
                                    </Pressable>
                                </View>
                            );
                        })}
                    <View style={style.row}>
                        <UnitButton
                            activeUnit={activeUnit}
                            disabled={tooManyFieldsForPriceUnit}
                            forceEnabled={
                                props.fields[selectedField.index]?.type ===
                                "quantity"
                            }
                            originalUnit={originalUnit}
                            unitId="pkg"
                            onPress={(unitId) => handleButtonPress(unitId)}
                        />
                        <Button mode="text" compact style={style.col4}>
                            {""}
                        </Button>
                        <Button
                            mode="outlined"
                            compact
                            style={style.col4}
                            onPress={() => handleButtonPress("<")}
                        >
                            {"<"}
                        </Button>
                        <Button
                            mode="contained-tonal"
                            compact
                            style={style.col4}
                            onPress={() => handleButtonPress("AC")}
                        >
                            AC
                        </Button>
                    </View>
                    <View style={style.row}>
                        <UnitButton
                            activeUnit={activeUnit}
                            disabled={tooManyFieldsForPriceUnit}
                            forceEnabled={forceUnitsEnabled}
                            originalUnit={originalUnit}
                            unitId="ml"
                            onPress={(unitId) => handleButtonPress(unitId)}
                        />
                        <UnitButton
                            activeUnit={activeUnit}
                            disabled={tooManyFieldsForPriceUnit}
                            forceEnabled={forceUnitsEnabled}
                            originalUnit={originalUnit}
                            unitId="l"
                            onPress={(unitId) => handleButtonPress(unitId)}
                        />
                        <UnitButton
                            activeUnit={activeUnit}
                            disabled={tooManyFieldsForPriceUnit}
                            forceEnabled={forceUnitsEnabled}
                            originalUnit={originalUnit}
                            unitId="g"
                            onPress={(unitId) => handleButtonPress(unitId)}
                        />
                        <UnitButton
                            activeUnit={activeUnit}
                            disabled={tooManyFieldsForPriceUnit}
                            forceEnabled={forceUnitsEnabled}
                            originalUnit={originalUnit}
                            unitId="kg"
                            onPress={(unitId) => handleButtonPress(unitId)}
                        />
                    </View>
                    <Divider
                        bold
                        horizontalInset
                        style={{ marginVertical: 4 }}
                    />
                    <View style={style.row}>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(7)}
                        >
                            7
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(8)}
                        >
                            8
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(9)}
                        >
                            9
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress("/")}
                        >
                            /
                        </Button>
                    </View>
                    <View style={style.row}>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(4)}
                        >
                            4
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(5)}
                        >
                            5
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(6)}
                        >
                            6
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress("*")}
                        >
                            *
                        </Button>
                    </View>
                    <View style={style.row}>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(1)}
                        >
                            1
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(2)}
                        >
                            2
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(3)}
                        >
                            3
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress("-")}
                        >
                            -
                        </Button>
                    </View>
                    <View style={style.row}>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress("%")}
                        >
                            %
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(0)}
                        >
                            0
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress(".")}
                        >
                            ,
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={() => handleButtonPress("+")}
                        >
                            +
                        </Button>
                    </View>
                    <View style={style.row}>
                        <Button
                            mode="contained-tonal"
                            style={style.actionButton}
                            onPress={() => props.onClose()}
                        >
                            Abbrechen
                        </Button>
                        <Button
                            mode="contained"
                            style={style.actionButton}
                            onPress={handleOkClose}
                        >
                            OK
                        </Button>
                        <Button
                            mode="contained"
                            style={style.actionButton}
                            onPress={() => handleButtonPress("=")}
                        >
                            =
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}

function UnitButton(props: {
    activeUnit?: Unit;
    disabled: boolean;
    forceEnabled: boolean;
    originalUnit: Unit;
    unitId: UnitId;
    onPress: (unitId: UnitId, unitName: string) => void;
}) {
    const unitName = getUnitName(props.unitId);
    const unit = getUnit(props.unitId);

    const disabled =
        !props.forceEnabled &&
        (props.disabled ||
            (props.activeUnit
                ? unit.group !== props.originalUnit?.group
                : false));

    return (
        <Button
            mode={
                props.unitId === props.activeUnit?.id ? "contained" : "outlined"
            }
            compact
            disabled={disabled}
            style={style.col4}
            onPress={() => props.onPress(props.unitId, unitName)}
        >
            {unitName}
        </Button>
    );
}

const style = StyleSheet.create({
    actionButton: {
        marginTop: 8,
        width: "30%",
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    col4: {
        width: 68,
    },
});
