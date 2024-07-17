import { useEffect, useState } from "react";
import { Searchbar, useTheme } from "react-native-paper";
import { units } from "./store/data/items";

export function SearchBar(props: {
    text?: string;
    onChange?: (text: string, name: string, quantity: string) => void;
    onSubmitEditing?: () => void;
}) {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState(props.text ?? "");

    function handleSearchChangeText(text: string) {
        const t = text.trimStart();
        const unitsMatch = `(${units.map((x) => x.name).join("|")})`;
        const m = t.match(
            `^(?<pre>\\d+[^ ]*)? *(?<name>.*?) *(?<post>\\d+${unitsMatch}?$)?$`,
        );
        if (m && m.groups) {
            const name =
                m.groups["name"] +
                (m.groups["pre"] && m.groups.post
                    ? ` ${m.groups["post"]}`
                    : "");
            props.onChange?.(t, name, m.groups["pre"] ?? m.groups["post"]);
        } else {
            props.onChange?.(t, t, "");
        }
        setSearchQuery(t);
    }

    useEffect(() => {
        setSearchQuery(props.text ?? "");
    }, [props.text]);

    return (
        <Searchbar
            mode="bar"
            placeholder="Will haben"
            value={searchQuery}
            style={{
                backgroundColor: theme.colors.elevation.level2,
                margin: 4,
                height: 64,
            }}
            onChangeText={handleSearchChangeText}
            onSubmitEditing={props.onSubmitEditing}
        />
    );
}
