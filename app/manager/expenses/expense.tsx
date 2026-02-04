import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Modal,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useManager } from "@/src/contexts/ManagerProvider";

import { FormContainer } from "@/src/client/components/form/FormContainer";
import { FormField } from "@/src/client/components/form/FormFields";
import { OptionPicker } from "@/src/client/components/form/OptionPicker";
import { CommentInput } from "@/src/client/components/form/Comment";
import { NumberInput } from "@/src/client/components/form/NumberInput";
import { ReportHeader } from "@/src/client/components/reports/header";
import Loading from "@/src/client/components/Loading";
import { Ionicons } from "@expo/vector-icons";

import type { Supplier } from "@/src/server/types/expenses";
import { DatePickerButton } from "@/src/client/components/form/DatePicker";
import { ReportCalendar } from "@/src/client/components/reports/Calendar";

const CATEGORY_OPTIONS = [
    { label: "Аренда", value: "rent" },
    { label: "Зарплата", value: "salary" },
    { label: "Ком. услуга", value: "utility" },
    { label: "Товары", value: "goods" },
    { label: "Другое", value: "other" },
];

export default function ExpenseScreen() {
    const router = useRouter();

    const {
        loading,
        locations,
        suppliers,
        fetchSuppliersData,
        addExpenseAction,
    } = useManager();

    useEffect(() => {
        fetchSuppliersData();
    }, []);

    // Form states
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [comment, setComment] = useState("");
    const [date, setDate] = useState(""); // This will be in format "DD.MM.YYYY"
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        null,
    );
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    const suppliersList = suppliers?.suppliers || [];

    const handleSupplierSelect = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setShowSupplierModal(false);
    };

    const getSupplierLabel = () => {
        if (!selectedSupplier) return "Выбрать поставщика...";
        return selectedSupplier.name;
    };

    // Handle date selection from calendar
    const handleDateSelect = (selectedDate: string) => {
        setDate(selectedDate); // selectedDate is already in "DD.MM.YYYY" format
        setShowCalendar(false);
    };

    const handleSubmit = async () => {
        // Validation
        if (!date) {
            alert("Пожалуйста, выберите дату");
            return;
        }
        if (!category) {
            alert("Пожалуйста, выберите категорию");
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            alert("Пожалуйста, введите корректную сумму");
            return;
        }
        if (!selectedSupplier) {
            alert("Пожалуйста, выберите поставщика");
            return;
        }

        try {
            await addExpenseAction({
                expense_type: category,
                amount: parseFloat(amount),
                date: date,
                comment: comment || "",
                supplier_id: selectedSupplier.id,
                organization_id: null, // or get from context if needed
            });

            // Navigate back on success
            router.push("/manager/expenses");
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Ошибка при добавлении расхода");
        }
    };

    const renderHeader = () => (
        <View style={styles.headerSection}>
            <ReportHeader
                title="Добавить расход"
                date={""}
                period={""}
                location={""}
                onBack={() => router.push("/manager/expenses")}
                onDateChange={() => {}}
                onPeriodChange={() => {}}
                onLocationChange={() => {}}
                organizations={[]}
                showPeriodSelector={false}
                showDateSelector={false}
                showLocationSelector={false}
            />
        </View>
    );

    const renderSupplierPicker = () => (
        <TouchableOpacity
            style={styles.supplierPickerButton}
            onPress={() => setShowSupplierModal(true)}
            disabled={loading}
        >
            <Text
                style={[
                    styles.supplierPickerText,
                    !selectedSupplier && styles.supplierPickerPlaceholder,
                ]}
                numberOfLines={1}
            >
                {getSupplierLabel()}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>
    );

    const renderSupplierModal = () => (
        <Modal
            visible={showSupplierModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowSupplierModal(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowSupplierModal(false)}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            Выберите поставщика
                        </Text>
                    </View>
                    <FlatList
                        data={suppliersList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    item.id === selectedSupplier?.id &&
                                        styles.modalItemSelected,
                                ]}
                                onPress={() => handleSupplierSelect(item)}
                            >
                                <View style={styles.modalItemContent}>
                                    <Text
                                        style={[
                                            styles.modalItemText,
                                            item.id === selectedSupplier?.id &&
                                                styles.modalItemTextSelected,
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    {item.code && (
                                        <Text style={styles.modalItemSubtext}>
                                            Код: {item.code}
                                        </Text>
                                    )}
                                </View>
                                {item.id === selectedSupplier?.id && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    Нет доступных поставщиков
                                </Text>
                            </View>
                        }
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const renderForm = () => (
        <FormContainer
            title="Добавить расходы"
            description="Заполните нужную информацию"
            onSubmit={handleSubmit}
            submitText="Сохранить"
        >
            <FormField label="Дата">
                <DatePickerButton
                    value={date}
                    onPress={() => setShowCalendar(true)}
                    placeholder="Выберите дату"
                />
            </FormField>

            <FormField label="Категория">
                <OptionPicker
                    options={CATEGORY_OPTIONS}
                    value={category}
                    onChange={setCategory}
                    placeholder="Выберите статью"
                />
            </FormField>

            <FormField label="Поставщик">{renderSupplierPicker()}</FormField>

            <FormField label="Сумма">
                <NumberInput
                    value={amount}
                    onChange={setAmount}
                    placeholder="Введите сумму"
                    currency="тг"
                    maxLength={20}
                />
            </FormField>

            <FormField label="Комментарий">
                <CommentInput
                    value={comment}
                    onChange={setComment}
                    placeholder="Напишите комментарий"
                />
            </FormField>
        </FormContainer>
    );

    return (
        <SafeAreaView style={[styles.container, backgroundsStyles.generalBg]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="rgba(25, 25, 26, 1)"
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <Loading text="Загрузка данных" />
                ) : (
                    <>
                        {renderHeader()}
                        {renderForm()}
                    </>
                )}
            </ScrollView>
            {renderSupplierModal()}

            {/* Calendar Modal - Fixed Implementation */}
            <ReportCalendar
                visible={showCalendar}
                onClose={() => setShowCalendar(false)}
                onDateSelect={handleDateSelect}
                initialDate={date || undefined}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#19191A",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 128,
    },
    headerSection: {
        gap: 16,
    },

    // Supplier Picker
    supplierPickerButton: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    supplierPickerText: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    supplierPickerPlaceholder: {
        color: "#797A80",
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1C1C1E",
        borderRadius: 20,
        width: "85%",
        maxHeight: "60%",
        overflow: "hidden",
    },
    modalHeader: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
    },
    modalTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    modalItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
    },
    modalItemSelected: {
        backgroundColor: "rgba(60, 130, 253, 0.1)",
    },
    modalItemContent: {
        flex: 1,
        gap: 4,
    },
    modalItemText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    modalItemTextSelected: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    modalItemSubtext: {
        color: "#797A80",
        fontSize: 14,
        lineHeight: 18,
    },
    emptyContainer: {
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        color: "#797A80",
        fontSize: 16,
        textAlign: "center",
    },
});
