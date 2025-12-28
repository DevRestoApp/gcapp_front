import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import ValueBadge from "@/src/client/components/ValueBadge";

interface EmployeeCardProps {
    name: string;
    amount: string;
    avatar: string;
    reason: string;
    onPress?: () => void;
}

export default function EmployeeCardFines({
    name,
    amount,
    avatar,
    reason,
    onPress,
}: EmployeeCardProps) {
    // Simple variant (for analytics screen)
    return (
        <TouchableOpacity
            style={styles.simpleCard}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={!onPress}
        >
            <View style={styles.employeeContent}>
                {avatar && (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                )}
                <View style={styles.employeeText}>
                    <Text style={styles.employeeName}>{name}</Text>
                    <Text style={styles.employeeReason} numberOfLines={1}>
                        <Text style={styles.bold}>{reason}</Text>
                    </Text>
                </View>
            </View>
            <View>
                <ValueBadge
                    value={`-${amount}тг`}
                    type={"negative"}
                ></ValueBadge>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // Simple variant styles
    simpleCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    employeeContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    employeeText: {
        flex: 1,
        gap: 4,
    },
    employeeName: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    employeeReason: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        lineHeight: 16,
    },
    employeeAmount: {
        color: "#FF3B30",
        fontSize: 12,
        lineHeight: 16,
        padding: 4,
    },
    bold: {
        fontWeight: "bold",
    },
    chevronContainer: {
        padding: 8,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    // Full variant styles
    fullCard: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 12,
        gap: 12,
    },
    employeeInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    employeeDetails: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    textContainer: {
        gap: 4,
        flex: 1,
    },
    name: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 20,
    },
    role: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
    },
    statsSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    statItem: {
        flex: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 8,
        gap: 4,
    },
    statLabel: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    statLabelText: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 16,
    },
    statValue: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
        lineHeight: 16,
    },
});
