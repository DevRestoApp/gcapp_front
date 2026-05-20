// ============================================================================
// CommentInput.tsx
// ============================================================================
import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    InputAccessoryView,
    Keyboard,
    Platform,
    StyleSheet,
} from "react-native";

interface CommentInputProps {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
    maxLength?: number;
}

const ACCESSORY_VIEW_ID = "comment-input-accessory";

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
                inputAccessoryViewID={
                    Platform.OS === "ios" ? ACCESSORY_VIEW_ID : undefined
                }
            />
            {Platform.OS === "ios" && (
                <InputAccessoryView nativeID={ACCESSORY_VIEW_ID}>
                    <View style={commentStyles.accessory}>
                        <TouchableOpacity
                            onPress={Keyboard.dismiss}
                            style={commentStyles.doneButton}
                        >
                            <Text style={commentStyles.doneText}>Готово</Text>
                        </TouchableOpacity>
                    </View>
                </InputAccessoryView>
            )}
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
    accessory: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#1C1C1E",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "rgba(255, 255, 255, 0.15)",
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    doneButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    doneText: {
        color: "#0A84FF",
        fontSize: 17,
        fontWeight: "600",
    },
});
