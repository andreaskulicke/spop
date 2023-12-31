import { allStorage, selectItems, setItemPackageQuantity, setItemPackageUnit, setItemQuantity, setItemStorage, setItemUnit, setItemWanted } from './store/dataSlice';
import { Calculator } from './Calculator';
import { Item, UnitId, getPackageQuantityUnit, getUnitName, itemListStyle } from './store/data/items';
import { ItemsSectionList, ItemsSectionListSection } from './ItemsSectionList';
import { List, IconButton, Tooltip, useTheme, TouchableRipple } from 'react-native-paper';
import { RootStackParamList } from '../App';
import { Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React, { JSXElementConstructor, ReactElement, useState } from 'react';
import { getCalculatorFields } from './getCalculatorFields';
import { withSeparator } from './withSeparator';

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
        if (values) {
            if (values.length > 0) {
                const value = values[0];
                const item = value.state as Item;
                dispatch(setItemQuantity({ itemId: item.id, quantity: value.value?.toString() ?? "" }));
                dispatch(setItemUnit({ itemId: item.id, unitId: value.unitId ?? "-" }));
            }
            if (values.length > 1) {
                const value = values[1];
                const item = value.state as Item;
                dispatch(setItemPackageQuantity({ itemId: item.id, packageQuantity: value.value }));
                dispatch(setItemPackageUnit({ itemId: item.id, packageUnitId: value.unitId ?? "-" }));
            }
        }
    }

    function handleShowCalculatorPress(item: Item): void {
        setShowCalculator({
            visible: true,
            item: item,
        });
    }

    function handleRenderItem(item: Item): ReactElement<any, string | JSXElementConstructor<any>> | null {

        const description = withSeparator(
            getPackageQuantityUnit(item),
            " - ",
            item.storages
                .map(x => storages.find(s => s.id === x.storageId)?.name)
                .filter(x => !!x)
                .join(", "));


        let quantity = (item.quantity !== "0") ? item.quantity?.toString().replace(".", ",") : "";
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
                                paddingHorizontal: 8,
                            }}
                            onPress={() => handleShowCalculatorPress(item)}
                        >
                            <View style={{ alignItems: "flex-end" }}>
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
                onPress={() => navigation.navigate("Item", { id: item.id, storageId: props.storageId })}
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
            title: "Ohne Vorratsort",
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
        <View style={{ flex: 1 }}>
            <ItemsSectionList
                data={data}
                renderItem={handleRenderItem}
                selectedItemId={props.selectedItemId}
            />
            <Calculator
                fields={getCalculatorFields(showCalculator.item)}
                visible={showCalculator.visible}
                onClose={handleCalculatorClose}
            />
        </View>
    );
}
