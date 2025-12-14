// ============================================================================
// CommentInput.tsx
// ============================================================================
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface CommentInputProps {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
    maxLength?: number;
}

export function CommentInput({
    value,
    onChange,
    placeholder = "Напишите коментарий",
    maxLength,
}: CommentInputProps) {
    return (
        <View style={commentStyles.container}>
            <TextInput
                style={commentStyles.input}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor="#797A80"
                multiline
                textAlignVertical="top"
                maxLength={maxLength}
            />
        </View>
    );
}

const commentStyles = StyleSheet.create({
    container: {
        height: 80,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    input: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
});
