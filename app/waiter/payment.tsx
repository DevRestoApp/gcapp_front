import React, { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

interface PaymentScreenProps {
    totalBill?: number;
    onPaymentComplete?: (paymentMethod: string, tipAmount: number) => void;
    onCancel?: () => void;
}

export default function PaymentScreen({
    totalBill = 16800,
    onPaymentComplete,
    onCancel,
}: PaymentScreenProps) {
    const router = useRouter();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
        string | null
    >(null);
    const [tipAmount, setTipAmount] = useState("");

    const paymentMethods = [
        "Банковские карты",
        "Наличные",
        "Kaspi QR",
        "Kaspi Red",
        "Halyk Bank",
    ];

    // Calculate final amount
    const getFinalAmount = useCallback(() => {
        const tip = parseFloat(tipAmount) || 0;
        return totalBill + tip;
    }, [totalBill, tipAmount]);

    // Handle back navigation
    const handleBack = useCallback(() => {
        if (onCancel) {
            onCancel();
        } else {
            router.back();
        }
    }, [onCancel, router]);

    // Handle payment method selection
    const handlePaymentMethodSelect = useCallback((method: string) => {
        setSelectedPaymentMethod(method);
    }, []);

    // Handle tip input
    const handleTipChange = useCallback((text: string) => {
        // Only allow numbers
        const cleanedText = text.replace(/[^0-9]/g, "");
        setTipAmount(cleanedText);
    }, []);

    // Handle payment completion
    const handleComplete = useCallback(() => {
        if (!selectedPaymentMethod) {
            Alert.alert(
                "Выберите метод оплаты",
                "Пожалуйста, выберите способ оплаты для завершения",
                [{ text: "OK" }],
            );
            return;
        }

        const tip = parseFloat(tipAmount) || 0;
        const finalAmount = getFinalAmount();

        Alert.alert(
            "Подтвердите оплату",
            `Метод оплаты: ${selectedPaymentMethod}\nСчет: ${totalBill.toLocaleString()} тг\nЧаевые: ${tip.toLocaleString()} тг\nИтого: ${finalAmount.toLocaleString()} тг`,
            [
                {
                    text: "Отмена",
                    style: "cancel",
                },
                {
                    text: "Подтвердить",
                    onPress: () => {
                        onPaymentComplete?.(selectedPaymentMethod, tip);

                        Alert.alert(
                            "Оплата завершена",
                            `Оплачено: ${finalAmount.toLocaleString()} тг\nСпасибо!`,
                            [
                                {
                                    text: "OK",
                                    onPress: () => router.back(),
                                },
                            ],
                        );
                    },
                },
            ],
        );
    }, [
        selectedPaymentMethod,
        tipAmount,
        totalBill,
        getFinalAmount,
        onPaymentComplete,
        router,
    ]);

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

            <Text style={styles.headerTitle}>Оплата</Text>

            <View style={styles.headerSpacer} />
        </View>
    );

    // Render payment methods section
    const renderPaymentMethods = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Оплата</Text>

            <View style={styles.paymentMethodsContainer}>
                {paymentMethods.map((method) => {
                    const isSelected = selectedPaymentMethod === method;

                    return (
                        <TouchableOpacity
                            key={method}
                            onPress={() => handlePaymentMethodSelect(method)}
                            style={[
                                styles.paymentMethodButton,
                                isSelected && styles.paymentMethodButtonActive,
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
                                {method}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );

    // Render tips section
    const renderTipsSection = () => (
        <View style={styles.section}>
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
        </View>
    );

    // Render bottom section
    const renderBottomSection = () => {
        const finalAmount = getFinalAmount();
        const isValid = selectedPaymentMethod !== null;

        return (
            <View style={styles.bottomSection}>
                <View style={styles.bottomContent}>
                    <Text style={styles.totalText}>
                        Общий счет: {finalAmount.toLocaleString()} тг
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.completeButton,
                            !isValid && styles.completeButtonDisabled,
                        ]}
                        onPress={handleComplete}
                        disabled={!isValid}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.completeButtonText,
                                !isValid && styles.completeButtonTextDisabled,
                            ]}
                        >
                            Завершить
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={{ ...styles.container, ...backgroundsStyles.generalBg }}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {renderHeader()}

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {renderPaymentMethods()}
                    {renderTipsSection()}
                </ScrollView>

                {renderBottomSection()}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
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

    // Payment methods styles
    paymentMethodsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    paymentMethodButton: {
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: "rgba(35, 35, 36, 1)",
        justifyContent: "center",
        alignItems: "center",
    },
    paymentMethodButtonActive: {
        backgroundColor: "#20C774",
    },
    paymentMethodText: {
        color: "#797A80",
        fontSize: 16,
        fontWeight: "400",
        letterSpacing: -0.24,
        textAlign: "center",
    },
    paymentMethodTextActive: {
        color: "#fff",
        fontWeight: "500",
    },

    // Tips input styles
    inputContainer: {
        position: "relative",
        height: 44,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderWidth: 0.5,
        borderColor: "rgba(0, 0, 0, 0.12)",
        justifyContent: "center",
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingRight: 40,
        color: "#fff",
        fontSize: 16,
        fontWeight: "400",
        letterSpacing: -0.32,
        lineHeight: 20,
    },
    inputSuffix: {
        position: "absolute",
        right: 12,
        color: "#797A80",
        fontSize: 16,
        fontWeight: "400",
    },
    tipHint: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 14,
        marginTop: 4,
        marginLeft: 4,
    },

    // Bottom section styles
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
    completeButtonTextDisabled: {
        color: "rgba(255, 255, 255, 0.4)",
    },
});
