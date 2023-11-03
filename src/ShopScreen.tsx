import { SafeAreaView, StyleSheet, Text } from 'react-native';
import React from 'react';

export function ShopScreen() {
    return (
        <SafeAreaView>
            <Text>Shopping time...</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
