import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

interface TextInputProps {
    value: string;
    onChange?: (text: string) => void;
    placeholder?: string;
}

export function FormTextInput({
    value,
    onChange,
    placeholder = "Введите текст",
}: TextInputProps) {
    return (
        <View style={textInputStyles.container}>
            <TextInput
                style={textInputStyles.input}
                placeholder={placeholder}
                placeholderTextColor="#797A80"
                onChangeText={onChange}
            />
        </View>
    );
}

const textInputStyles = StyleSheet.create({
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
