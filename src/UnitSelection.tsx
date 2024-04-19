import { Menu, TextInput, TouchableRipple } from "react-native-paper";
import { UnitId, getUnitName, units } from "./store/data/items";
import React, { useState } from "react";

export function UnitSelection(props: {
    itemId: string;
    value: UnitId | undefined;
    onValueChange: (itemId: string, unitId: UnitId) => void;
}) {
    const [menuVisible, setMenuVisible] = useState(false);

    function handlePress(unitId: UnitId): void {
        props.onValueChange(props.itemId, unitId);
        setMenuVisible(false);
    }

    return (
        <Menu
            anchor={
                <TouchableRipple onPress={() => setMenuVisible(true)}>
                    <TextInput
                        editable={false}
                        label="Einheit"
                        mode="outlined"
                        style={{ marginRight: 8, marginVertical: 8, width: 80 }}
                        value={getUnitName(props.value, true)}
                        right={
                            <TextInput.Icon
                                icon={
                                    menuVisible ? "chevron-up" : "chevron-down"
                                }
                                onPress={() => setMenuVisible(true)}
                            />
                        }
                    />
                </TouchableRipple>
            }
            anchorPosition="bottom"
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
        >
            {units.map((u) => (
                <Menu.Item
                    key={u.id}
                    title={u.name}
                    onPress={() => handlePress(u.id)}
                />
            ))}
        </Menu>
    );
}
