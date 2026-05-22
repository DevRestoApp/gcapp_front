import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useManager } from "@/src/contexts/ManagerProvider";

import { FormContainer } from "@/src/client/components/form/FormContainer";
import { FormField } from "@/src/client/components/form/FormFields";
import { OptionPicker } from "@/src/client/components/form/OptionPicker";
import { EmployeePicker } from "@/src/client/components/form/EmployeePicker";
import { CommentInput } from "@/src/client/components/form/Comment";
import { NumberInput } from "@/src/client/components/form/NumberInput";
import { ReportHeader } from "@/src/client/components/reports/header";
import Loading from "@/src/client/components/Loading";

import type { GetPayoutTypes } from "@/src/server/types/expenses";
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
        employees,
        fetchSuppliersData,
        fetchAccountsData,
        fetchPayoutTypesData,
        fetchEmployeesDataWrapper,
        addExpenseAction,
    } = useManager();

    useEffect(() => {
        // Fetch all required data on mount
        const fetchData = async () => {
            await Promise.all([
                fetchSuppliersData(),
                fetchAccountsData(),
                fetchPayoutTypesData(),
                fetchEmployeesDataWrapper({}),
            ]);
        };
        fetchData();
    }, []);

    const [amount, setAmount] = useState("");
    const [comment, setComment] = useState("");
    const [date, setDate] = useState("");
    const [selectedCounteragentId, setSelectedCounteragentId] =
        useState<string>("");
    const [selectedAccountId, setSelectedAccountId] = useState<string>("");
    const [selectedPayoutTypeId, setSelectedPayoutTypeId] =
        useState<string>("");
    const [selectedOrganizationId, setSelectedOrganizationId] =
        useState<string>("");
    const [showCalendar, setShowCalendar] = useState(false);

    // Derived selected objects
    const suppliersList = suppliers?.suppliers || [];
    const accountsList = accounts || [];
    const payoutTypesList = payoutTypes || [];
    const organizationsList = locations;

    const selectedPayoutType =
        payoutTypesList.find((pt) => pt.id === selectedPayoutTypeId) || null;

    const counteragentType = selectedPayoutType?.counteragentType;

    const handlePayoutTypeChange = (value: string) => {
        setSelectedPayoutTypeId(value);
        setSelectedCounteragentId("");
    };

    const handleDateSelect = (selectedDate: string) => {
        setDate(selectedDate);
        setShowCalendar(false);
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
        if (!selectedPayoutTypeId) {
            alert("Пожалуйста, выберите тип выплаты");
            return;
        }
        if (!selectedOrganizationId) {
            alert("Пожалуйста, выберите организацию");
            return;
        }

        const body: any = {
            organization_id: selectedOrganizationId,
            expense_type: selectedPayoutTypeId,
            amount: parseFloat(amount),
            date: date,
            comment: comment || "",
        };

        if (selectedAccountId) {
            body.account_id = selectedAccountId;
        }

        if (selectedCounteragentId) {
            body.counteragent_id = selectedCounteragentId;
        }
        try {
            await addExpenseAction(body);

            router.push("/manager/expenses");
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Ошибка при добавлении расхода");
        }
    };

    const renderHeader = () => (
        <View style={styles.headerSection}>
            <ReportHeader
                title="Добавить изъятие"
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

    // Build counteragent picker based on type
    const renderCounteragentField = () => {
        if (counteragentType === "EMPLOYEE") {
            const employeeList = (employees || []).map((e) => ({
                id: String(e.id),
                name: e.name,
                role: e.role || "",
            }));
            return (
                <FormField label="Сотрудник">
                    <EmployeePicker
                        employees={employeeList}
                        value={selectedCounteragentId || null}
                        onChange={(emp) =>
                            setSelectedCounteragentId(String(emp.id))
                        }
                        placeholder="Выбрать сотрудника..."
                        showSearchInput={true}
                        modalTitle="Выберите сотрудника"
                        emptyText="Нет доступных сотрудников"
                    />
                </FormField>
            );
        }

        if (counteragentType === "SUPPLIER") {
            const supplierOptions = suppliersList.map((s) => ({
                label: s.name,
                value: String(s.id),
                subtitle: s.code ? `Код: ${s.code}` : undefined,
            }));
            return (
                <FormField label="Поставщик">
                    <OptionPicker
                        options={supplierOptions}
                        value={selectedCounteragentId}
                        onChange={setSelectedCounteragentId}
                        placeholder="Выбрать поставщика..."
                        showSearchInput={true}
                        modalTitle="Выберите поставщика"
                        emptyText="Нет доступных поставщиков"
                    />
                </FormField>
            );
        }

        return null;
    };

    const renderForm = () => {
        const payoutTypeOptions = payoutTypesList.map((pt) => ({
            label: pt.account_name,
            value: pt.id,
            subtitle:
                [pt.chief_account_name, pt.comment]
                    .filter(Boolean)
                    .join(" - ") || undefined,
        }));

        const organizationOptions = (organizationsList || []).map((org) => ({
            label: org.name,
            value: String(org.id),
        }));

        return (
            <FormContainer
                title="Добавить изъятия"
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
                    <OptionPicker
                        options={organizationOptions}
                        value={selectedOrganizationId}
                        onChange={setSelectedOrganizationId}
                        placeholder="Выбрать организацию"
                        modalTitle="Выберите организацию"
                        emptyText="Нет доступных организаций"
                    />
                </FormField>

                <FormField label="Тип выплаты">
                    <OptionPicker
                        options={payoutTypeOptions}
                        value={selectedPayoutTypeId}
                        onChange={handlePayoutTypeChange}
                        placeholder="Выбрать тип выплаты..."
                        showSearchInput={true}
                        modalTitle="Выберите тип выплаты"
                        emptyText="Нет доступных типов выплат"
                    />
                </FormField>

                {renderCounteragentField()}

                {/*<FormField label="Счет">{renderAccountPicker()}</FormField>*/}

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
    };

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
                keyboardShouldPersistTaps="handled"
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
});
