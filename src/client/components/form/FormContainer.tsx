import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";

interface FormContainerProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    onSubmit: () => void;
    submitText?: string;
    submitDisabled?: boolean;
}

export function FormContainer({
    title,
    description,
    children,
    onSubmit,
    submitText = "Сохранить",
    submitDisabled = false,
}: FormContainerProps) {
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    {description && (
                        <Text style={styles.description}>{description}</Text>
                    )}
                </View>

                {/* Form Fields */}
                <View style={styles.fieldsContainer}>{children}</View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        submitDisabled && styles.submitButtonDisabled,
                    ]}
                    onPress={onSubmit}
                    disabled={submitDisabled}
                    activeOpacity={0.7}
                >
                    <Text style={styles.submitText}>{submitText}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#19191A",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 20,
    },
    header: {
        gap: 4,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
        lineHeight: 28,
    },
    description: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    fieldsContainer: {
        gap: 16,
    },
    submitButton: {
        height: 44,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitText: {
        color: "#2C2D2E",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 24,
    },
});
