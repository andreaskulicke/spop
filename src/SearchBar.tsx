import { useEffect, useState } from "react";
import { Searchbar } from 'react-native-paper';

export function SearchBar(props: {
    text?: string;
    onChange?: (text: string, name: string, amount: string) => void;
    onSubmitEditing?: () => void;
}) {
    const [searchQuery, setSearchQuery] = useState(props.text ?? "");

    function handleSearchChangeText(text: string) {
        const t = text.trimStart();
        const m = t.match("^(?<pre>\\d+[^ ]*)? *(?<name>.*?) *(?<post>\\d+[^ ]*)? *$");
        if (m) {
            // console.log("name='" + m.groups["name"] + "'")
            // console.log("pre='" + m.groups["pre"] + "'")
            // console.log("post='" + m.groups["post"] + "'")
            const name = m.groups["name"] + ((m.groups["pre"] && m.groups.post) ? ` ${m.groups["post"]}` : "")
            props.onChange(t, name, m.groups["pre"] ?? m.groups["post"]);
        } else {
            props.onChange(t, t, "");
        }
        setSearchQuery(t);
    }

    useEffect(() => {
        setSearchQuery(props.text);
    }, [props.text]);

    return (
        <Searchbar
            mode="bar"
            placeholder="Will haben"
            style={{ margin: 8 }}
            value={searchQuery}
            onChangeText={handleSearchChangeText}
            onSubmitEditing={props.onSubmitEditing}
        />
    );
}
