import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import {
    View,
    StyleSheet,
    StatusBar,
    Alert,
    Text,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OrderSelection from "@/src/client/components/waiter/OrderSelection";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

// ============================================================================
// Types
// ============================================================================

interface OrderItem {
    dishId: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    table: string;
    location: string;
    room: string;
    items: OrderItem[];
    status: "draft" | "completed" | "cancelled";
    createdAt: Date;
    completedAt?: Date;
}

// ============================================================================
// Constants
// ============================================================================

const INITIAL_ORDER: Order = {
    id: "order-123",
    table: "12",
    location: 'Ресторан "Дастархан"',
    room: "Общий зал",
    items: [
        { dishId: "1", quantity: 2, price: 5600 },
        { dishId: "2", quantity: 1, price: 3200 },
        { dishId: "4", quantity: 1, price: 2400 },
    ],
    status: "draft",
    createdAt: new Date(),
};

// ============================================================================
// Main Component
// ============================================================================

export default function OrderSelectionScreen() {
    const router = useRouter();
    const [currentOrder, setCurrentOrder] = useState<Order>(INITIAL_ORDER);

    // ========================================================================
    // Computed Values
    // ========================================================================

    const totalAmount = currentOrder.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    const totalItems = currentOrder.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    const hasItems = currentOrder.items.length > 0;

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const handleOrderUpdate = useCallback((updatedOrder: Order) => {
        setCurrentOrder(updatedOrder);
        console.log("Order updated:", updatedOrder);

        // API Integration Point:
        // - Update state management (Redux, Context, etc.)
        // - Save to local storage/cache
        // - Sync with backend API
    }, []);

    const handleTableChange = useCallback((table: string) => {
        console.log("Table changed to:", table);
    }, []);

    const handleRoomChange = useCallback((room: string) => {
        console.log("Room changed to:", room);
    }, []);

    const handleDishPress = useCallback((dish: any) => {
        Alert.alert(dish.name, `${dish.description}\n\n${dish.price}`, [
            { text: "Закрыть", style: "cancel" },
            {
                text: "Добавить в заказ",
                onPress: () => {
                    console.log("Adding dish to order:", dish.id);
                },
            },
        ]);
    }, []);

    const handleAddDish = useCallback(() => {
        console.log("Navigate to menu to add dishes");
        // router.push('/waiter/menu');
    }, []);

    const handleCancelOrder = useCallback(() => {
        Alert.alert(
            "Отменить заказ",
            "Вы уверены, что хотите отменить заказ?",
            [
                { text: "Нет", style: "cancel" },
                {
                    text: "Да, отменить",
                    style: "destructive",
                    onPress: () => {
                        console.log("Order cancelled");

                        setCurrentOrder({
                            ...currentOrder,
                            table: "",
                            items: [],
                            status: "cancelled",
                        });

                        router.push("/waiter/cancel");
                    },
                },
            ],
        );
    }, [currentOrder, router]);

    const handleCompleteOrder = useCallback(() => {
        if (!hasItems) {
            Alert.alert("Ошибка", "Добавьте блюда в заказ");
            return;
        }

        const completedOrder: Order = {
            ...currentOrder,
            status: "completed",
            completedAt: new Date(),
        };

        setCurrentOrder(completedOrder);
        console.log("Order completed:", {
            totalAmount,
            totalItems,
        });

        router.push("/waiter/payment");
    }, [currentOrder, hasItems, totalAmount, totalItems, router]);

    // ========================================================================
    // Render Functions
    // ========================================================================

    const renderActionButtons = () => (
        <View
            style={[
                styles.actionsSection,
                backgroundsStyles.generalBgTransparent,
            ]}
        >
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelOrder}
                disabled={!hasItems}
                activeOpacity={0.8}
            >
                <Text style={styles.cancelButtonText}>Отменить заказ</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.completeButton,
                    !hasItems && styles.completeButtonDisabled,
                ]}
                onPress={handleCompleteOrder}
                disabled={!hasItems}
                activeOpacity={0.8}
            >
                <Text
                    style={[
                        styles.completeButtonText,
                        !hasItems && styles.completeButtonTextDisabled,
                    ]}
                >
                    Завершить
                </Text>
            </TouchableOpacity>
        </View>
    );

    // ========================================================================
    // Main Render
    // ========================================================================

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <View style={styles.content}>
                <OrderSelection
                    order={currentOrder}
                    onOrderUpdate={handleOrderUpdate}
                    onTableChange={handleTableChange}
                    onRoomChange={handleRoomChange}
                    onDishPress={handleDishPress}
                    onAddDish={handleAddDish}
                    onCancelOrder={handleCancelOrder}
                    onCompleteOrder={handleCompleteOrder}
                />

                {renderActionButtons()}
            </View>
        </SafeAreaView>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        width: "100%",
        alignSelf: "center",
    },

    // Action Buttons
    actionsSection: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(237, 10, 52, 0.08)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(237, 10, 52, 0.2)",
    },
    cancelButtonText: {
        color: "#EE1E44",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        lineHeight: 24,
    },
    completeButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#4CAF50",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    completeButtonDisabled: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        shadowColor: "#000",
        shadowOpacity: 0.1,
    },
    completeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    completeButtonTextDisabled: {
        color: "rgba(255, 255, 255, 0.4)",
    },
});
