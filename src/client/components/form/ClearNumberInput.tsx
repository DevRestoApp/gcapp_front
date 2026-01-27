import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

interface NumberInputProps {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
    maxLength?: number;
    defaultValue?: string;
}

export function ClearNumberInput({
    value,
    onChange,
    placeholder = "0",
    maxLength = 20,
    defaultValue,
}: NumberInputProps) {
    return (
        <View style={numberStyles.container}>
            <TextInput
                style={numberStyles.input}
                value={value}
                defaultValue={defaultValue}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#797A80"
                keyboardType="numeric"
                maxLength={maxLength}
            />
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
});
