import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    error?: string;
}

export function FormField({ label, children, error }: FormFieldProps) {
    return (
        <View style={fieldStyles.container}>
            <Text style={fieldStyles.label}>{label}</Text>
            {children}
            {error && <Text style={fieldStyles.error}>{error}</Text>}
        </View>
    );
}

const fieldStyles = StyleSheet.create({
    container: {
        gap: 8,
    },
    label: {
        color: "#FFFFFF",
        fontSize: 14,
        lineHeight: 18,
    },
    error: {
        color: "#FF453A",
        fontSize: 12,
        lineHeight: 16,
    },
});
