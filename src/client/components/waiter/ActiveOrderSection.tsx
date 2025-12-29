import React, { useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

import OrderItem from "./OrderItem";
import AddOrder from "./AddOrder";

const { width: screenWidth } = Dimensions.get("window");

interface Order {
    id: string;
    tableNumber: string;
    description: string;
    amount: string;
}

interface ActiveOrdersSectionProps {
    orders?: Order[];
    onNewOrder?: () => void;
    onOrderClick?: (orderId: string) => void;
    showScrollIndicator?: boolean;
    maxHeight?: number;
}

const defaultOrders: Order[] = [
    {
        id: "1",
        tableNumber: "12-стол",
        description: "Паста Болоньезе, Лазанья, итальянский рыбный суп",
        amount: "12 064 тг",
    },
    {
        id: "2",
        tableNumber: "19-стол",
        description: "Паста Болоньезе, Лазанья, итальянский рыбный суп",
        amount: "15 064 тг",
    },
    {
        id: "3",
        tableNumber: "15-стол",
        description: "Паста Болоньезе, Лазанья, итальянский рыбный суп",
        amount: "120 064 тг",
    },
    {
        id: "4",
        tableNumber: "8-стол",
        description: "Паста Болоньезе, Лазанья, итальянский рыбный суп",
        amount: "89 064 тг",
    },
    {
        id: "5",
        tableNumber: "3-стол",
        description: "Паста Болоньезе, Лазанья, итальянский рыбный суп",
        amount: "67 064 тг",
    },
];

// Plus icon component
const PlusIcon = () => (
    <View style={styles.plusIcon}>
        <View style={styles.plusHorizontal} />
        <View style={styles.plusVertical} />
    </View>
);

export default function ActiveOrdersSection({
    orders = defaultOrders,
    onNewOrder,
    onOrderClick,
    showScrollIndicator = false,
    maxHeight,
}: ActiveOrdersSectionProps) {
    const router = useRouter();

    const handleNewOrder = useCallback(() => {
        onNewOrder?.();
    }, [onNewOrder]);

    const handleOrderClick = useCallback(
        (orderId: string) => {
            onOrderClick?.(orderId);
            router.push(`/waiter/order`);
        },
        [onOrderClick],
    );

    // Render header section
    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.title}>Активные заказы</Text>

            <AddOrder></AddOrder>
        </View>
    );

    // Render orders list
    const renderOrdersList = () => {
        if (orders.length === 0) {
            return (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        Нет активных заказов
                    </Text>
                    <TouchableOpacity
                        onPress={handleNewOrder}
                        style={styles.emptyStateButton}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.emptyStateButtonText}>
                            Создать первый заказ
                        </Text>
                    </TouchableOpacity>
                </View>
            );
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
                {orders.map((order, index) => (
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
        paddingHorizontal: 16,
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

    // New order button styles
    newOrderButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        height: 44,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    newOrderButtonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 24,
    },

    // Plus icon styles
    plusIcon: {
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    plusHorizontal: {
        position: "absolute",
        width: 12,
        height: 2,
        backgroundColor: "#111213",
        borderRadius: 1,
    },
    plusVertical: {
        position: "absolute",
        width: 2,
        height: 12,
        backgroundColor: "#111213",
        borderRadius: 1,
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
