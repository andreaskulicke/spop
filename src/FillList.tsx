import { allStorage, selectItems, setItemQuantity, setItemStorage, setItemUnit, setItemWanted } from './store/dataSlice';
import { Calculator } from './Calculator';
import { Item, UnitId, getUnitName, itemListStyle } from './store/data/items';
import { ItemsSectionList, ItemsSectionListSection } from './ItemsSectionList';
import { List, IconButton, Tooltip, useTheme, TouchableRipple } from 'react-native-paper';
import { RootStackParamList } from '../App';
import { Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React, { JSXElementConstructor, ReactElement, useState } from 'react';

export function FillList(props: {
    storageId: string;
    selectedItemId?: string;
}) {
    const items = useAppSelector(selectItems);
    const storages = useAppSelector(state => state.data.storages);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [showCalculator, setShowCalculator] = useState<{
        visible: boolean;
        item?: Item;
    }>({ visible: false });

    const itemsForThisStorage = items.filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && x.wanted);
    const unassigned = items
        .filter(x => (x.storages.length === 0) && x.wanted);
    const recentlyUsed = items
        .filter(x => ((props.storageId === allStorage.id) || x.storages.find(x => x.storageId === props.storageId)) && !x.wanted);

    function handleCalculatorClose(values?: { value?: number; unitId?: UnitId, state?: any; }[] | undefined): void {
        setShowCalculator({ visible: false });
        if (values && values.length > 0) {
            const item = values[0].state as Item;
            dispatch(setItemQuantity({ itemId: item.id, quantity: values[0].value?.toString() ?? "" }));
            dispatch(setItemUnit({ itemId: item.id, unitId: values[0].unitId ?? "-" }));
        }
    }

    function handleShowCalculatorPress(item: Item): void {
        setShowCalculator({
            visible: true,
            item: item,
        });
    }

    function handleRenderItem(item: Item): ReactElement<any, string | JSXElementConstructor<any>> | null {

        let description = "";
        if (props.storageId !== allStorage.id) {
            description = item.storages
                .map(x => storages.find(s => s.id === x.storageId)?.name)
                .filter(x => !!x)
                .join(", ");
        }


        let quantity = (item.quantity !== "0") ? item.quantity : "";
        if (quantity && item.unitId) {
            quantity += ` ${getUnitName(item.unitId)}`;
        }

        return (
            <List.Item
                description={description ? description : undefined}
                title={item.name}
                style={itemListStyle(theme)}
                right={p =>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                        <TouchableRipple
                            style={{
                                justifyContent: "center",
                                minHeight: 40,
                                minWidth: 64,
                                paddingHorizontal: 4,
                            }}
                            onPress={() => handleShowCalculatorPress(item)}
                        >
                            <View style={{ alignItems: "center" }}>
                                <Text style={{ color: theme.colors.primary }}>
                                    {quantity}
                                </Text>
                            </View>
                        </TouchableRipple>
                        <IconButton
                            {...p}
                            icon={item.wanted ? "minus-thick" : "plus-outline"}
                            onPress={() => dispatch(setItemWanted({ itemId: item.id, wanted: !item.wanted }))}
                        />
                        {
                            (props.storageId !== allStorage.id) && (item.storages.length === 0)
                            && <Tooltip title="Zum Storage hinzufügen">
                                <IconButton
                                    {...p}
                                    icon="home-plus-outline"
                                    onPress={() => dispatch(setItemStorage({ itemId: item.id, storageId: props.storageId, checked: true }))}
                                />
                            </Tooltip>
                        }
                    </View>
                }
                onPress={() => navigation.navigate("Item", { id: item.id })}
            />
        );
    }

    const data: ItemsSectionListSection[] = [
        {
            title: "Dinge",
            icon: "cart",
            data: itemsForThisStorage,
        },
        {
            title: "Ohne Storage",
            icon: "home-remove-outline",
            data: unassigned,
        },
        {
            title: "Zuletzt verwendet",
            icon: "history",
            data: recentlyUsed,
        },
    ];

    return (
        <View>
            <ItemsSectionList
                data={data}
                renderItem={handleRenderItem}
                selectedItemId={props.selectedItemId}
            />
            <Calculator
                fields={[
                    {
                        title: "Menge",
                        value: parseFloat(showCalculator.item?.quantity ?? "0"),
                        unitId: showCalculator.item?.unitId,
                        state: showCalculator.item,
                    }
                ]}
                visible={showCalculator.visible}
                onClose={handleCalculatorClose}
            />
        </View>
    );
}
