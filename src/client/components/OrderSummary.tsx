import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface OrderItem {
    dishId: string;
    quantity: number;
    price: number;
}

interface OrderSummaryProps {
    items: OrderItem[];
    table: string;
    location: string;
    room: string;
}

export default function OrderSummary({
    items,
    table,
    location,
    room,
}: OrderSummaryProps) {
    const calculateTotal = () => {
        return items.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        );
    };

    const getTotalItemsCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const formatPrice = (price: number) => {
        return `${price.toLocaleString()} тг`;
    };

    const totalItems = getTotalItemsCount();
    const totalAmount = calculateTotal();

    return (
        <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Итого по заказу</Text>

            <View style={styles.summaryContent}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Количество блюд:</Text>
                    <Text style={styles.summaryValue}>{totalItems}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Стол:</Text>
                    <Text style={styles.summaryValue}>
                        {table || "Не указан"}
                    </Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Локация:</Text>
                    <Text style={styles.summaryValue}>{location}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Помещение:</Text>
                    <Text style={styles.summaryValue}>{room}</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Общая сумма:</Text>
                    <Text style={styles.summaryTotalValue}>
                        {formatPrice(totalAmount)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    summarySection: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 20,
        gap: 16,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "white",
        textAlign: "center",
    },
    summaryContent: {
        gap: 12,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    summaryLabel: {
        fontSize: 14,
        color: "rgba(121, 122, 128, 1)",
        flex: 1,
    },
    summaryValue: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "500",
        textAlign: "right",
    },
    summaryDivider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
        marginVertical: 4,
    },
    summaryTotalLabel: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
        flex: 1,
    },
    summaryTotalValue: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "700",
        textAlign: "right",
    },
});
