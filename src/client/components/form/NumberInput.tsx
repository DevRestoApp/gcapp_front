import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

interface NumberInputProps {
    value: string;
    onChange: (text: string) => void;
    currency?: string;
    placeholder?: string;
    maxLength?: number;
}

export function NumberInput({
    value,
    onChange,
    placeholder = "0",
    currency = "тг",
    maxLength = 20,
}: NumberInputProps) {
    return (
        <View style={numberStyles.container}>
            <TextInput
                style={numberStyles.input}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#797A80"
                keyboardType="numeric"
                maxLength={maxLength}
            />
            <Text style={numberStyles.currency}>{currency}</Text>
        </View>
    );
}

const numberStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    input: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    currency: {
        color: "#797A80",
        fontSize: 16,
        lineHeight: 20,
        marginLeft: 8,
    },
});
