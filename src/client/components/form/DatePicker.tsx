import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface DatePickerButtonProps {
    value: string;
    onPress: () => void;
    placeholder?: string;
}

export function DatePickerButton({
    value,
    onPress,
    placeholder = "Выберите дату",
}: DatePickerButtonProps) {
    return (
        <TouchableOpacity
            style={dateStyles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[dateStyles.text, !value && dateStyles.placeholder]}>
                {value || placeholder}
            </Text>
        </TouchableOpacity>
    );
}

const dateStyles = StyleSheet.create({
    container: {
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
        justifyContent: "center",
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    placeholder: {
        color: "#797A80",
    },
});
