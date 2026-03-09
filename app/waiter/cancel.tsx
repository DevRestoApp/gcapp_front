import React, { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useWaiter } from "@/src/contexts/WaiterProvider";

// ============================================================================
// Constants
// ============================================================================

const CANCEL_REASONS = [
    "Долгое ожидание",
    "Изменились планы",
    "Ошиблись при заказе",
    "Нет в наличии",
];

// ============================================================================
// Component
// ============================================================================

export default function CancelScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { cancelOrderWrapper } = useWaiter();

    const orderId = Number(params.orderId);

    const [selectedReason, setSelectedReason] = useState<string>(
        CANCEL_REASONS[0],
    );
    const [isProcessing, setIsProcessing] = useState(false);

    // ========================================================================
    // Handlers
    // ========================================================================

    const handleCancelOrder = useCallback(async () => {
        setIsProcessing(true);
        try {
            await cancelOrderWrapper(orderId, selectedReason);
            router.push("/waiter");
        } catch {
            // TODO: show error toast/banner
        } finally {
            setIsProcessing(false);
        }
    }, [orderId, cancelOrderWrapper, router]);

    // ========================================================================
    // Render
    // ========================================================================

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <View style={styles.mainContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Причина</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Reasons */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Причина отмены заказа
                        </Text>
                        <View style={styles.reasonsContainer}>
                            {CANCEL_REASONS.map((reason) => {
                                const isSelected = selectedReason === reason;
                                return (
                                    <TouchableOpacity
                                        key={reason}
                                        onPress={() =>
                                            setSelectedReason(reason)
                                        }
                                        style={[
                                            styles.reasonButton,
                                            isSelected &&
                                                styles.reasonButtonActive,
                                        ]}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={[
                                                styles.reasonText,
                                                isSelected &&
                                                    styles.reasonTextActive,
                                            ]}
                                        >
                                            {reason}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom */}
                <View style={styles.bottomSection}>
                    <View style={styles.bottomContent}>
                        <TouchableOpacity
                            style={[
                                styles.cancelButton,
                                isProcessing && styles.cancelButtonDisabled,
                            ]}
                            onPress={handleCancelOrder}
                            disabled={isProcessing}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>
                                {isProcessing ? "Отмена..." : "Отменить заказ"}
                            </Text>
                        </TouchableOpacity>
                    </View>
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
    mainContent: { flex: 1 },

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

    reasonsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    reasonButton: {
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: "rgba(35, 35, 36, 1)",
        justifyContent: "center",
        alignItems: "center",
    },
    reasonButtonActive: { backgroundColor: "#fff" },
    reasonText: {
        color: "#797A80",
        fontSize: 16,
        fontWeight: "400",
        letterSpacing: -0.24,
        textAlign: "center",
    },
    reasonTextActive: { color: "#2C2D2E", fontWeight: "500" },

    bottomSection: {
        backgroundColor: "rgba(25, 25, 26, 0.85)",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
        minHeight: 158,
        justifyContent: "center",
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    bottomContent: { width: "100%", maxWidth: 390, alignSelf: "center" },
    cancelButton: {
        height: 44,
        borderRadius: 20,
        backgroundColor: "rgba(237, 10, 52, 0.08)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(237, 10, 52, 0.2)",
    },
    cancelButtonDisabled: { opacity: 0.5 },
    cancelButtonText: {
        color: "#EE1E44",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        lineHeight: 24,
    },
});
