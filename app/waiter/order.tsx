import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import { useWaiter } from "@/src/contexts/WaiterProvider";

// ============================================================================
// Types
// ============================================================================

interface OrderItem {
    dishId: string;
    quantity: number;
    price: number;
    name?: string;
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

// API Order type (from backend)
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

// ============================================================================
// Main Component
// ============================================================================

export default function OrderSelectionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { selectedOrder, selectedOrderId } = useWaiter();

    // Используем данные из параметров как fallback
    const apiOrder: ApiOrder | null =
        selectedOrder ||
        (params.orderData ? JSON.parse(params.orderData as string) : null);
    const orderId = selectedOrderId || params.orderId;

    console.log("Selected order:", apiOrder);
    console.log("Selected orderId:", orderId);

    // Состояние для текущего заказа в формате компонента
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    // ========================================================================
    // Effects
    // ========================================================================

    // Конвертируем API order в формат компонента
    useEffect(() => {
        if (apiOrder) {
            const convertedOrder: Order = {
                id: apiOrder.id.toString(),
                table: apiOrder.table || "",
                location: apiOrder.organization_name,
                room: apiOrder.room,
                items: apiOrder.items.map((item, index) => ({
                    dishId: index.toString(),
                    quantity: item.dish_amount_int || 1,
                    price: item.dish_discount_sum_int || 0,
                    name: item.dish_name || "Неизвестное блюдо",
                })),
                status: apiOrder.status === "CREATED" ? "draft" : "completed",
                createdAt: new Date(),
            };

            setCurrentOrder(convertedOrder);
        }
    }, [orderId]); // ✅ Зависимость только от orderId (число/строка)

    // ========================================================================
    // Computed Values
    // ========================================================================

    const totalAmount = currentOrder
        ? currentOrder.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0,
          )
        : 0;

    const totalItems = currentOrder
        ? currentOrder.items.reduce((sum, item) => sum + item.quantity, 0)
        : 0;

    const hasItems = currentOrder ? currentOrder.items.length > 0 : false;

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const handleOrderUpdate = useCallback((updatedOrder: Order) => {
        setCurrentOrder(updatedOrder);
        console.log("Order updated:", updatedOrder);
    }, []);

    const handleTableChange = useCallback((table: string) => {
        console.log("Table changed to:", table);
        // TODO: Update order table via API
    }, []);

    const handleRoomChange = useCallback((room: string) => {
        console.log("Room changed to:", room);
        // TODO: Update order room via API
    }, []);

    const handleDishPress = useCallback((dish: any) => {
        Alert.alert(dish.name, `${dish.description}\n\n${dish.price}`, [
            { text: "Закрыть", style: "cancel" },
            {
                text: "Добавить в заказ",
                onPress: () => {
                    console.log("Adding dish to order:", dish.id);
                    // TODO: Add dish to order via API
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
                        // TODO: Cancel order via API

                        if (currentOrder) {
                            setCurrentOrder({
                                ...currentOrder,
                                table: "",
                                items: [],
                                status: "cancelled",
                            });
                        }

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

        if (!currentOrder) return;

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

        // TODO: Complete order via API

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

    // Показываем загрузку или ошибку если нет данных
    if (!currentOrder) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        {apiOrder ? "Загрузка заказа..." : "Заказ не найден"}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

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
                    dishes={currentOrder.items}
                    onOrderUpdate={handleOrderUpdate}
                    onTableChange={handleTableChange}
                    onRoomChange={handleRoomChange}
                    onDishPress={handleDishPress}
                    onAddDish={handleAddDish}
                    onCancelOrder={handleCancelOrder}
                    onCompleteOrder={handleCompleteOrder}
                />

                {/*{renderActionButtons()}*/}
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

    // Empty state
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyStateText: {
        color: "#fff",
        fontSize: 16,
        opacity: 0.6,
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
