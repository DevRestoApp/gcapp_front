import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";

interface DocumentCardProps {
    documentNumber: string;
    timestamp: string;
    category: string;
    children?: ReactNode;
    onPress?: () => void;
}

export default function DocumentCard({
    documentNumber,
    timestamp,
    category,
    children,
    onPress,
}: DocumentCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
            activeOpacity={0.9}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.documentNumber}>{documentNumber}</Text>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                </View>
                <Text style={styles.category}>{category}</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Custom Content */}
            {children && <View style={styles.content}>{children}</View>}
        </TouchableOpacity>
    );
}

// Helper components for common use cases
export const DetailRow = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>{label}: </Text>
            <Text style={styles.detailValue}>{value}</Text>
        </Text>
    </View>
);

export const CommentRow = ({ comment }: { comment: string }) => (
    <View style={styles.commentRow}>
        <View style={styles.commentIcon}>
            <Text style={styles.commentIconText}>
                <Fontisto
                    name="commenting"
                    size={16}
                    color="rgba(255, 255, 255, 0.75)"
                />
            </Text>
        </View>
        <Text style={styles.commentText}>{comment}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 20,
        padding: 12,
        backgroundColor: "rgba(35, 35, 36, 1)",
        gap: 12,
    },
    header: {
        gap: 4,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    documentNumber: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 20,
    },
    timestamp: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
    },
    category: {
        color: "#797A80",
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    content: {
        gap: 8,
    },
    // Helper component styles
    detailRow: {
        borderRadius: 8,
        backgroundColor: "rgba(43,43,44,1)",
        padding: 8,
    },
    detailText: {
        fontSize: 14,
        lineHeight: 18,
    },
    detailLabel: {
        color: "#797A80",
        fontWeight: "400",
    },
    detailValue: {
        color: "#FFFFFF",
        fontWeight: "500",
    },
    commentRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        borderRadius: 8,
        backgroundColor: "rgba(43,43,44,1)",
        padding: 8,
    },
    commentIcon: {
        marginTop: 2,
    },
    commentIconText: {
        fontSize: 16,
    },
    commentText: {
        flex: 1,
        color: "#919399",
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 18,
    },
});
