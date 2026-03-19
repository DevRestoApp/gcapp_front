import React, { useMemo, useCallback, useState, useRef } from "react";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
    View,
    StyleSheet,
    StatusBar,
    Alert,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OrderSelection from "@/src/client/components/waiter/OrderSelection";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useWaiter } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";
import Loading from "@/src/client/components/Loading";

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
        quantity: item.dish_amount_int || 1,
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

export default function OrderSelectionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        orderId?: string;
        orderData?: string;
    }>();

    const {
        selectedOrder,
        selectedDishes,
        setSelectedDishes,
        updateOrderWrapper,
        fetchOrders,
        orders,
    } = useWaiter();
    const { user, selectedLocation } = useAuth();

    const [apiOrder, setApiOrder] = useState<ApiOrder | null>(() => {
        if (params.orderData) {
            try {
                return JSON.parse(params.orderData);
            } catch {
                console.warn("order: failed to parse orderData param");
            }
        }
        return selectedOrder ?? null;
    });

    const [isSaving, setIsSaving] = useState(false);

    // ── Key fix: read selectedDishes via ref inside useFocusEffect ───────────
    //
    // Problem: useFocusEffect memoizes its callback. If we add selectedDishes
    // to the dep array, the effect re-subscribes on every dish change and fires
    // again immediately. If we omit it, the closure captures the initial empty
    // array (stale closure). The ref always reflects the current value without
    // triggering re-subscription.
    const selectedDishesRef = useRef(selectedDishes);
    selectedDishesRef.current = selectedDishes;

    // Skip auto-save on the very first focus (screen just opened, nothing to save)
    const isFirstFocus = useRef(true);

    useFocusEffect(
        useCallback(() => {
            // Always sync apiOrder from the latest fetched orders list
            if (params.orderId && orders) {
                const found = (orders as ApiOrder[]).find(
                    (o) => o.id.toString() === params.orderId,
                );
                if (found) setApiOrder(found);
            }

            // Don't try to save on initial mount
            if (isFirstFocus.current) {
                isFirstFocus.current = false;
                return;
            }

            // Read current dishes from ref — never stale
            const pendingDishes = selectedDishesRef.current;
            if (!params.orderId || pendingDishes.length === 0) return;

            (async () => {
                try {
                    setIsSaving(true);
                    console.log(
                        "[order] auto-saving",
                        pendingDishes.length,
                        "dishes →",
                        params.orderId,
                    );
                    await updateOrderWrapper(Number(params.orderId), {
                        items: pendingDishes.map((d) => ({
                            productId: d.productId,
                            amount: d.amount,
                            price: d.price,
                            sum: d.sum,
                            comment: d.comment,
                        })),
                    });

                    await fetchOrders({
                        user_id: user?.id,
                        organization_id: selectedLocation,
                    });
                } catch (e: any) {
                    Alert.alert("Ошибка", "Не удалось сохранить изменения");
                    console.error("[order] auto-save failed", e);
                } finally {
                    setIsSaving(false);
                    setSelectedDishes([]);
                }
            })();
            // selectedDishes intentionally omitted — using ref instead
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [params.orderId, orders]),
    );

    const currentOrder: Order | null = useMemo(
        () => (apiOrder ? parseApiOrder(apiOrder) : null),
        [apiOrder],
    );

    const hasItems = (currentOrder?.items.length ?? 0) > 0;

    // ========================================================================
    // Handlers
    // ========================================================================

    const handleEditDishes = useCallback(() => {
        if (!apiOrder) return;
        // Clear any stale dishes before going into edit mode
        setSelectedDishes([]);
        router.push({
            pathname: "/waiter/menu",
            params: {
                mode: "edit",
                orderId: String(params.orderId),
                orderItems: JSON.stringify(apiOrder.items),
            },
        });
    }, [apiOrder, params.orderId, router, setSelectedDishes]);

    const handleCancelOrder = useCallback(() => {
        router.push({
            pathname: "/waiter/cancel",
            params: { orderId: String(params.orderId) },
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
            },
        });
    }, [hasItems, params.orderId, router, currentOrder]);

    // ========================================================================
    // Empty state
    // ========================================================================

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

    // ========================================================================
    // Main render
    // ========================================================================

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <View style={styles.content}>
                {isSaving && (
                    <View style={styles.savingIndicator}>
                        <ActivityIndicator size="small" color="#4CAF50" />
                        <Text style={styles.savingText}>Сохранение...</Text>
                    </View>
                )}

                <OrderSelection
                    order={currentOrder}
                    dishes={currentOrder.items}
                    onOrderUpdate={() => {}}
                    onTableChange={() => {}}
                    onRoomChange={() => {}}
                    onDishPress={() => {}}
                    onAddDish={handleEditDishes}
                    onCancelOrder={handleCancelOrder}
                    onCompleteOrder={handleCompleteOrder}
                />

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
                            (!hasItems || isSaving) &&
                                styles.completeButtonDisabled,
                        ]}
                        onPress={handleCompleteOrder}
                        disabled={!hasItems || isSaving}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.completeButtonText,
                                (!hasItems || isSaving) &&
                                    styles.completeButtonTextDisabled,
                            ]}
                        >
                            Завершить
                        </Text>
                    </TouchableOpacity>
                </View>
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

    savingIndicator: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginHorizontal: 16,
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(76, 175, 80, 0.3)",
    },
    savingText: {
        color: "#4CAF50",
        fontSize: 14,
        fontWeight: "500",
    },

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
