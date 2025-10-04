import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Alert,
} from "react-native";

interface CancelReasonScreenProps {
    orderId?: string;
    orderDetails?: {
        table?: string;
        totalAmount?: number;
    };
    onCancelConfirm?: (reason: string) => void;
    onBack?: () => void;
}

export default function CancelScreen({
    orderId,
    orderDetails,
    onCancelConfirm,
    onBack,
}: CancelReasonScreenProps) {
    const router = useRouter();

    const [selectedReason, setSelectedReason] =
        useState<string>("Долгое ожидание");

    const reasons = [
        "Долгое ожидание",
        "Изменились планы",
        "Ошиблись при заказе",
        "Нет в наличии",
    ];

    // Handle back navigation
    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    }, [onBack, router]);

    // Handle reason selection
    const handleReasonSelect = useCallback((reason: string) => {
        setSelectedReason(reason);
    }, []);

    // Handle order cancellation
    const handleCancelOrder = useCallback(() => {
        const orderInfo = orderDetails
            ? `\nСтол: ${orderDetails.table || "Не указан"}\nСумма: ${orderDetails.totalAmount?.toLocaleString() || "0"} тг`
            : "";

        Alert.alert(
            "Подтвердите отмену",
            `Вы уверены, что хотите отменить заказ?${orderInfo}\n\nПричина: ${selectedReason}`,
            [
                {
                    text: "Нет",
                    style: "cancel",
                },
                {
                    text: "Да, отменить",
                    style: "destructive",
                    onPress: () => {
                        console.log(
                            "Cancelling order with reason:",
                            selectedReason,
                        );

                        // Call the callback if provided
                        onCancelConfirm?.(selectedReason);

                        // Show success message
                        Alert.alert("Заказ отменен", "Заказ успешно отменен", [
                            {
                                text: "OK",
                                onPress: () => {
                                    // Navigate back to payment or main screen
                                    router.back();
                                },
                            },
                        ]);
                    },
                },
            ],
        );
    }, [selectedReason, orderDetails, onCancelConfirm, router]);

    // Render header
    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
            >
                <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Причина</Text>

            <View style={styles.headerSpacer} />
        </View>
    );

    // Render reasons section
    const renderReasonsSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Причина отмены заказа</Text>

            <View style={styles.reasonsContainer}>
                {reasons.map((reason) => {
                    const isSelected = selectedReason === reason;

                    return (
                        <TouchableOpacity
                            key={reason}
                            onPress={() => handleReasonSelect(reason)}
                            style={[
                                styles.reasonButton,
                                isSelected && styles.reasonButtonActive,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.reasonText,
                                    isSelected && styles.reasonTextActive,
                                ]}
                            >
                                {reason}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    // Render bottom section
    const renderBottomSection = () => (
        <View style={styles.bottomSection}>
            <View style={styles.bottomContent}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelOrder}
                    activeOpacity={0.8}
                >
                    <Text style={styles.cancelButtonText}>Отменить заказ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <View style={styles.mainContent}>
                {renderHeader()}

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {renderReasonsSection()}
                </ScrollView>

                {renderBottomSection()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(25, 25, 26, 1)",
    },
    mainContent: {
        flex: 1,
    },

    // Header styles
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
    backIcon: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "600",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        letterSpacing: -0.24,
        lineHeight: 28,
    },
    headerSpacer: {
        width: 28,
        height: 28,
    },

    // Scroll view styles
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
        gap: 28,
    },

    // Section styles
    section: {
        gap: 16,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        lineHeight: 28,
    },

    // Reasons styles
    reasonsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    reasonButton: {
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: "rgba(35, 35, 36, 1)",
        justifyContent: "center",
        alignItems: "center",
    },
    reasonButtonActive: {
        backgroundColor: "#fff",
    },
    reasonText: {
        color: "#797A80",
        fontSize: 16,
        fontWeight: "400",
        letterSpacing: -0.24,
        textAlign: "center",
    },
    reasonTextActive: {
        color: "#2C2D2E",
        fontWeight: "500",
    },

    // Bottom section styles
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
    bottomContent: {
        width: "100%",
        maxWidth: 390,
        alignSelf: "center",
    },
    cancelButton: {
        height: 44,
        borderRadius: 20,
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
});
