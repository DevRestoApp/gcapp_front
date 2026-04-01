import React, { useMemo } from "react";
import {
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import Loading from "@/src/client/components/Loading";

// ============================================================================
// Types
// ============================================================================

interface ApiOrderItem {
    product_id: number;
    dish_name: string;
    dish_amount_int: number;
    dish_discount_sum_int: number;
    dish_category: string | null;
    dish_group: string | null;
    open_time: string | null;
    restaurant_section_id: string | null;
    table_num: string | null;
    order_waiter_id: string | null;
    pay_types: string | null;
    product_cost_base_product_cost: string | null;
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

const formatPrice = (price: number): string =>
    `${price.toLocaleString("ru-RU")} тг`;

const getStatusLabel = (status: string): { label: string; color: string } => {
    switch (status) {
        case "CREATED":
            return { label: "Создан", color: "#F5A623" };
        case "COMPLETED":
            return { label: "Завершён", color: "#0DC268" };
        case "CANCELLED":
            return { label: "Отменён", color: "#EE1E44" };
        default:
            return { label: status, color: "#797A80" };
    }
};

// ============================================================================
// Component
// ============================================================================

export default function EmployeeOrderDetailScreen() {
    const router = useRouter();
    const { orderId, orderData } = useLocalSearchParams<{
        orderId: string;
        orderData: string;
    }>();

    const order = useMemo<ApiOrder | null>(() => {
        if (!orderData) return null;
        try {
            return JSON.parse(orderData);
        } catch {
            console.warn("EmployeeOrderDetail: failed to parse orderData");
            return null;
        }
    }, [orderData]);

    const totalItems = useMemo(
        () =>
            order?.items.reduce((sum, item) => sum + item.dish_amount_int, 0) ??
            0,
        [order],
    );

    // ── Guard ─────────────────────────────────────────────────────────────────

    if (!order) {
        return (
            <SafeAreaView
                style={[styles.container, backgroundsStyles.generalBg]}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25, 25, 26, 1)"
                />
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Заказ</Text>
                    <View style={styles.headerSpacer} />
                </View>
                <Loading text="Загрузка заказа..." />
            </SafeAreaView>
        );
    }

    const { label: statusLabel, color: statusColor } = getStatusLabel(
        order.status,
    );

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <BackIcon />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Заказ #{order.id}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Order info card */}
                <View style={styles.card}>
                    <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Заведение</Text>
                        <Text style={styles.cardValue}>
                            {order.organization_name}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Зал / Стол</Text>
                        <Text style={styles.cardValue}>
                            {order.table ? `Стол ${order.table}` : order.room}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Статус</Text>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: `${statusColor}14` },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    { color: statusColor },
                                ]}
                            >
                                {statusLabel}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Dishes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Блюда ({totalItems})
                    </Text>
                    <View style={styles.card}>
                        {order.items.map((item, index) => (
                            <React.Fragment key={item.product_id}>
                                <View style={styles.dishRow}>
                                    <View style={styles.dishInfo}>
                                        <Text style={styles.dishName}>
                                            {item.dish_name}
                                        </Text>
                                        <Text style={styles.dishMeta}>
                                            {item.dish_amount_int} шт ×{" "}
                                            {formatPrice(
                                                item.dish_discount_sum_int,
                                            )}
                                        </Text>
                                    </View>
                                    <Text style={styles.dishTotal}>
                                        {formatPrice(
                                            item.dish_discount_sum_int *
                                                item.dish_amount_int,
                                        )}
                                    </Text>
                                </View>
                                {index < order.items.length - 1 && (
                                    <View style={styles.divider} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Summary */}
                <View style={styles.card}>
                    <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Сумма заказа</Text>
                        <Text style={styles.summaryAmount}>
                            {formatPrice(order.sum_order)}
                        </Text>
                    </View>
                    {order.final_sum !== null && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Итого</Text>
                                <Text style={styles.summaryAmount}>
                                    {formatPrice(order.final_sum)}
                                </Text>
                            </View>
                        </>
                    )}
                    {order.bank_commission !== null && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.cardRow}>
                                <Text style={styles.cardLabel}>Комиссия</Text>
                                <Text style={styles.cardValue}>
                                    {formatPrice(order.bank_commission)}
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ============================================================================
// Back icon
// ============================================================================

function BackIcon() {
    return (
        <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <Path
                d="M9.58992 14.8405C9.42578 14.6765 9.33346 14.4541 9.33325 14.2221V13.7788C9.33594 13.5473 9.42789 13.3258 9.58992 13.1605L15.5866 7.17548C15.6961 7.06505 15.8452 7.00293 16.0008 7.00293C16.1563 7.00293 16.3054 7.06505 16.4149 7.17548L17.2433 8.00381C17.353 8.11134 17.4148 8.25851 17.4148 8.41215C17.4148 8.56578 17.353 8.71295 17.2433 8.82048L12.0516 14.0005L17.2433 19.1805C17.3537 19.29 17.4158 19.4391 17.4158 19.5946C17.4158 19.7502 17.3537 19.8993 17.2433 20.0088L16.4149 20.8255C16.3054 20.9359 16.1563 20.998 16.0008 20.998C15.8452 20.998 15.6961 20.9359 15.5866 20.8255L9.58992 14.8405Z"
                fill="white"
            />
        </Svg>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        paddingHorizontal: 16,
        backgroundColor: "rgba(25, 25, 26, 1)",
    },
    backButton: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 28,
        letterSpacing: -0.24,
    },
    headerSpacer: { width: 28, height: 28 },
    scrollView: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 48,
        gap: 16,
    },

    card: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 20,
        padding: 16,
        gap: 12,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardLabel: {
        color: "#797A80",
        fontSize: 14,
        lineHeight: 18,
    },
    cardValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 18,
        flexShrink: 1,
        textAlign: "right",
        marginLeft: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 18,
    },

    section: { gap: 12 },
    sectionTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        lineHeight: 28,
    },

    dishRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
    },
    dishInfo: { flex: 1, gap: 4 },
    dishName: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
        lineHeight: 20,
    },
    dishMeta: {
        color: "#797A80",
        fontSize: 13,
        lineHeight: 18,
    },
    dishTotal: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        lineHeight: 20,
    },

    summaryAmount: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 20,
    },
});
