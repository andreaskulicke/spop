import { clamp } from "./utils";
import { MD3Theme, useTheme } from "react-native-paper";
import { ScrollView, View, PanResponder, GestureResponderEvent, PanResponderGestureState } from "react-native";
import { useRef, useEffect, useMemo, useState } from "react";
import { useSprings, useSpring, animated } from "@react-spring/native";

const fn = (theme: MD3Theme, order: number[], heights: number[], active = false, originalIndex = 0, y = 0, immediate = false) => (index: number) => {
    if (active && (index === originalIndex)) {
        return {
            active: active,
            backgroundColor: theme.colors.elevation.level3,
            scale: 1.05,
            y: y,
            zIndex: 1,
            immediate: (key: string) => (key === 'y' || key === 'zIndex'),
        };
    }
    let otherY = 0;
    for (let i = 0; i < order.length; i++) {
        if (order[i] === index) {
            break;
        }
        otherY += heights[order[i]] ?? 0;
    }
    return {
        active: false,
        backgroundColor: theme.colors.elevation.level0,
        scale: 1,
        y: otherY,
        zIndex: 0,
        immediate: immediate,
    };
}

export interface DraggableListRenderItemInfo<T> {
    item: T;
    active: boolean;
    onDragStart: () => void;
}

export function DraggableList<T>(props: {
    items: T[],
    keyExtractor: (item: T) => React.Key;
    renderItem: (item: DraggableListRenderItemInfo<T>) => React.ReactNode;
    onReordered?: (items: T[]) => void;
    onScroll?: (offset: number) => void;
}) {
    const theme = useTheme();
    const [_r, render] = useState(false);

    /** Used for setting active in renderItem callback. */
    const [dragIndexState, setDragIndexState] = useState(-1);

    /** For getting the internal scroll offset. */
    const scrollViewRef = useRef<ScrollView>(null);
    /** The list itself, for measuring position on screen. */
    const viewRef = useRef<View>(null);
    /** To calculate individual list item heights. */
    const viewItemsLayout = useRef<{ x: number; y: number; w: number; h: number; pageX: number; pageY: number; }[]>([]);
    const viewItemsRef = useRef<(View | null)[]>([]);

    /** View screen coordinates. */
    const viewMeasure = useRef<{ pageX: number; pageY: number } | null>(null);
    /** Current dragged items index. */
    const dragIndex = useRef(-1);
    /** Height of the scroll area. */
    const scrollHeight = useRef(0);
    //** Scroll offset when dragging started. */
    const scrollOffsetY0 = useRef(0);
    /** Current scroll offset. */
    const scrollOffsetY = useRef(0);

    /** Current order while dragging. */
    const order = useRef<number[]>([]);
    /** Drag animation springs. */
    const [springs, api] = useSprings(props.items.length, fn(theme, [], []));

    /** Scroll animation spring. */
    const [_, apiScroll] = useSpring(() => ({
        p: 0,
        config: {
            round: 1,
        },
        onChange: (result) => {
            scrollViewRef.current!.scrollTo({ y: result.value.p, animated: false });
        },
    }));

    const panBind = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState): boolean => {
            return (dragIndex.current != -1);
        },
        onMoveShouldSetPanResponder: (e, gestureState): boolean => {
            return (dragIndex.current != -1);
        },
        onPanResponderGrant: (e, gestureState) => {
            // View might have been scrolled on screen, update pageY location
            viewRef.current?.measure((x, y, w, h, pageX, pageY) => {
                // console.log("measure: x=" + x + ", y=" + y + ", w=" + w + ", h=" + h + ", pageX=" + pageX + ", pageY=" + pageY)
                viewMeasure.current = { pageX, pageY };
            });
            viewRef.current?.measureInWindow((x, y, w, h) => {
                // console.log("measureInWindow: x=" + x + ", y=" + y + ", w=" + w + ", h=" + h)
            });
        },
        onPanResponderMove: (e, gestureState) => {
            if (dragIndex.current != -1) {
                move(true, e, gestureState);
                const scrollTriggerOffset = 40;
                if (gestureState.moveY > (viewMeasure.current!.pageY + scrollHeight.current - scrollTriggerOffset)) {
                    // Scroll down
                    apiScroll.start({ p: scrollOffsetY.current + (scrollTriggerOffset * 2) });
                    // props.onScroll?.(scrollTriggerOffset * 2);
                } else if (gestureState.moveY < (viewMeasure.current!.pageY + scrollTriggerOffset)) {
                    // Scroll up
                    apiScroll.start({ p: scrollOffsetY.current - (scrollTriggerOffset * 2) });
                    // props.onScroll?.(-(scrollTriggerOffset * 2));
                }
                // console.log("viewMeasure.current!.pageY=" + viewMeasure.current!.pageY)
                // console.log("scrollHeight.current=" + scrollHeight.current)
                // const visibleTopY = Math.max(100, viewMeasure.current!.pageY);
                // const visibleBottomY = Math.min(680, scrollHeight.current === 0 ? 680 : viewMeasure.current!.pageY + scrollHeight.current);
                // if (gestureState.moveY > (visibleBottomY - scrollTriggerOffset)) {
                //     // Scroll down
                //     apiScroll.start({ p: scrollOffsetY.current + (scrollTriggerOffset * 2) });
                //     props.onScroll?.(scrollTriggerOffset * 2);
                // } else if (gestureState.moveY < (visibleTopY + scrollTriggerOffset)) {
                //     // Scroll up
                //     apiScroll.start({ p: scrollOffsetY.current - (scrollTriggerOffset * 2) });
                //     props.onScroll?.(-(scrollTriggerOffset * 2));
                // }
            }
        },
        onPanResponderTerminate: (e, gestureState) => {
        },
        onPanResponderEnd: (e, gestureState) => {
            move(false, e, gestureState);
        },
        onPanResponderRelease: (e, gestureState) => {
        },
    }), [props.items]);

    function move(active: boolean, e: GestureResponderEvent, gestureState: PanResponderGestureState) {
        const { moveY, dy, y0 } = gestureState;

        const originalPosition = order.current.findIndex(x => x === dragIndex.current);
        const scrollOffsetDY = scrollOffsetY.current - scrollOffsetY0.current;

        let currentPosition = -1;
        let offset = viewMeasure.current!.pageY - scrollOffsetDY;
        let offsetInItem = 0;
        for (let i = 0; i < viewItemsLayout.current.length; i++) {
            const element = viewItemsLayout.current[i];
            if ((offset < moveY) && (moveY < (offset + element.h))) {
                currentPosition = i;
            }
            if ((offset < y0) && (y0 < (offset + (element?.h ?? 0)))) {
                offsetInItem = y0 - offset;
            }
            offset += element?.h ?? 0;
        }
        currentPosition = clamp(currentPosition, 0, viewItemsLayout.current.length - 1);

        const newOrder = [...order.current];
        if (originalPosition !== currentPosition) {
            const i = newOrder[originalPosition];
            newOrder.splice(originalPosition, 1);
            newOrder.splice(currentPosition, 0, i);
        }

        const offsetMoveFromTop = moveY - viewMeasure.current!.pageY + scrollOffsetDY - offsetInItem;

        // console.log("moveY=" + moveY + ", dy=" + dy + ", y0=" + y0);
        // console.log("originalPosition=" + originalPosition + ", currentPosition=" + currentPosition);
        // console.log("offsetMoveFromTop=" + offsetMoveFromTop);

        api.start(fn(theme, newOrder, viewItemsLayout.current.map(x => x.h), active, order.current[originalPosition], offsetMoveFromTop));

        if (!active) {
            order.current = newOrder
            dragIndex.current = -1;
            setDragIndexState(-1);

            if (props.onReordered) {
                const newItems: T[] = [];
                const newLayout: any[] = [];
                for (const index of order.current) {
                    newItems.push(props.items[index]);
                    newLayout.push(viewItemsLayout.current[index]);
                }
                // Layout must be swapper immediatly, otherwise updating incorrectly with different heights
                viewItemsLayout.current = newLayout;
                // Give the drop animation time to finish
                setTimeout(() => {
                    props.onReordered?.(newItems);
                }, 500);
            }
        }
    }

    function handleDragStart(index: number): void {
        dragIndex.current = index;
        scrollOffsetY0.current = scrollOffsetY.current;
        setDragIndexState(index);
    }

    function measureViewItems(): void {
        for (let i = 0; i < viewItemsRef.current.length; i++) {
            viewItemsRef.current[i]?.measure((x, y, w, h, pageX, pageY) => {
                console.log("measure: x=" + x + ", y=" + y + ", w=" + w + ", h=" + h + ", pageX=" + pageX + ", pageY=" + pageY)
                viewItemsLayout.current[i] = { x, y, w, h, pageX, pageY };
            });
        }
        // TODO: move to measure call, long lists might take longer than 500ms, reset timer
        setTimeout(() => {
            // Re-render once to update height of parent container
            render(x => !x);
            // Layout elements as heights are known now
            api.start(fn(theme, order.current, viewItemsLayout.current.map(x => x?.h), false, undefined, undefined, true));
        }, 500);
    }

    useEffect(() => {
        console.log(props.items)
        viewItemsRef.current = viewItemsRef.current.slice(0, props.items.length);
        viewItemsLayout.current = viewItemsLayout.current.slice(0, props.items.length);
        order.current = props.items.map((_, index) => index);
        // Must be called immediately, otherwise swapping dragged elements
        api.start(fn(theme, order.current, viewItemsLayout.current.map(x => x?.h), false, undefined, undefined, true));
        // Update measures
        measureViewItems();
    }, [props.items]);

    return (
        <ScrollView
            ref={scrollViewRef}
            onScroll={e => {
                scrollHeight.current = e.nativeEvent.layoutMeasurement.height;
                scrollOffsetY.current = e.nativeEvent.contentOffset.y;
                // console.log("onScroll: scrollHeight.current=" + scrollHeight.current + ", scrollOffsetY.current=" + scrollOffsetY.current)
            }}
            onLayout={e => {
                // Make sure to get the scroll height
                scrollViewRef.current!.scrollTo({ y: 1, animated: false });
                scrollViewRef.current!.scrollTo({ y: 0, animated: false });
            }}
        >
            <View
                ref={viewRef}
                style={{
                    height: viewItemsLayout.current.reduce((previous, current) => previous + (current?.h ?? 0), 0),
                    position: "relative",
                }}
                onLayout={e => {
                    viewRef.current?.measure((x, y, w, h, pageX, pageY) => {
                        // console.log("measure: x=" + x + ", y=" + y + ", w=" + w + ", h=" + h + ", pageX=" + pageX + ", pageY=" + pageY)
                        viewMeasure.current = { pageX, pageY };
                    });
                }}
            >
                {
                    springs.map((s, i) => (
                        <animated.View
                            {...panBind.panHandlers}
                            key={props.keyExtractor(props.items[i])}
                            style={{
                                backgroundColor: s.backgroundColor,
                                position: "absolute",
                                top: s.y,
                                transform: [{ scale: s.scale }],
                                width: "100%",
                                zIndex: s.zIndex,
                            }}
                        >
                            <View
                                ref={x => viewItemsRef.current[i] = x}
                                onLayout={() => {
                                    // Measure must be called from here, not relyable from useEffect()
                                    measureViewItems();
                                }}
                            >
                                {
                                    props.renderItem({
                                        item: props.items[i],
                                        active: (dragIndexState === i),
                                        onDragStart: () => handleDragStart(i),
                                    })
                                }
                            </View>
                        </animated.View>
                    ))
                }
            </View>
        </ScrollView>
    );
}
