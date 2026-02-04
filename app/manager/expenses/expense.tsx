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
import type {
    GetPayoutTypes,
    WarehouseDocumentsAccountsType,
} from "@/src/server/types/expenses";
import { DatePickerButton } from "@/src/client/components/form/DatePicker";
import { ReportCalendar } from "@/src/client/components/reports/Calendar";

export default function ExpenseScreen() {
    const router = useRouter();

    const {
        loading,
        locations,
        suppliers,
        accounts,
        payoutTypes,
        fetchSuppliersData,
        fetchAccountsData,
        fetchPayoutTypesData,
        addExpenseAction,
    } = useManager();
    console.log("accounts", accounts);

    useEffect(() => {
        // Fetch all required data on mount
        const fetchData = async () => {
            await Promise.all([
                fetchSuppliersData(),
                fetchAccountsData(),
                fetchPayoutTypesData(),
            ]);
        };
        fetchData();
    }, []);

    const [amount, setAmount] = useState("");
    const [comment, setComment] = useState("");
    const [date, setDate] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
        null,
    );
    const [selectedAccount, setSelectedAccount] =
        useState<WarehouseDocumentsAccountsType | null>(null);
    const [selectedPayoutType, setSelectedPayoutType] =
        useState<GetPayoutTypes | null>(null);
    const [selectedOrganization, setSelectedOrganization] = useState<any>(null);

    // Modal states
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showOrganizationModal, setShowOrganizationModal] = useState(false);
    const [showPayoutTypeModal, setShowPayoutTypeModal] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);

    // Lists
    const suppliersList = suppliers?.suppliers || [];
    const accountsList = accounts || [];
    const payoutTypesList = payoutTypes || [];
    const organizationsList = locations;

    // Handlers
    const handleSupplierSelect = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setShowSupplierModal(false);
    };

    const handleAccountSelect = (account: WarehouseDocumentsAccountsType) => {
        setSelectedAccount(account);
        setShowAccountModal(false);
    };

    const handlePayoutTypeSelect = (payoutType: GetPayoutTypes) => {
        setSelectedPayoutType(payoutType);
        setShowPayoutTypeModal(false);
    };

    const handleDateSelect = (selectedDate: string) => {
        setDate(selectedDate);
        setShowCalendar(false);
    };

    // TODO добавить тип везде по manager у organization ManagerProvider etc
    const handleOrganizationSelect = (organization: any) => {
        setSelectedOrganization(organization);
        setShowOrganizationModal(false);
    };

    // Label getters
    const getSupplierLabel = () => {
        if (!selectedSupplier) return "Выбрать поставщика...";
        return selectedSupplier.name;
    };

    const getAccountLabel = () => {
        if (!selectedAccount) return "Выбрать счет...";
        return selectedAccount.name;
    };

    const getPayoutTypeLabel = () => {
        if (!selectedPayoutType) return "Выбрать тип выплаты...";
        return selectedPayoutType.account_name;
    };

    const getOrganizationIdLabel = () => {
        if (!selectedOrganization) return "Выбрать организацию";
        return selectedOrganization.name;
    };

    const handleSubmit = async () => {
        // Validation
        if (!date) {
            alert("Пожалуйста, выберите дату");
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
        if (!selectedAccount) {
            alert("Пожалуйста, выберите счет");
            return;
        }
        if (!selectedPayoutType) {
            alert("Пожалуйста, выберите тип выплаты");
            return;
        }
        if (!selectedOrganization) {
            alert("Пожалуйста, выберите организацию");
            return;
        }

        try {
            await addExpenseAction({
                organization_id: selectedOrganization.id,
                expense_type: selectedPayoutType.id,
                amount: parseFloat(amount),
                date: date,
                comment: comment || "",
                account_id: String(selectedAccount.id),
            });

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

    // Supplier Picker
    const renderSupplierPicker = () => (
        <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowSupplierModal(true)}
            disabled={loading}
        >
            <Text
                style={[
                    styles.pickerText,
                    !selectedSupplier && styles.pickerPlaceholder,
                ]}
                numberOfLines={1}
            >
                {getSupplierLabel()}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>
    );

    // Account Picker
    const renderAccountPicker = () => (
        <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowAccountModal(true)}
            disabled={loading}
        >
            <Text
                style={[
                    styles.pickerText,
                    !selectedAccount && styles.pickerPlaceholder,
                ]}
                numberOfLines={1}
            >
                {getAccountLabel()}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>
    );

    // Payout Type Picker
    const renderPayoutTypePicker = () => (
        <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowPayoutTypeModal(true)}
            disabled={loading}
        >
            <Text
                style={[
                    styles.pickerText,
                    !selectedPayoutType && styles.pickerPlaceholder,
                ]}
                numberOfLines={1}
            >
                {getPayoutTypeLabel()}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>
    );

    // Organization Picker
    const renderOrganizationPicker = () => (
        <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowOrganizationModal(true)}
            disabled={loading}
        >
            <Text
                style={[
                    styles.pickerText,
                    !selectedPayoutType && styles.pickerPlaceholder,
                ]}
                numberOfLines={1}
            >
                {getOrganizationIdLabel()}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>
    );

    // Supplier Modal
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

    // Account Modal
    const renderAccountModal = () => (
        <Modal
            visible={showAccountModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowAccountModal(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowAccountModal(false)}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Выберите счет</Text>
                    </View>
                    <FlatList
                        data={accountsList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    item.id === selectedAccount?.id &&
                                        styles.modalItemSelected,
                                ]}
                                onPress={() => handleAccountSelect(item)}
                            >
                                <View style={styles.modalItemContent}>
                                    <Text
                                        style={[
                                            styles.modalItemText,
                                            item.id === selectedAccount?.id &&
                                                styles.modalItemTextSelected,
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    {item.code && (
                                        <Text style={styles.modalItemSubtext}>
                                            Код: {item.code} • Тип: {item.type}
                                        </Text>
                                    )}
                                </View>
                                {item.id === selectedAccount?.id && (
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
                                    Нет доступных счетов
                                </Text>
                            </View>
                        }
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const renderOrganizationModal = () => (
        <Modal
            visible={showOrganizationModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowOrganizationModal(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowOrganizationModal(false)}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Выберите счет</Text>
                    </View>
                    <FlatList
                        data={organizationsList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    item.id === selectedOrganization?.id &&
                                        styles.modalItemSelected,
                                ]}
                                onPress={() => handleOrganizationSelect(item)}
                            >
                                <View style={styles.modalItemContent}>
                                    <Text
                                        style={[
                                            styles.modalItemText,
                                            item.id ===
                                                selectedOrganization?.id &&
                                                styles.modalItemTextSelected,
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    {item.code && (
                                        <Text style={styles.modalItemSubtext}>
                                            Код: {item.code} • Тип: {item.type}
                                        </Text>
                                    )}
                                </View>
                                {item.id === selectedOrganization?.id && (
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
                                    Нет доступных счетов
                                </Text>
                            </View>
                        }
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    // Payout Type Modal
    const renderPayoutTypeModal = () => (
        <Modal
            visible={showPayoutTypeModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowPayoutTypeModal(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowPayoutTypeModal(false)}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            Выберите тип выплаты
                        </Text>
                    </View>
                    <FlatList
                        data={payoutTypesList}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    item.id === selectedPayoutType?.id &&
                                        styles.modalItemSelected,
                                ]}
                                onPress={() => handlePayoutTypeSelect(item)}
                            >
                                <View style={styles.modalItemContent}>
                                    <Text
                                        style={[
                                            styles.modalItemText,
                                            item.id ===
                                                selectedPayoutType?.id &&
                                                styles.modalItemTextSelected,
                                        ]}
                                    >
                                        {item.account_name}
                                    </Text>
                                    {item.chief_account_name && (
                                        <Text style={styles.modalItemSubtext}>
                                            {item.chief_account_name}
                                        </Text>
                                    )}
                                    {item.comment && (
                                        <Text style={styles.modalItemSubtext}>
                                            {item.comment}
                                        </Text>
                                    )}
                                </View>
                                {item.id === selectedPayoutType?.id && (
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
                                    Нет доступных типов выплат
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

            <FormField label="Организация">
                {renderOrganizationPicker()}
            </FormField>

            <FormField label="Поставщик">{renderSupplierPicker()}</FormField>

            <FormField label="Счет">{renderAccountPicker()}</FormField>

            <FormField label="Тип выплаты">
                {renderPayoutTypePicker()}
            </FormField>

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

            {/* Modals */}
            {renderSupplierModal()}
            {renderAccountModal()}
            {renderPayoutTypeModal()}
            {renderOrganizationModal()}

            {/* Calendar Modal */}
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

    // Picker Button (unified for all pickers)
    pickerButton: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    pickerText: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    pickerPlaceholder: {
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
