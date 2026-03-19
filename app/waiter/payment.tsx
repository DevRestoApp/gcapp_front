import React, { useState, useCallback, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useWaiter } from "@/src/contexts/WaiterProvider";
import type { PaymentType } from "@/src/contexts/WaiterProvider";
import { useAuth } from "@/src/contexts/AuthContext";

export default function PaymentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { fetchOrders, payOrderWrapper, fetchPaymentTypes } = useWaiter();
    const { user, selectedLocation } = useAuth();

    const order_id = Number(params.orderId);
    const totalBill = Number(params.totalBill) || 0;

    const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
    const [paymentTypesLoading, setPaymentTypesLoading] = useState(true);
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<PaymentType | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const isValid = selectedPaymentMethod !== null;

    // ── Fetch payment types on mount ──────────────────────────────────────────

    useEffect(() => {
        const load = async () => {
            setPaymentTypesLoading(true);
            try {
                const response = await fetchPaymentTypes({
                    organization_id: selectedLocation ?? undefined,
                });
                const types = response.payment_types ?? [];
                setPaymentTypes(types);
                if (types.length > 0) setSelectedPaymentMethod(types[0]);
            } catch (error) {
                console.error("Error fetching payment types:", error);
            } finally {
                setPaymentTypesLoading(false);
            }
        };

        load();
    }, []);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleComplete = useCallback(async () => {
        if (!isValid) return;

        setIsProcessing(true);
        try {
            const input: Record<string, any> = {};
            if (selectedPaymentMethod)
                input.paymentType = selectedPaymentMethod.id;
            await payOrderWrapper(order_id, input);
            await fetchOrders({
                user_id: user.id,
                organization_id: selectedLocation,
            });
            router.push("/waiter");
        } catch {
            // TODO: show error toast/banner
        } finally {
            setIsProcessing(false);
        }
    }, [
        isValid,
        order_id,
        selectedPaymentMethod,
        payOrderWrapper,
        fetchOrders,
        user.id,
        selectedLocation,
        router,
    ]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.push("/waiter")}
                        style={styles.backButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Оплата</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Payment Methods */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Способ оплаты</Text>

                        {paymentTypesLoading ? (
                            <View style={styles.loadingRow}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={styles.loadingText}>
                                    Загрузка...
                                </Text>
                            </View>
                        ) : paymentTypes.length === 0 ? (
                            <Text style={styles.emptyText}>
                                Нет доступных способов оплаты
                            </Text>
                        ) : (
                            <View style={styles.paymentMethodsContainer}>
                                {paymentTypes.map((method) => {
                                    const isSelected =
                                        selectedPaymentMethod?.id === method.id;
                                    return (
                                        <TouchableOpacity
                                            key={method.id}
                                            onPress={() =>
                                                setSelectedPaymentMethod(method)
                                            }
                                            style={[
                                                styles.paymentMethodButton,
                                                isSelected &&
                                                    styles.paymentMethodButtonActive,
                                            ]}
                                            activeOpacity={0.7}
                                        >
                                            <Text
                                                style={[
                                                    styles.paymentMethodText,
                                                    isSelected &&
                                                        styles.paymentMethodTextActive,
                                                ]}
                                            >
                                                {method.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </View>

                    {/* Tips — temporarily disabled */}
                    {/* <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Чаевые</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={tipAmount}
                                onChangeText={handleTipChange}
                                placeholder="Сумма"
                                placeholderTextColor="#797A80"
                                style={styles.input}
                                keyboardType="numeric"
                                returnKeyType="done"
                                maxLength={10}
                            />
                            {tipAmount.length > 0 && (
                                <Text style={styles.inputSuffix}>тг</Text>
                            )}
                        </View>
                        {tipAmount.length > 0 && (
                            <Text style={styles.tipHint}>
                                Чаевые: {parseFloat(tipAmount).toLocaleString()} тг
                            </Text>
                        )}
                    </View> */}
                </ScrollView>

                {/* Bottom */}
                <View style={styles.bottomSection}>
                    <View style={styles.bottomContent}>
                        <Text style={styles.totalText}>
                            Общий счет: {totalBill.toLocaleString()} тг
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.completeButton,
                                (!isValid || isProcessing) &&
                                    styles.completeButtonDisabled,
                            ]}
                            onPress={handleComplete}
                            disabled={!isValid || isProcessing}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.completeButtonText,
                                    (!isValid || isProcessing) &&
                                        styles.completeButtonTextDisabled,
                                ]}
                            >
                                {isProcessing ? "Обработка..." : "Завершить"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardView: { flex: 1 },

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
        justifyContent: "center",
        alignItems: "center",
    },
    backIcon: { color: "#fff", fontSize: 24, fontWeight: "600" },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        letterSpacing: -0.24,
        lineHeight: 28,
    },
    headerSpacer: { width: 28, height: 28 },

    scrollView: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
        gap: 28,
    },

    section: { gap: 16 },
    sectionTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },

    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
    },
    loadingText: { color: "rgba(255, 255, 255, 0.5)", fontSize: 14 },
    emptyText: { color: "rgba(255, 255, 255, 0.5)", fontSize: 15 },

    paymentMethodsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    paymentMethodButton: {
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: "rgba(35, 35, 36, 1)",
        justifyContent: "center",
        alignItems: "center",
    },
    paymentMethodButtonActive: { backgroundColor: "#20C774" },
    paymentMethodText: {
        color: "#797A80",
        fontSize: 16,
        fontWeight: "400",
        letterSpacing: -0.24,
        textAlign: "center",
    },
    paymentMethodTextActive: { color: "#fff", fontWeight: "500" },

    bottomSection: {
        backgroundColor: "rgba(25, 25, 26, 0.85)",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    bottomContent: {
        width: "100%",
        maxWidth: 390,
        alignSelf: "center",
        gap: 16,
    },
    totalText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 24,
    },
    completeButton: {
        height: 44,
        borderRadius: 20,
        backgroundColor: "#20C774",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#20C774",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    completeButtonDisabled: {
        backgroundColor: "rgba(35, 35, 36, 1)",
        opacity: 0.5,
        shadowOpacity: 0,
        elevation: 0,
    },
    completeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        lineHeight: 24,
    },
    completeButtonTextDisabled: { color: "rgba(255, 255, 255, 0.4)" },
});
