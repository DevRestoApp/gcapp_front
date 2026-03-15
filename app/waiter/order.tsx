import React, { useMemo, useCallback, useState } from "react";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
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
        // Initial parse — params are the primary source on first mount
        if (params.orderData) {
            try {
                return JSON.parse(params.orderData);
            } catch {
                console.warn("order: failed to parse orderData param");
            }
        }
        return selectedOrder ?? null;
    });

    const [isRefetching, setIsRefetching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Re-fetch the order every time this screen comes into focus.
    // This covers the case where the user edited dishes in menuNewOrder
    // and navigated back — we want the latest server state.
    useFocusEffect(
        useCallback(() => {
            if (!params.orderId || !orders) return;
            const found = (orders as ApiOrder[]).find(
                (o) => o.id.toString() === params.orderId,
            );
            if (found) setApiOrder(found);
        }, [orders, params.orderId]),
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
        // Clear any stale selectedDishes before entering the menu
        setSelectedDishes([]);
        router.push({
            pathname: "/waiter/menu",
            params: {
                mode: "edit",
                orderId: String(params.orderId),
                // Pass raw API items so menuNewOrder can seed selectedDishes
                // with the correct productId/price/amount shapes
                orderItems: JSON.stringify(apiOrder.items),
            },
        });
    }, [apiOrder, params.orderId, router, setSelectedDishes]);

    // Called when the user returns from edit mode and wants to persist changes
    // REPLACE handleSaveEditedDishes with:
    const handleSaveEditedDishes = useCallback(async () => {
        if (!params.orderId || selectedDishes.length === 0) return;
        try {
            setIsSaving(true);
            console.log(selectedDishes);
            await updateOrderWrapper(Number(params.orderId), {
                items: selectedDishes.map((d) => ({
                    productId: d.productId,
                    amount: d.amount,
                    price: d.price,
                    sum: d.sum,
                    comment: d.comment,
                })),
            });
            // Re-sync orders in context — useFocusEffect will pick up the change
            await fetchOrders({
                user_id: user?.id,
                organization_id: selectedLocation,
            });
            setSelectedDishes([]);
        } catch (e: any) {
            Alert.alert("Ошибка", "Не удалось сохранить изменения");
            console.error("order: save failed", e);
        } finally {
            setIsSaving(false);
        }
    }, [
        params.orderId,
        selectedDishes,
        updateOrderWrapper,
        fetchOrders,
        user,
        selectedLocation,
        setSelectedDishes,
    ]);

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
    // Loading / empty states
    // ========================================================================

    if (!currentOrder && !isRefetching) {
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

    if (!currentOrder && isRefetching) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <View style={styles.emptyState}>
                    <Loading text="Загрузка заказа..." />
                </View>
            </SafeAreaView>
        );
    }

    // ========================================================================
    // Main render
    // ========================================================================

    // If the user came back from edit mode with pending selectedDishes,
    // show a save banner so they can persist or discard
    const hasPendingEdits = selectedDishes.length > 0;

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <View style={styles.content}>
                {/* Pending edits banner */}
                {hasPendingEdits && (
                    <View style={styles.pendingBanner}>
                        <Text style={styles.pendingBannerText}>
                            Есть несохранённые изменения
                        </Text>
                        <View style={styles.pendingBannerActions}>
                            <TouchableOpacity
                                onPress={() => setSelectedDishes([])}
                                style={styles.pendingDiscard}
                            >
                                <Text style={styles.pendingDiscardText}>
                                    Отменить
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSaveEditedDishes}
                                disabled={isSaving}
                                style={styles.pendingSave}
                            >
                                <Text style={styles.pendingSaveText}>
                                    {isSaving ? "Сохранение..." : "Сохранить"}
                                </Text>
                            </TouchableOpacity>
                        </View>
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

                {/* Action Buttons */}
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
                                !hasItems && styles.completeButtonTextDisabled,
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

    pendingBanner: {
        marginHorizontal: 16,
        marginTop: 12,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "rgba(255, 193, 7, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 193, 7, 0.3)",
        gap: 10,
    },
    pendingBannerText: {
        color: "#FFC107",
        fontSize: 14,
        fontWeight: "500",
    },
    pendingBannerActions: {
        flexDirection: "row",
        gap: 10,
    },
    pendingDiscard: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        alignItems: "center",
    },
    pendingDiscardText: { color: "#797A80", fontSize: 14, fontWeight: "500" },
    pendingSave: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "#FFC107",
        alignItems: "center",
    },
    pendingSaveText: { color: "#000", fontSize: 14, fontWeight: "600" },

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
