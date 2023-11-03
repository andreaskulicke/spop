import { useEffect, useState } from "react";
import { Searchbar } from 'react-native-paper';

export interface SearchBarProps {
    text?: string;
    onChange?: (text: string) => void;
}

export function SearchBar(props: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState(props.text ?? "");

    function handleSearchChangeText(text: string) {
        setSearchQuery(text.trimStart());
        props.onChange(text.trimStart());
    }

    useEffect(() => {
        setSearchQuery(props.text);
    }, [props.text]);

    return (
        <Searchbar
            placeholder="Will haben"
            onChangeText={handleSearchChangeText}
            value={searchQuery}
        />
    );
}
