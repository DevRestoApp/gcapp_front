import React, { useState, useCallback, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    Alert,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";

import MenuPicker, { MenuItem } from "@/src/client/components/form/MenuPicker";
import { ReportCalendar } from "@/src/client/components/reports/Calendar";
import { EmployeePicker } from "@/src/client/components/form/EmployeePicker";
import { OptionPicker } from "@/src/client/components/form/OptionPicker";
import SegmentedControl from "@/src/client/components/Tabs";

import { useManager } from "@/src/contexts/ManagerProvider";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

interface Employee {
    id: string | number;
    name: string;
    role?: string;
}

interface Location {
    id: string;
    name: string;
}

const getDefaultDuration = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export default function AddMotivationScreen() {
    const router = useRouter();
    const { tab } = useLocalSearchParams<{ tab?: string }>();
    const {
        employees,
        locations,
        createQuestAction,
        createTaskWrapper,
        refetch,
    } = useManager();

    const safeEmployees = employees || [];
    const insets = useSafeAreaInsets();

    const [activeTab, setActiveTab] = useState<"quest" | "task">(
        (tab as "quest" | "task") || "quest",
    );
    const tabs = [
        { label: "Квест", value: "quest" },
        { label: "Задача", value: "task" },
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Quest form fields
    const [questName, setQuestName] = useState("");
    const [questDescription, setQuestDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [reward, setReward] = useState("");
    const [durationDate, setDurationDate] =
        useState<string>(getDefaultDuration());
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(
        null,
    );
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
        null,
    );

    // Task form fields
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskDueDate, setTaskDueDate] =
        useState<string>(getDefaultDuration());
    const [taskSelectedEmployee, setTaskSelectedEmployee] =
        useState<Employee | null>(null);
    const [taskSelectedLocation, setTaskSelectedLocation] =
        useState<Location | null>(null);

    // UI state
    const [showEmployeePicker, setShowEmployeePicker] = useState(false);
    const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [showMenuPicker, setShowMenuPicker] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showTaskCalendar, setShowTaskCalendar] = useState(false);

    const selectedDate = new Date().toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    // Handlers
    const handleEmployeeToggle = useCallback((employee: Employee) => {
        setSelectedEmployees((prev) => {
            const isSelected = prev.some((emp) => emp.id === employee.id);
            return isSelected
                ? prev.filter((emp) => emp.id !== employee.id)
                : [...prev, employee];
        });
    }, []);

    const handleEmployeeRemove = useCallback((employeeId: string | number) => {
        setSelectedEmployees((prev) =>
            prev.filter((emp) => String(emp.id) !== String(employeeId)),
        );
    }, []);

    const filteredEmployees = useMemo(() => {
        if (!employeeSearchQuery.trim()) return safeEmployees;
        const query = employeeSearchQuery.toLowerCase().trim();
        return safeEmployees.filter(
            (emp) =>
                emp.name.toLowerCase().includes(query) ||
                (emp.role && emp.role.toLowerCase().includes(query)),
        );
    }, [safeEmployees, employeeSearchQuery]);

    const handleLocationSelect = useCallback((location: Location) => {
        setSelectedLocation(location);
        setShowLocationPicker(false);
    }, []);

    const handleMenuItemSelect = useCallback((item: MenuItem) => {
        setSelectedMenuItem(item);
    }, []);

    // Validation
    const validateQuestForm = useCallback((): boolean => {
        if (!questName.trim()) {
            Alert.alert("Ошибка", "Пожалуйста, укажите название квеста");
            return false;
        }
        if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert("Ошибка", "Пожалуйста, укажите корректное количество");
            return false;
        }
        if (!reward.trim() || isNaN(Number(reward)) || Number(reward) <= 0) {
            Alert.alert(
                "Ошибка",
                "Пожалуйста, укажите корректную сумму награды",
            );
            return false;
        }
        return true;
    }, [questName, amount, reward]);

    const validateTaskForm = useCallback((): boolean => {
        if (!taskTitle.trim()) {
            Alert.alert("Ошибка", "Пожалуйста, укажите название задачи");
            return false;
        }
        if (!taskDescription.trim()) {
            Alert.alert("Ошибка", "Пожалуйста, укажите описание задачи");
            return false;
        }
        if (!taskSelectedEmployee) {
            Alert.alert("Ошибка", "Пожалуйста, выберите сотрудника");
            return false;
        }
        if (!taskSelectedLocation) {
            Alert.alert("Ошибка", "Пожалуйста, выберите локацию");
            return false;
        }
        return true;
    }, [
        taskTitle,
        taskDescription,
        taskSelectedEmployee,
        taskSelectedLocation,
    ]);

    // Submit
    const handleSubmit = useCallback(async () => {
        if (activeTab === "quest") {
            if (!validateQuestForm()) return;

            setIsSubmitting(true);
            try {
                await createQuestAction({
                    title: questName.trim(),
                    description: questDescription.trim() || undefined,
                    reward: Number(reward),
                    target: Number(amount),
                    unit: selectedMenuItem?.name?.trim() ?? "",
                    totalEmployees: safeEmployees.length,
                    completedEmployees: 0,
                    employeeNames: [],
                    date: selectedDate,
                    durationDate: durationDate,
                });
                await refetch();
                router.back();
                setTimeout(
                    () => Alert.alert("Успешно", "Квест успешно создан"),
                    300,
                );
            } catch (error) {
                console.error("Failed to create quest:", error);
                Alert.alert("Ошибка", "Не удалось создать квест");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            if (!validateTaskForm()) return;

            setIsSubmitting(true);
            try {
                await createTaskWrapper({
                    title: taskTitle.trim(),
                    description: taskDescription.trim(),
                    employee_id:
                        Number(taskSelectedEmployee!.id) === 322256
                            ? 10
                            : Number(taskSelectedEmployee!.id),
                    organization_id: Number(taskSelectedLocation!.id),
                    due_date: taskDueDate,
                });
                await refetch();
                router.back();
                setTimeout(
                    () => Alert.alert("Успешно", "Задача успешно создана"),
                    300,
                );
            } catch (error) {
                console.error("Failed to create task:", error);
                Alert.alert("Ошибка", "Не удалось создать задачу");
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [
        activeTab,
        validateQuestForm,
        validateTaskForm,
        questName,
        questDescription,
        amount,
        reward,
        selectedMenuItem,
        durationDate,
        selectedEmployees,
        selectedLocation,
        selectedDate,
        safeEmployees.length,
        createQuestAction,
        taskTitle,
        taskDescription,
        taskSelectedEmployee,
        taskSelectedLocation,
        taskDueDate,
        createTaskWrapper,
        refetch,
        router,
    ]);

    // Render: Selected employees chips
    const renderSelectedEmployees = () => {
        if (selectedEmployees.length === 0) return null;
        return (
            <View style={styles.selectedEmployeesContainer}>
                {selectedEmployees.map((employee) => (
                    <View key={employee.id} style={styles.selectedEmployeeChip}>
                        <View style={styles.selectedEmployeeInfo}>
                            <Text style={styles.selectedEmployeeName}>
                                {employee.name}
                            </Text>
                            <Text style={styles.selectedEmployeeRole}>
                                {employee.role}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleEmployeeRemove(employee.id)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.removeEmployeeIcon}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    // Location options for OptionPicker
    const locationOptions = locations.map((loc) => ({
        label: loc.name,
        value: String(loc.id),
    }));

    // Render: Quest form
    const renderQuestForm = () => (
        <View style={styles.formSection}>
            {/* Quest Name */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Название квеста</Text>
                <TextInput
                    style={styles.textInput}
                    value={questName}
                    onChangeText={setQuestName}
                    placeholder="Введите название квеста..."
                    placeholderTextColor="rgba(121, 122, 128, 1)"
                    maxLength={100}
                    editable={!isSubmitting}
                />
                <Text style={styles.characterCount}>
                    {questName.length}/100
                </Text>
            </View>

            {/* Employees — multi-select with search modal */}
            {safeEmployees.length > 0 && (
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>
                        Сотрудники (опционально)
                    </Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => {
                            setShowEmployeePicker(true);
                            setEmployeeSearchQuery("");
                        }}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.pickerButtonText,
                                selectedEmployees.length === 0 &&
                                    styles.pickerPlaceholder,
                            ]}
                        >
                            {selectedEmployees.length > 0
                                ? `Выбрано: ${selectedEmployees.length}`
                                : "Выберите сотрудников"}
                        </Text>
                        <Text style={styles.pickerArrow}>▼</Text>
                    </TouchableOpacity>
                    {renderSelectedEmployees()}
                </View>
            )}

            {/* Location */}
            {locations.length > 0 && (
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Локация (опционально)</Text>
                    <OptionPicker
                        options={locationOptions}
                        value={
                            selectedLocation ? String(selectedLocation.id) : ""
                        }
                        onChange={(value) => {
                            const loc = locations.find(
                                (l) => String(l.id) === value,
                            );
                            if (loc) setSelectedLocation(loc);
                        }}
                        placeholder="Выберите локацию"
                        modalTitle="Выберите локацию"
                        emptyText="Нет доступных локаций"
                    />
                </View>
            )}

            {/* Amount */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Количество</Text>
                <View style={styles.amountInputContainer}>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={(text) =>
                            setAmount(text.replace(/[^0-9]/g, ""))
                        }
                        placeholder="0"
                        placeholderTextColor="rgba(121, 122, 128, 1)"
                        keyboardType="numeric"
                        maxLength={10}
                        editable={!isSubmitting}
                    />
                    <Text style={styles.currencyLabel}>ед</Text>
                </View>
            </View>

            {/* Menu item */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Товар</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => setShowMenuPicker(true)}
                    activeOpacity={0.7}
                    disabled={isSubmitting}
                >
                    {selectedMenuItem ? (
                        <View style={styles.selectedItemInfo}>
                            <Text style={styles.pickerButtonText}>
                                {selectedMenuItem.name}
                            </Text>
                            <Text style={styles.selectedItemPrice}>
                                {selectedMenuItem.price.toLocaleString("ru-RU")}{" "}
                                тг
                            </Text>
                        </View>
                    ) : (
                        <Text
                            style={[
                                styles.pickerButtonText,
                                styles.pickerPlaceholder,
                            ]}
                        >
                            Нажмите для выбора товара
                        </Text>
                    )}
                    <Text style={styles.pickerArrow}>▼</Text>
                </TouchableOpacity>
            </View>

            {/* Reward */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Награда</Text>
                <View style={styles.amountInputContainer}>
                    <TextInput
                        style={styles.amountInput}
                        value={reward}
                        onChangeText={(text) =>
                            setReward(text.replace(/[^0-9]/g, ""))
                        }
                        placeholder="0"
                        placeholderTextColor="rgba(121, 122, 128, 1)"
                        keyboardType="numeric"
                        maxLength={12}
                        editable={!isSubmitting}
                    />
                    <Text style={styles.currencyLabel}>тг</Text>
                </View>
            </View>

            {/* Duration */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Дата активности</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => {
                        setShowCalendar(!showCalendar);
                        setShowEmployeePicker(false);
                        setShowLocationPicker(false);
                    }}
                    activeOpacity={0.7}
                    disabled={isSubmitting}
                >
                    <Text
                        style={[
                            styles.pickerButtonText,
                            !durationDate && styles.pickerPlaceholder,
                        ]}
                    >
                        {durationDate || "Выберите дату"}
                    </Text>
                    <Text style={styles.pickerArrow}>
                        {showCalendar ? "▲" : "▼"}
                    </Text>
                </TouchableOpacity>
                {showCalendar && (
                    <ReportCalendar
                        visible={showCalendar}
                        onClose={() => setShowCalendar(false)}
                        onDateSelect={(value) => {
                            setDurationDate(value);
                            setShowCalendar(false);
                        }}
                    />
                )}
            </View>

            {/* Description */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Описание</Text>
                <TextInput
                    style={[styles.textInput, styles.textInputMultiline]}
                    value={questDescription}
                    onChangeText={setQuestDescription}
                    placeholder="Введите описание квеста..."
                    placeholderTextColor="rgba(121, 122, 128, 1)"
                    maxLength={300}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    editable={!isSubmitting}
                />
                <Text style={styles.characterCount}>
                    {questDescription.length}/300
                </Text>
            </View>
        </View>
    );

    // Render: Task form
    const renderTaskForm = () => (
        <View style={styles.formSection}>
            {/* Task Title */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Название задачи</Text>
                <TextInput
                    style={styles.textInput}
                    value={taskTitle}
                    onChangeText={setTaskTitle}
                    placeholder="Введите название задачи..."
                    placeholderTextColor="rgba(121, 122, 128, 1)"
                    maxLength={100}
                    editable={!isSubmitting}
                />
                <Text style={styles.characterCount}>
                    {taskTitle.length}/100
                </Text>
            </View>

            {/* Task Description */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Описание</Text>
                <TextInput
                    style={[styles.textInput, styles.textInputMultiline]}
                    value={taskDescription}
                    onChangeText={setTaskDescription}
                    placeholder="Введите описание задачи..."
                    placeholderTextColor="rgba(121, 122, 128, 1)"
                    maxLength={300}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    editable={!isSubmitting}
                />
                <Text style={styles.characterCount}>
                    {taskDescription.length}/300
                </Text>
            </View>

            {/* Task Employee */}
            {safeEmployees.length > 0 && (
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Сотрудник</Text>
                    <EmployeePicker
                        employees={safeEmployees}
                        value={
                            taskSelectedEmployee
                                ? String(taskSelectedEmployee.id)
                                : null
                        }
                        onChange={(employee) =>
                            setTaskSelectedEmployee(employee)
                        }
                        showSearchInput={true}
                    />
                </View>
            )}

            {/* Task Location */}
            {locations.length > 0 && (
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Локация</Text>
                    <OptionPicker
                        options={locationOptions}
                        value={
                            taskSelectedLocation
                                ? String(taskSelectedLocation.id)
                                : ""
                        }
                        onChange={(value) => {
                            const loc = locations.find(
                                (l) => String(l.id) === value,
                            );
                            if (loc) setTaskSelectedLocation(loc);
                        }}
                        placeholder="Выберите локацию"
                        modalTitle="Выберите локацию"
                        emptyText="Нет доступных локаций"
                    />
                </View>
            )}

            {/* Task Due Date */}
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Срок выполнения</Text>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => {
                        setShowTaskCalendar(!showTaskCalendar);
                    }}
                    activeOpacity={0.7}
                    disabled={isSubmitting}
                >
                    <Text
                        style={[
                            styles.pickerButtonText,
                            !taskDueDate && styles.pickerPlaceholder,
                        ]}
                    >
                        {taskDueDate || "Выберите дату"}
                    </Text>
                    <Text style={styles.pickerArrow}>
                        {showTaskCalendar ? "▲" : "▼"}
                    </Text>
                </TouchableOpacity>
                {showTaskCalendar && (
                    <ReportCalendar
                        visible={showTaskCalendar}
                        onClose={() => setShowTaskCalendar(false)}
                        onDateSelect={(value) => {
                            setTaskDueDate(value);
                            setShowTaskCalendar(false);
                        }}
                    />
                )}
            </View>
        </View>
    );

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
                    <Text style={styles.headerTitle}>
                        {activeTab === "quest"
                            ? "Создать квест"
                            : "Создать задачу"}
                    </Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.formContainer}>
                    <SegmentedControl
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(value) =>
                            setActiveTab(value as "quest" | "task")
                        }
                    />

                    {activeTab === "quest"
                        ? renderQuestForm()
                        : renderTaskForm()}

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
                                    isSubmitting &&
                                        styles.submitButtonTextDisabled,
                                ]}
                            >
                                {isSubmitting
                                    ? "Создаем..."
                                    : activeTab === "quest"
                                      ? "Создать квест"
                                      : "Создать задачу"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={showEmployeePicker}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setShowEmployeePicker(false);
                    setEmployeeSearchQuery("");
                }}
            >
                <KeyboardAvoidingView
                    style={styles.employeeModalOverlay}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View
                        style={[
                            styles.employeeModalContent,
                            { paddingTop: insets.top },
                        ]}
                    >
                        <View style={styles.employeeModalHeader}>
                            <Text style={styles.employeeModalTitle}>
                                Выберите сотрудников
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowEmployeePicker(false);
                                    setEmployeeSearchQuery("");
                                }}
                            >
                                <Text style={styles.employeeModalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.employeeSearchWrapper}>
                            <TextInput
                                value={employeeSearchQuery}
                                onChangeText={setEmployeeSearchQuery}
                                placeholder="Поиск сотрудника..."
                                placeholderTextColor="#797A80"
                                style={styles.employeeSearchInput}
                                returnKeyType="search"
                                autoFocus={true}
                            />
                            {employeeSearchQuery.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setEmployeeSearchQuery("")}
                                    style={styles.employeeSearchClear}
                                    hitSlop={{
                                        top: 10,
                                        bottom: 10,
                                        left: 10,
                                        right: 10,
                                    }}
                                >
                                    <Text
                                        style={styles.employeeSearchClearText}
                                    >
                                        ×
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView
                            style={styles.employeeModalList}
                            keyboardShouldPersistTaps="handled"
                        >
                            {filteredEmployees.map((employee) => {
                                const isSelected = selectedEmployees.some(
                                    (emp) => emp.id === employee.id,
                                );
                                return (
                                    <TouchableOpacity
                                        key={employee.id}
                                        style={[
                                            styles.pickerItem,
                                            isSelected &&
                                                styles.pickerItemSelected,
                                        ]}
                                        onPress={() =>
                                            handleEmployeeToggle(employee)
                                        }
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.pickerItemContent}>
                                            <View style={styles.checkbox}>
                                                {isSelected && (
                                                    <View
                                                        style={
                                                            styles.checkboxChecked
                                                        }
                                                    />
                                                )}
                                            </View>
                                            <View
                                                style={
                                                    styles.pickerItemTextContainer
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.pickerItemName
                                                    }
                                                >
                                                    {employee.name}
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.pickerItemSubtext
                                                    }
                                                >
                                                    {employee.role}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                            {filteredEmployees.length === 0 && (
                                <View style={styles.employeeEmptyState}>
                                    <Text style={styles.employeeEmptyText}>
                                        Сотрудники не най��ены
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <MenuPicker
                visible={showMenuPicker}
                onClose={() => setShowMenuPicker(false)}
                onSelect={handleMenuItemSelect}
                selectedItem={selectedMenuItem}
                title="Выберите товар"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 128 },
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
    headerSpacer: { width: 28, height: 28 },
    formContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 24,
    },
    formSection: { gap: 20 },
    inputSection: { gap: 8 },
    inputLabel: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 22,
    },
    textInput: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        padding: 16,
        color: "#ffffff",
        fontSize: 16,
        lineHeight: 22,
        minHeight: 50,
    },
    textInputMultiline: { minHeight: 80 },
    characterCount: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 12,
        textAlign: "right",
        marginTop: 4,
    },
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
    pickerPlaceholder: { color: "rgba(121, 122, 128, 1)" },
    pickerArrow: { color: "#ffffff", fontSize: 12, marginLeft: 8 },
    pickerList: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        maxHeight: 200,
        marginTop: 4,
    },
    pickerScrollView: { padding: 8 },
    pickerItem: { padding: 12, borderRadius: 12, marginVertical: 2 },
    pickerItemSelected: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
    pickerItemContent: { flexDirection: "row", alignItems: "center", gap: 12 },
    pickerItemTextContainer: { flex: 1 },
    pickerItemName: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 20,
    },
    pickerItemSubtext: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 14,
        lineHeight: 18,
        marginTop: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: {
        width: 12,
        height: 12,
        borderRadius: 3,
        backgroundColor: "#ffffff",
    },
    selectedEmployeesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 4,
    },
    selectedEmployeeChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 12,
        paddingVertical: 6,
        paddingLeft: 12,
        paddingRight: 8,
        gap: 8,
    },
    selectedEmployeeInfo: { gap: 2 },
    selectedEmployeeName: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 18,
    },
    selectedEmployeeRole: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 12,
        lineHeight: 16,
    },
    removeEmployeeIcon: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 14,
        fontWeight: "600",
        paddingHorizontal: 4,
    },
    selectedItemInfo: { gap: 4, flex: 1 },
    selectedItemPrice: { color: "#797A80", fontSize: 14 },

    // Employee modal styles
    employeeModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        justifyContent: "flex-start",
    },
    employeeModalContent: {
        backgroundColor: "#232324",
        flex: 1,
        width: "100%",
    },
    employeeModalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(43, 43, 44, 1)",
    },
    employeeModalTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
    employeeModalClose: {
        color: "#FFFFFF",
        fontSize: 24,
    },
    employeeSearchWrapper: {
        position: "relative",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    employeeSearchInput: {
        height: 44,
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingRight: 50,
        backgroundColor: "rgba(43, 43, 44, 1)",
        color: "#FFFFFF",
        fontSize: 16,
    },
    employeeSearchClear: {
        position: "absolute",
        right: 26,
        top: 26,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    employeeSearchClearText: {
        color: "#797A80",
        fontSize: 18,
        fontWeight: "bold",
    },
    employeeModalList: {
        padding: 16,
    },
    employeeEmptyState: {
        paddingVertical: 40,
        alignItems: "center",
    },
    employeeEmptyText: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 16,
        textAlign: "center",
    },

    actions: { flexDirection: "row", gap: 12 },
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
    submitButtonText: { color: "#000000", fontSize: 16, fontWeight: "600" },
    submitButtonTextDisabled: { color: "rgba(255, 255, 255, 0.4)" },
});
