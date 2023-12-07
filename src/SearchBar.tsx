import { useEffect, useState } from "react";
import { Searchbar, useTheme } from 'react-native-paper';

export function SearchBar(props: {
    text?: string;
    onChange?: (text: string, name: string, quantity: string) => void;
    onSubmitEditing?: () => void;
}) {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState(props.text ?? "");

    function handleSearchChangeText(text: string) {
        const t = text.trimStart();
        const m = t.match("^(?<pre>\\d+[^ ]*)? *(?<name>.*?) *(?<post>\\d+[^ ]*)? *$");
        if (m && m.groups) {
            // console.log("name='" + m.groups["name"] + "'")
            // console.log("pre='" + m.groups["pre"] + "'")
            // console.log("post='" + m.groups["post"] + "'")
            const name = m.groups["name"] + ((m.groups["pre"] && m.groups.post) ? ` ${m.groups["post"]}` : "")
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
            style={{ backgroundColor: theme.colors.elevation.level2, margin: 4 }}
            onChangeText={handleSearchChangeText}
            onSubmitEditing={props.onSubmitEditing}
        />
    );
}
