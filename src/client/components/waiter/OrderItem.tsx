import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface OrderItemProps {
    id: string;
    tableNumber: string;
    description: string;
    amount: string;
    status?: string;
    showStatus?: boolean;
    onClick?: () => void;
}

const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; bg: string }
> = {
    CREATED: {
        label: "Создан",
        color: "#FF9E00",
        bg: "rgba(255, 158, 0, 0.12)",
    },
    PAID: {
        label: "Оплачен",
        color: "#0DC268",
        bg: "rgba(13, 194, 104, 0.12)",
    },
    default: {
        label: "Нет инфо",
        color: "#797A80",
        bg: "rgba(121, 122, 128, 0.12)",
    },
    CANCELLED: {
        label: "Отменён",
        color: "#EE1E44",
        bg: "rgba(238, 30, 68, 0.12)",
    },
};

export default function OrderItem({
    id,
    tableNumber,
    description,
    amount,
    status,
    showStatus = false,
    onClick,
}: OrderItemProps) {
    const statusConfig = status ? (STATUS_CONFIG[status] ?? null) : null;

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
                    {showStatus && statusConfig && (
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: statusConfig.bg },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    { color: statusConfig.color },
                                ]}
                            >
                                {statusConfig.label}
                            </Text>
                        </View>
                    )}
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
        gap: 6,
    },
    amount: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
    },
    statusBadge: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        lineHeight: 16,
    },
});
