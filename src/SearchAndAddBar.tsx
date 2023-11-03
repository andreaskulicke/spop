import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export function SearchAndAddBar() {
    const [text, onChangeText] = useState('');
    const [amount, onChangeAmount] = useState('');

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Please enter name'
                style={styles.inputText}
                value={text}
                onChangeText={onChangeText}
            />
            <TextInput
                maxLength={6}
                placeholder='Amount'
                style={styles.inputAmount}
                value={amount}
                onChangeText={onChangeAmount}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flex: 1,
        backgroundColor: '#fff',
        marginLeft: 8,
        marginRight: 8,
        paddingBottom: 8,
        paddingTop: 8,
        gap: 8,
    },
    inputText: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        padding: 8,
    },
    inputAmount: {
        height: 40,
        borderWidth: 1,
        padding: 8,
    },
});
