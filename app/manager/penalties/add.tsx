import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";

import { CommentInput } from "@/src/client/components/form/Comment";
import { EmployeePicker } from "@/src/client/components/form/EmployeePicker";
import { useManager } from "@/src/contexts/ManagerProvider";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

interface Employee {
    id: string;
    name: string;
    role: string;
}

export default function AddPenaltyScreen() {
    const router = useRouter();
    const { employeeId } = useLocalSearchParams<{ employeeId?: string }>();
    const { employees, createFineAction } = useManager();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null,
    );
    const [reason, setReason] = useState("");
    const [amount, setAmount] = useState("");

    const safeEmployees = employees || [];

    useEffect(() => {
        if (employeeId) {
            const found = safeEmployees.find(
                (e) => String(e.id) === String(employeeId),
            );
            if (found) {
                setSelectedEmployee({
                    id: String(found.id),
                    name: found.name,
                    role: found.role || "",
                });
            }
        }
    }, [employeeId, employees]);

    const handleEmployeeSelect = useCallback(
        (employee: { id: string | number; name: string; role?: string }) => {
            setSelectedEmployee({
                id: String(employee.id),
                name: employee.name,
                role: employee.role || "",
            });
        },
        [],
    );

    const validateForm = useCallback((): boolean => {
        if (!selectedEmployee) {
            Alert.alert("Ошибка", "Пожалуйста, выберите сотрудника");
            return false;
        }
        if (!reason.trim()) {
            Alert.alert("Ошибка", "Пожалуйста, укажите причину штрафа");
            return false;
        }
        if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert(
                "Ошибка",
                "Пожалуйста, укажите корректную сумму штрафа",
            );
            return false;
        }
        return true;
    }, [selectedEmployee, reason, amount]);

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await createFineAction({
                employeeId: String(selectedEmployee!.id),
                employeeName: selectedEmployee!.name,
                reason: reason.trim(),
                amount: Number(amount),
                date: new Date().toISOString(),
            });

            router.back();
        } catch (error) {
            console.error("Failed to create fine:", error);
            Alert.alert("Ошибка", "Не удалось добавить штраф");
        } finally {
            setIsSubmitting(false);
        }
    }, [
        validateForm,
        selectedEmployee,
        reason,
        amount,
        createFineAction,
        router,
    ]);

    return (
        <SafeAreaView
            style={{ ...styles.container, ...backgroundsStyles.generalBg }}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                        >
                            <Path
                                d="M9.58992 14.8405C9.42578 14.6765 9.33346 14.4541 9.33325 14.2221V13.7788C9.33594 13.5473 9.42789 13.3258 9.58992 13.1605L15.5866 7.17548C15.6961 7.06505 15.8452 7.00293 16.0008 7.00293C16.1563 7.00293 16.3054 7.06505 16.4149 7.17548L17.2433 8.00381C17.353 8.11134 17.4148 8.25851 17.4148 8.41215C17.4148 8.56578 17.353 8.71295 17.2433 8.82048L12.0516 14.0005L17.2433 19.1805C17.3537 19.29 17.4158 19.4391 17.4158 19.5946C17.4158 19.7502 17.3537 19.8993 17.2433 20.0088L16.4149 20.8255C16.3054 20.9359 16.1563 20.998 16.0008 20.998C15.8452 20.998 15.6961 20.9359 15.5866 20.8255L9.58992 14.8405Z"
                                fill="white"
                            />
                        </Svg>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Добавить штраф</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Form */}
                <View style={styles.formSection}>
                    {/* Employee Picker */}
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>Сотрудник</Text>
                        <EmployeePicker
                            employees={safeEmployees}
                            value={
                                selectedEmployee
                                    ? String(selectedEmployee.id)
                                    : null
                            }
                            onChange={handleEmployeeSelect}
                            showSearchInput={true}
                        />
                    </View>

                    {/* Reason Input */}
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>Причина штрафа</Text>
                        <CommentInput
                            value={reason}
                            onChange={setReason}
                            placeholder="Укажите причину штрафа..."
                            maxLength={200}
                        />
                    </View>

                    {/* Amount Input */}
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>Сумма штрафа</Text>
                        <View style={styles.amountInputContainer}>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                placeholder="0"
                                placeholderTextColor="rgba(121, 122, 128, 1)"
                                keyboardType="numeric"
                                maxLength={20}
                                editable={!isSubmitting}
                            />
                            <Text style={styles.currencyLabel}>тг</Text>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.cancelButtonText}>Отмена</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            isSubmitting && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.submitButtonText,
                                isSubmitting && styles.submitButtonTextDisabled,
                            ]}
                        >
                            {isSubmitting ? "Отправляем..." : "Отправить"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 128,
    },
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
    headerSpacer: {
        width: 28,
        height: 28,
    },

    // Form
    formSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
        gap: 20,
    },
    inputSection: {
        gap: 8,
    },
    inputLabel: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 22,
    },

    // Amount Input
    amountInputContainer: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    amountInput: {
        color: "#ffffff",
        fontSize: 16,
        lineHeight: 22,
        flex: 1,
    },
    currencyLabel: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 16,
        lineHeight: 22,
        marginLeft: 8,
    },

    // Actions
    actions: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    cancelButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    cancelButtonText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 16,
        fontWeight: "500",
    },
    submitButton: {
        flex: 2,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    submitButtonDisabled: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "600",
    },
    submitButtonTextDisabled: {
        color: "rgba(255, 255, 255, 0.4)",
    },
});
