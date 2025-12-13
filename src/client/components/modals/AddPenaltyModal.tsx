import React, { useRef, useCallback, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";

// ============================================================================
// Types
// ============================================================================

interface Employee {
    id: string;
    name: string;
    role: string;
}

interface PenaltyFormData {
    employeeId: string;
    employeeName: string;
    reason: string;
    amount: number;
    date: string;
}

interface AddPenaltyModalProps {
    employees: Employee[];
    onAddPenalty?: (data: PenaltyFormData) => Promise<void> | void;
    onCancel?: () => void;
}

export type AddPenaltyModalRef = {
    open: () => void;
    close: () => void;
    isVisible: () => boolean;
};

// ============================================================================
// Component
// ============================================================================

const AddPenaltyModal = React.forwardRef<
    AddPenaltyModalRef,
    AddPenaltyModalProps
>(({ employees, onAddPenalty, onCancel }, ref) => {
    // ====================================================================
    // Refs
    // ====================================================================
    const modalRef = useRef<ModalWrapperRef>(null);

    // ====================================================================
    // State
    // ====================================================================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null,
    );
    const [reason, setReason] = useState("");
    const [amount, setAmount] = useState("");
    const [showEmployeePicker, setShowEmployeePicker] = useState(false);

    // ====================================================================
    // Imperative Handle
    // ====================================================================
    React.useImperativeHandle(ref, () => ({
        open: () => modalRef.current?.open(),
        close: () => modalRef.current?.close(),
        isVisible: () => modalRef.current?.isVisible() || false,
    }));

    // ====================================================================
    // Handlers
    // ====================================================================

    const resetForm = useCallback(() => {
        setSelectedEmployee(null);
        setReason("");
        setAmount("");
        setShowEmployeePicker(false);
        setIsSubmitting(false);
    }, []);

    const handleOpen = useCallback(() => {
        resetForm();
    }, [resetForm]);

    const handleClose = useCallback(() => {
        resetForm();
        onCancel?.();
        modalRef.current?.close();
    }, [resetForm, onCancel]);

    const handleEmployeeSelect = useCallback((employee: Employee) => {
        setSelectedEmployee(employee);
        setShowEmployeePicker(false);
    }, []);

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
            await onAddPenalty?.({
                employeeId: selectedEmployee!.id,
                employeeName: selectedEmployee!.name,
                reason: reason.trim(),
                amount: Number(amount),
                date: new Date().toISOString(),
            });

            // Close modal after successful submission
            handleClose();
        } catch (error) {
            console.error("Error adding penalty:", error);
            Alert.alert("Ошибка", "Не удалось добавить штраф");
        } finally {
            setIsSubmitting(false);
        }
    }, [
        validateForm,
        selectedEmployee,
        reason,
        amount,
        onAddPenalty,
        handleClose,
    ]);

    // ====================================================================
    // Render Functions
    // ====================================================================

    const renderCloseButton = () => (
        <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
        >
            <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <Text style={styles.title}>Добавить штраф</Text>
                {renderCloseButton()}
            </View>
        </View>
    );

    const renderEmployeePicker = () => (
        <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Сотрудник</Text>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowEmployeePicker(!showEmployeePicker)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.pickerButtonText,
                        !selectedEmployee && styles.pickerPlaceholder,
                    ]}
                >
                    {selectedEmployee
                        ? `${selectedEmployee.name} - ${selectedEmployee.role}`
                        : "Выберите сотрудника"}
                </Text>
                <Text style={styles.pickerArrow}>
                    {showEmployeePicker ? "▲" : "▼"}
                </Text>
            </TouchableOpacity>

            {showEmployeePicker && (
                <View style={styles.employeeList}>
                    <ScrollView
                        style={styles.employeeScrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        {employees.map((employee) => (
                            <TouchableOpacity
                                key={employee.id}
                                style={styles.employeeItem}
                                onPress={() => handleEmployeeSelect(employee)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.employeeName}>
                                    {employee.name}
                                </Text>
                                <Text style={styles.employeeRole}>
                                    {employee.role}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );

    const renderReasonInput = () => (
        <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Причина штрафа</Text>
            <TextInput
                style={styles.textInput}
                value={reason}
                onChangeText={setReason}
                placeholder="Укажите причину штрафа..."
                placeholderTextColor="rgba(121, 122, 128, 1)"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={200}
                editable={!isSubmitting}
            />
            <Text style={styles.characterCount}>{reason.length}/200</Text>
        </View>
    );

    const renderAmountInput = () => (
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
    );

    const renderActions = () => (
        <View style={styles.actions}>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
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
    );

    // ====================================================================
    // Main Render
    // ====================================================================

    return (
        <ModalWrapper
            ref={modalRef}
            onOpen={handleOpen}
            onClose={onCancel}
            animationType="scale"
            contentStyle={styles.modalContent}
        >
            <View style={styles.container}>
                {renderHeader()}
                <View style={styles.formSection}>
                    {renderEmployeePicker()}
                    {renderReasonInput()}
                    {renderAmountInput()}
                </View>
                {renderActions()}
            </View>
        </ModalWrapper>
    );
});

AddPenaltyModal.displayName = "AddPenaltyModal";
export default AddPenaltyModal;

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    modalContent: {
        padding: 0,
        maxHeight: "90%",
    },
    container: {
        padding: 20,
        gap: 24,
    },

    // Header
    header: {
        gap: 8,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 28,
        flex: 1,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(43, 43, 44, 1)",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 12,
    },
    closeButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },

    // Form
    formSection: {
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

    // Employee Picker
    pickerButton: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    pickerButtonText: {
        color: "#ffffff",
        fontSize: 16,
        lineHeight: 22,
        flex: 1,
    },
    pickerPlaceholder: {
        color: "rgba(121, 122, 128, 1)",
    },
    pickerArrow: {
        color: "#ffffff",
        fontSize: 12,
        marginLeft: 8,
    },
    employeeList: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        maxHeight: 200,
        marginTop: 4,
    },
    employeeScrollView: {
        padding: 8,
    },
    employeeItem: {
        padding: 12,
        borderRadius: 12,
        marginVertical: 2,
    },
    employeeName: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 20,
    },
    employeeRole: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 14,
        lineHeight: 18,
        marginTop: 2,
    },

    // Text Input
    textInput: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        padding: 16,
        color: "#ffffff",
        fontSize: 16,
        lineHeight: 22,
        minHeight: 80,
    },
    characterCount: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 12,
        textAlign: "right",
        marginTop: 4,
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
