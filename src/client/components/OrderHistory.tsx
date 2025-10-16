import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { HistoryItem } from "@/src/client/types/waiter";

interface OrderHistoryProps {
    items: HistoryItem[];
    table: string;
    location: string;
    room: string;
}

export default function OrderHistory({
    items,
    table,
    location,
    room,
}: OrderHistoryProps) {
    console.log("asd", items);
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
        <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Информация</Text>

            <View style={{ gap: 12 }}>
                <ScrollView
                    style={styles.historyList}
                    showsVerticalScrollIndicator={false}
                >
                    {items.map((item, index) => (
                        <View
                            key={`${item.id}-${index}`}
                            style={styles.historyItemWrapper}
                        >
                            <View style={styles.historyItemHeader}>
                                <Text
                                    style={[
                                        styles.historyItemName,
                                        item.action === "removed" &&
                                            styles.historyItemTextRemoved,
                                    ]}
                                >
                                    {item.name}
                                </Text>
                                <Text style={[styles.historyItemTime]}>
                                    {item.timestamp}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.historyItemRow,
                                    item.action === "removed" &&
                                        styles.historyItemRemoved,
                                ]}
                            >
                                <View style={styles.historyItemContent}>
                                    <Text
                                        style={[
                                            styles.historyItemPrice,
                                            item.action === "removed" &&
                                                styles.historyItemTextRemoved,
                                        ]}
                                    >
                                        Цена: {formatPrice(item.price)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.historyItemQuantity,
                                            item.action === "removed" &&
                                                styles.historyItemTextRemoved,
                                        ]}
                                    >
                                        Количество: {item.quantity}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.historyDivider} />

                <View style={styles.historyRow}>
                    <Text style={styles.historyTotalLabel}>Оплата:</Text>
                    <Text style={styles.historyTotalValue}>{"19:30"}</Text>
                </View>

                <View style={[styles.historyItemRow, styles.historyTotal]}>
                    <View style={styles.historyItemContent}>
                        <Text style={[styles.historyTotalLabel]}>
                            Общий счет:
                        </Text>
                        <Text
                            style={[
                                styles.historyItemPrice,
                                styles.historyTotalText,
                            ]}
                        >
                            {formatPrice(totalAmount)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    historySection: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 20,
        gap: 16,
        maxHeight: 500,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "white",
        textAlign: "center",
    },
    historyList: {
        maxHeight: 300,
    },
    historyItemWrapper: {
        marginBottom: 12,
        gap: 6,
    },
    historyItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    historyItemName: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "600",
        flex: 1,
    },
    historyItemTime: {
        fontSize: 12,
        color: "rgba(121, 122, 128, 1)",
        fontWeight: "500",
    },
    historyItemRow: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        padding: 10,
    },
    historyItemRemoved: {
        backgroundColor: "rgba(237,10,52,0.1)",
        opacity: 0.5,
    },
    historyItemTextRemoved: {
        color: "rgba(237,10,52,1)",
    },
    historyTotal: {
        backgroundColor: "rgba(32,199,68,0.15)",
    },
    historyTotalText: {
        color: "rgb(32,199,68)",
    },
    historyItemContent: {
        gap: 4,
    },
    historyItemPrice: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "600",
    },
    historyItemQuantity: {
        fontSize: 12,
        color: "rgba(121, 122, 128, 1)",
    },
    historyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    historyDivider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
        marginVertical: 4,
    },
    historyTotalLabel: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
        flex: 1,
    },
    historyTotalValue: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "600",
        textAlign: "right",
        flex: 1,
    },
});
