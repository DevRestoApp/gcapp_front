import React, { useMemo, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

import OrderSelection from "@/src/client/components/waiter/OrderSelection";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";

// ============================================================================
// Types
// ============================================================================

interface OrderItem {
    dishId: string;
    amount: number;
    price: number;
    name?: string;
}

interface Order {
    id: string;
    table: string;
    location: string;
    room: string;
    items: OrderItem[];
    totalBill: number;
    status: "draft" | "completed" | "cancelled";
    createdAt: Date;
}

interface ApiOrderItem {
    product_id: number;
    dish_name: string;
    dish_amount_int: number;
    dish_discount_sum_int: number;
    comment?: string;
}

interface ApiOrder {
    id: number;
    organization_name: string;
    table: string | null;
    room: string;
    status: string;
    sum_order: number;
    final_sum: number | null;
    bank_commission: number | null;
    items: ApiOrderItem[];
}

// ============================================================================
// Helpers
// ============================================================================

const parseApiOrder = (raw: ApiOrder): Order => ({
    id: raw.id.toString(),
    table: raw.table || "",
    location: raw.organization_name,
    room: raw.room,
    items: raw.items.map((item, index) => ({
        dishId: index.toString(),
        amount: item.dish_amount_int || 1,
        price: item.dish_discount_sum_int || 0,
        name: item.dish_name || "Неизвестное блюдо",
    })),
    totalBill: raw.sum_order,
    status: raw.status === "CREATED" ? "draft" : "completed",
    createdAt: new Date(),
});

// ============================================================================
// Component
// ============================================================================

export default function OrderScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        orderId?: string;
        orderData?: string;
        date?: string;
    }>();

    const { selectedOrder, fetchOrders, orders } = useWaiter();
    const { user, selectedLocation } = useAuth();

    // Рефетч orders при фокусе (возврат из editOrderMenu, cancel, payment)
    useFocusEffect(
        useCallback(() => {
            if (!user?.id) return;
            fetchOrders({
                user_id: user.id,
                organization_id: selectedLocation,
                date: params.date,
            }).catch(console.error);
        }, [user?.id, selectedLocation, params.date, fetchOrders]),
    );

    // Берём актуальный заказ: сначала из свежего контекста orders, потом из params
    const apiOrder = useMemo<ApiOrder | null>(() => {
        if (params.orderId && orders) {
            const fromContext = (orders as ApiOrder[]).find(
                (o) => o.id === Number(params.orderId),
            );
            if (fromContext) return fromContext;
        }
        if (params.orderId && params.orderData) {
            try {
                return JSON.parse(params.orderData);
            } catch {
                console.warn("order: failed to parse orderData param");
            }
        }
        return selectedOrder ?? null;
    }, [params.orderId, params.orderData, orders, selectedOrder]);

    const currentOrder = useMemo(() => {
        return apiOrder ? parseApiOrder(apiOrder) : null;
    }, [apiOrder]);

    const hasItems = (currentOrder?.items.length ?? 0) > 0;

    // ── Handlers ─────────────────────────────────────────────────────────────

    // Переходим на отдельный экран редактирования — передаём orderId и текущие позиции
    const handleEditDishes = useCallback(() => {
        if (!apiOrder) return;
        router.push({
            pathname: "/waiter/editOrderMenu",
            params: {
                orderId: String(params.orderId),
                orderItems: JSON.stringify(apiOrder.items),
                date: params.date,
            },
        });
    }, [apiOrder, params.orderId, router]);

    const handleCancelOrder = useCallback(() => {
        router.push({
            pathname: "/waiter/cancel",
            params: { orderId: String(params.orderId), date: params.date },
        });
    }, [router, params.orderId]);

    const handleCompleteOrder = useCallback(() => {
        if (!hasItems) {
            Alert.alert("Ошибка", "Добавьте блюда в заказ");
            return;
        }
        router.push({
            pathname: "/waiter/payment",
            params: {
                orderId: String(params.orderId),
                totalBill: currentOrder?.totalBill,
                date: params.date,
            },
        });
    }, [hasItems, params.orderId, router, currentOrder]);

    // ── Render ────────────────────────────────────────────────────────────────

    if (!currentOrder) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>Заказ не найден</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                    onOrderUpdate={() => {}}
                    onTableChange={() => {}}
                    onRoomChange={() => {}}
                    onDishPress={() => {}}
                    onAddDish={handleEditDishes}
                    isEditOrder={true}
                />

                {currentOrder.status === "draft" && (
                    <View
                        style={[
                            styles.actionsSection,
                            backgroundsStyles.generalBgTransparent,
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancelOrder}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>
                                Отменить заказ
                            </Text>
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
                                    !hasItems &&
                                        styles.completeButtonTextDisabled,
                                ]}
                            >
                                Завершить
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, width: "100%", alignSelf: "center" },
    emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyStateText: { color: "#fff", fontSize: 16, opacity: 0.6 },
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
    completeButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    completeButtonTextDisabled: { color: "rgba(255, 255, 255, 0.4)" },
});
