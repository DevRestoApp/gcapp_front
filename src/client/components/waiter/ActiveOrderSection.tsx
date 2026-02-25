import React, { useCallback, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import OrderItem from "./OrderItem";
import AddOrder from "./AddOrder";

// API Order type
interface ApiOrder {
    id: number;
    organization_name: string;
    table: string | null;
    room: string;
    status: string;
    sum_order: number;
    final_sum: number | null;
    bank_commission: number | null;
    items: any[];
}

// Component Order type (for display)
interface DisplayOrder {
    id: string;
    tableNumber: string;
    description: string;
    amount: string;
}

interface ActiveOrdersSectionProps {
    orders?: ApiOrder[] | null;
    onNewOrder?: () => void;
    onOrderClick?: (orderId: string) => void;
    showScrollIndicator?: boolean;
    maxHeight?: number;
    isLoading?: boolean;
}

export default function ActiveOrdersSection({
    orders,
    onNewOrder,
    onOrderClick,
    showScrollIndicator = false,
    maxHeight,
    isLoading = false,
}: ActiveOrdersSectionProps) {
    const router = useRouter();

    // Transform API orders to display format
    const displayOrders = useMemo(() => {
        if (!orders) return null;

        return orders.map((order) => {
            // Determine table number display
            const tableNumber = order.table
                ? `${order.table}-стол`
                : order.room || "Без стола";

            // Create description from items or show count
            let description = "";
            if (order.items && order.items.length > 0) {
                // If items have names, join them
                const itemNames = order.items
                    .map((item) => item.dish_name || item.name || item.title)
                    .filter(Boolean);

                description =
                    itemNames.length > 0
                        ? itemNames.join(", ")
                        : `${order.items.length} позиций`;
            } else {
                description = "Заказ создан";
            }

            // Format amount
            const amount = `${(order.sum_order ?? 0).toLocaleString("ru-RU")} тг`;

            return {
                id: order.id.toString(),
                tableNumber,
                description,
                amount,
            } as DisplayOrder;
        });
    }, [orders]);

    const handleNewOrder = useCallback(() => {
        onNewOrder?.();
    }, [onNewOrder]);

    const handleOrderClick = useCallback(
        (orderId: string) => {
            onOrderClick?.(orderId);
            router.push(`/waiter/order/${orderId}`);
        },
        [onOrderClick, router],
    );

    // Render header section
    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.title}>Активные заказы</Text>
            <AddOrder onNewOrder={handleNewOrder} />
        </View>
    );

    // Render loading state
    const renderLoading = () => (
        <View style={styles.loadingState}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.loadingText}>Загрузка заказов...</Text>
        </View>
    );

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Нет активных заказов</Text>
        </View>
    );

    // Render orders list
    const renderOrdersList = () => {
        // Handle loading state
        if (isLoading) {
            return renderLoading();
        }

        // Handle null/undefined orders (still loading initial data)
        if (!displayOrders) {
            return renderLoading();
        }

        // Handle empty orders array
        if (displayOrders.length === 0) {
            return renderEmptyState();
        }

        const scrollViewStyle = maxHeight
            ? [styles.ordersList, { maxHeight }]
            : styles.ordersList;

        return (
            <ScrollView
                style={scrollViewStyle}
                contentContainerStyle={styles.ordersContent}
                showsVerticalScrollIndicator={showScrollIndicator}
                nestedScrollEnabled
            >
                {displayOrders.map((order) => (
                    <OrderItem
                        key={order.id}
                        id={order.id}
                        tableNumber={order.tableNumber}
                        description={order.description}
                        amount={order.amount}
                        onClick={handleOrderClick}
                    />
                ))}
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderOrdersList()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: 20,
    },

    // Header styles
    header: {
        gap: 16,
    },
    title: {
        color: "#ffffff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },

    // Loading state styles
    loadingState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        gap: 12,
    },
    loadingText: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 14,
    },

    // Orders list styles
    ordersList: {
        flexGrow: 0,
    },
    ordersContent: {
        gap: 12,
        paddingBottom: 8,
    },

    // Empty state styles
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        gap: 16,
    },
    emptyStateText: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 16,
        textAlign: "center",
        lineHeight: 22,
    },
    emptyStateButton: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    emptyStateButtonText: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 14,
        fontWeight: "500",
    },
});
