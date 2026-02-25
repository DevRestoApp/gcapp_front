import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface OrderItemProps {
    id: string;
    tableNumber: string;
    description: string;
    amount: string;
    onClick?: () => void; // Упрощаем - логика обработки снаружи
}

export default function OrderItem({
    id,
    tableNumber,
    description,
    amount,
    onClick,
}: OrderItemProps) {
    return (
        <TouchableOpacity
            onPress={onClick}
            style={styles.container}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <Text style={styles.tableNumber} numberOfLines={1}>
                        {tableNumber}
                    </Text>
                    <Text style={styles.description} numberOfLines={1}>
                        {description}
                    </Text>
                </View>

                <View style={styles.rightSection}>
                    <Text style={styles.amount} numberOfLines={1}>
                        {amount}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 16,
        width: "100%",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    leftSection: {
        flex: 1,
        gap: 4,
    },
    tableNumber: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
    },
    description: {
        color: "rgba(170, 173, 179, 1)",
        fontSize: 12,
        lineHeight: 16,
    },
    rightSection: {
        alignItems: "flex-end",
    },
    amount: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
    },
});
