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
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { useManager } from "@/src/contexts/ManagerProvider";

import { FormContainer } from "@/src/client/components/form/FormContainer";
import { FormField } from "@/src/client/components/form/FormFields";
import { ReportHeader } from "@/src/client/components/reports/header";
import Loading from "@/src/client/components/Loading";
import { Ionicons } from "@expo/vector-icons";

interface Employee {
    id: number | string;
    name: string;
    role: string;
}

export default function ChangePasswordScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const currentUserRole = params.role;

    const {
        loading,
        employees,
        fetchEmployeesDataWrapper,
        queryInputs,
        changePasswordWrapper,
    } = useManager();

    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null,
    );
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);

    useEffect(() => {
        fetchEmployeesDataWrapper(queryInputs);
    }, []);

    useEffect(() => {
        if (!employees) return;
        const filtered =
            currentUserRole === "ceo"
                ? employees
                : employees.filter((e) => e.role === "waiter");
        setFilteredEmployees(filtered as Employee[]);
    }, [employees, currentUserRole]);

    const getEmployeeLabel = () => {
        if (!selectedEmployee) return "Выбрать сотрудника...";
        return selectedEmployee.name;
    };

    const handleEmployeeSelect = (employee: Employee) => {
        setSelectedEmployee(employee);
        setShowEmployeeModal(false);
    };

    const handleSubmit = async () => {
        if (!selectedEmployee) {
            alert("Пожалуйста, выберите сотрудника");
            return;
        }
        if (!newPassword || newPassword.length < 4) {
            alert("Пароль должен содержать минимум 4 символа");
            return;
        }

        try {
            await changePasswordWrapper({
                employee_id: selectedEmployee.id,
                new_password: newPassword,
            });
            alert("Пароль успешно изменён");
            router.back();
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Ошибка при смене пароля");
        }
    };

    const renderEmployeePicker = () => (
        <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowEmployeeModal(true)}
            disabled={loading}
        >
            <Text
                style={[
                    styles.pickerText,
                    !selectedEmployee && styles.pickerPlaceholder,
                ]}
                numberOfLines={1}
            >
                {getEmployeeLabel()}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
        </TouchableOpacity>
    );

    const renderPasswordInput = () => (
        <View style={styles.passwordContainer}>
            <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Введите новый пароль"
                placeholderTextColor="#797A80"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
            >
                <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#797A80"
                />
            </TouchableOpacity>
        </View>
    );

    const renderEmployeeModal = () => (
        <Modal
            visible={showEmployeeModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowEmployeeModal(false)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowEmployeeModal(false)}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            Выберите сотрудника
                        </Text>
                    </View>
                    <FlatList
                        data={filteredEmployees}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    item.id === selectedEmployee?.id &&
                                        styles.modalItemSelected,
                                ]}
                                onPress={() => handleEmployeeSelect(item)}
                            >
                                <View style={styles.modalItemContent}>
                                    <Text
                                        style={[
                                            styles.modalItemText,
                                            item.id === selectedEmployee?.id &&
                                                styles.modalItemTextSelected,
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text style={styles.modalItemSubtext}>
                                        {item.role}
                                    </Text>
                                </View>
                                {item.id === selectedEmployee?.id && (
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
                                    Нет доступных сотрудников
                                </Text>
                            </View>
                        }
                    />
                </View>
            </TouchableOpacity>
        </Modal>
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
                        <View style={styles.headerSection}>
                            <ReportHeader
                                title="Сменить пароль"
                                date={""}
                                period={""}
                                location={""}
                                onBack={() => router.push("/manager/profile")}
                                onDateChange={() => {}}
                                onPeriodChange={() => {}}
                                onLocationChange={() => {}}
                                organizations={[]}
                                showPeriodSelector={false}
                                showDateSelector={false}
                                showLocationSelector={false}
                            />
                        </View>

                        <FormContainer
                            title="Смена пароля"
                            description="Выберите сотрудника и введите новый пароль"
                            onSubmit={handleSubmit}
                            submitText="Сохранить"
                        >
                            <FormField label="Сотрудник">
                                {renderEmployeePicker()}
                            </FormField>

                            <FormField label="Новый пароль">
                                {renderPasswordInput()}
                            </FormField>
                        </FormContainer>
                    </>
                )}
            </ScrollView>

            {renderEmployeeModal()}
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
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    passwordInput: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    eyeButton: {
        paddingLeft: 8,
    },
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
