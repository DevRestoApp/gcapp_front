import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface TableInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

export default function TableInput({ value, onChangeText }: TableInputProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.title}>Стол</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder="Введите номер стола"
                placeholderTextColor="#797A80"
                style={[
                    styles.input,
                    value.trim().length > 0 && styles.inputFilled,
                ]}
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="none"
                maxLength={20}
            />
            {value.trim().length === 0 && (
                <Text style={styles.helperText}>Обязательное поле</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 16,
        width: "100%",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        lineHeight: 28,
    },
    input: {
        height: 44,
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "rgba(35, 35, 36, 1)",
        color: "#fff",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    inputFilled: {
        borderColor: "#fff",
        color: "#fff",
    },
    helperText: {
        fontSize: 12,
        color: "#FF6B6B",
        marginTop: 4,
        marginLeft: 4,
    },
});
