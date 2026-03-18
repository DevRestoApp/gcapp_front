import React, { useRef, useCallback, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    ScrollView,
} from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";
import MenuPicker, { MenuItem } from "@/src/client/components/form/MenuPicker";
import { ReportCalendar } from "@/src/client/components/reports/Calendar";
import SegmentedControl from "@/src/client/components/Tabs";

// ============================================================================
// Types
// ============================================================================

interface Employee {
    id: string;
    name: string;
    role: string;
}

interface Location {
    id: string;
    name: string;
}

interface QuestFormData {
    title: string;
    description?: string;
    amount: number;
    reward: number;
    unit: string;
    date: string;
    employeeIds: string[];
    organization_id?: string;
}

interface TaskFormData {
    title: string;
    description: string;
    user_id: number;
    organization_id: number;
    due_date: string;
}

interface AddQuestModalProps {
    employees?: Employee[];
    locations?: Location[];
    onAddQuest?: (data: QuestFormData) => void;
    onAddTask?: (data: TaskFormData) => void;
    onCancel?: () => void;
}

export type AddQuestModalRef = {
    open: () => void;
    close: () => void;
    isVisible: () => boolean;
};

// ============================================================================
// Helpers
// ============================================================================

const getDefaultDuration = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

// ============================================================================
// Component
// ============================================================================

const AddQuestModal = React.forwardRef<AddQuestModalRef, AddQuestModalProps>(
    (
        { employees = [], locations = [], onAddQuest, onAddTask, onCancel },
        ref,
    ) => {
        const modalRef = useRef<ModalWrapperRef>(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

        // Tab state
        const [activeTab, setActiveTab] = useState<"quest" | "task">("quest");
        const tabs = [
            { label: "Квест", value: "quest" },
            { label: "Задача", value: "task" },
        ];

        // Quest form fields
        const [questName, setQuestName] = useState("");
        const [questDescription, setQuestDescription] = useState("");
        const [amount, setAmount] = useState("");
        const [reward, setReward] = useState("");
        const [durationDate, setDurationDate] =
            useState<string>(getDefaultDuration());
        const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>(
            [],
        );
        const [selectedLocation, setSelectedLocation] =
            useState<Location | null>(null);
        const [selectedMenuItem, setSelectedMenuItem] =
            useState<MenuItem | null>(null);

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
        const [showLocationPicker, setShowLocationPicker] = useState(false);
        const [showMenuPicker, setShowMenuPicker] = useState(false);
        const [showCalendar, setShowCalendar] = useState(false);
        const [showTaskEmployeePicker, setShowTaskEmployeePicker] =
            useState(false);
        const [showTaskLocationPicker, setShowTaskLocationPicker] =
            useState(false);
        const [showTaskCalendar, setShowTaskCalendar] = useState(false);

        React.useImperativeHandle(ref, () => ({
            open: () => modalRef.current?.open(),
            close: () => modalRef.current?.close(),
            isVisible: () => modalRef.current?.isVisible() || false,
        }));

        const resetForm = useCallback(() => {
            // Quest form reset
            setQuestName("");
            setQuestDescription("");
            setAmount("");
            setReward("");
            setDurationDate(getDefaultDuration());
            setSelectedEmployees([]);
            setSelectedLocation(null);
            setSelectedMenuItem(null);
            setShowEmployeePicker(false);
            setShowLocationPicker(false);
            setShowMenuPicker(false);
            setShowCalendar(false);

            // Task form reset
            setTaskTitle("");
            setTaskDescription("");
            setTaskDueDate(getDefaultDuration());
            setTaskSelectedEmployee(null);
            setTaskSelectedLocation(null);
            setShowTaskEmployeePicker(false);
            setShowTaskLocationPicker(false);
            setShowTaskCalendar(false);

            setActiveTab("quest");
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

        const handleMenuItemSelect = useCallback((item: MenuItem) => {
            setSelectedMenuItem(item);
        }, []);

        const handleEmployeeToggle = useCallback((employee: Employee) => {
            setSelectedEmployees((prev) => {
                const isSelected = prev.some((emp) => emp.id === employee.id);
                return isSelected
                    ? prev.filter((emp) => emp.id !== employee.id)
                    : [...prev, employee];
            });
        }, []);

        const handleEmployeeRemove = useCallback((employeeId: string) => {
            setSelectedEmployees((prev) =>
                prev.filter((emp) => emp.id !== employeeId),
            );
        }, []);

        const handleLocationSelect = useCallback((location: Location) => {
            setSelectedLocation(location);
            setShowLocationPicker(false);
        }, []);

        const handleTaskLocationSelect = useCallback((location: Location) => {
            setTaskSelectedLocation(location);
            setShowTaskLocationPicker(false);
        }, []);

        const handleTaskEmployeeSelect = useCallback((employee: Employee) => {
            setTaskSelectedEmployee(employee);
            setShowTaskEmployeePicker(false);
        }, []);

        // ====================================================================
        // Validation
        // ====================================================================

        const validateQuestForm = useCallback((): boolean => {
            if (!questName.trim()) {
                Alert.alert("Ошибка", "Пожалуйста, укажите название квеста");
                return false;
            }
            if (
                !amount.trim() ||
                isNaN(Number(amount)) ||
                Number(amount) <= 0
            ) {
                Alert.alert(
                    "Ошибка",
                    "Пожалуйста, укажите корректное количество",
                );
                return false;
            }
            if (
                !reward.trim() ||
                isNaN(Number(reward)) ||
                Number(reward) <= 0
            ) {
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

        // ====================================================================
        // Submit
        // ====================================================================

        const handleSubmit = useCallback(async () => {
            if (activeTab === "quest") {
                if (!validateQuestForm()) return;

                setIsSubmitting(true);
                try {
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    const formData: QuestFormData = {
                        title: questName.trim(),
                        description: questDescription.trim() || undefined,
                        amount: Number(amount),
                        reward: Number(reward),
                        unit: selectedMenuItem?.name?.trim() ?? "",
                        date: durationDate,
                        employeeIds: selectedEmployees.map((emp) => emp.id),
                        organization_id: selectedLocation?.id,
                    };

                    onAddQuest?.(formData);
                    handleClose();
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
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    const formData: TaskFormData = {
                        title: taskTitle.trim(),
                        description: taskDescription.trim(),
                        user_id: Number(taskSelectedEmployee!.id),
                        organization_id: Number(taskSelectedLocation!.id),
                        due_date: taskDueDate,
                    };

                    onAddTask?.(formData);
                    handleClose();
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
            taskTitle,
            taskDescription,
            taskSelectedEmployee,
            taskSelectedLocation,
            taskDueDate,
            onAddQuest,
            onAddTask,
            handleClose,
        ]);

        // ====================================================================
        // Render: Shared
        // ====================================================================

        const renderHeader = () => (
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>
                        {activeTab === "quest"
                            ? "Создать квест"
                            : "Создать задачу"}
                    </Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleClose}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        activeOpacity={0.7}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
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
                        {isSubmitting
                            ? "Создаем..."
                            : activeTab === "quest"
                              ? "Создать квест"
                              : "Создать задачу"}
                    </Text>
                </TouchableOpacity>
            </View>
        );

        // ====================================================================
        // Render: Quest form
        // ====================================================================

        const renderSelectedEmployees = () => {
            if (selectedEmployees.length === 0) return null;
            return (
                <View style={styles.selectedEmployeesContainer}>
                    {selectedEmployees.map((employee) => (
                        <View
                            key={employee.id}
                            style={styles.selectedEmployeeChip}
                        >
                            <View style={styles.selectedEmployeeInfo}>
                                <Text style={styles.selectedEmployeeName}>
                                    {employee.name}
                                </Text>
                                <Text style={styles.selectedEmployeeRole}>
                                    {employee.role}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() =>
                                    handleEmployeeRemove(employee.id)
                                }
                                hitSlop={{
                                    top: 8,
                                    bottom: 8,
                                    left: 8,
                                    right: 8,
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.removeEmployeeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            );
        };

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

                {/* Employees */}
                {employees.length > 0 && (
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>
                            Сотрудники (опционально)
                        </Text>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => {
                                setShowEmployeePicker(!showEmployeePicker);
                                setShowLocationPicker(false);
                                setShowCalendar(false);
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
                            <Text style={styles.pickerArrow}>
                                {showEmployeePicker ? "▲" : "▼"}
                            </Text>
                        </TouchableOpacity>
                        {renderSelectedEmployees()}
                        {showEmployeePicker && (
                            <View style={styles.pickerList}>
                                <ScrollView
                                    style={styles.pickerScrollView}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled
                                >
                                    {employees.map((employee) => {
                                        const isSelected =
                                            selectedEmployees.some(
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
                                                    handleEmployeeToggle(
                                                        employee,
                                                    )
                                                }
                                                activeOpacity={0.7}
                                            >
                                                <View
                                                    style={
                                                        styles.pickerItemContent
                                                    }
                                                >
                                                    <View
                                                        style={styles.checkbox}
                                                    >
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
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}

                {/* Location */}
                {locations.length > 0 && (
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>
                            Локация (опционально)
                        </Text>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => {
                                setShowLocationPicker(!showLocationPicker);
                                setShowEmployeePicker(false);
                                setShowCalendar(false);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.pickerButtonText,
                                    !selectedLocation &&
                                        styles.pickerPlaceholder,
                                ]}
                            >
                                {selectedLocation?.name || "Выберите локацию"}
                            </Text>
                            <Text style={styles.pickerArrow}>
                                {showLocationPicker ? "▲" : "▼"}
                            </Text>
                        </TouchableOpacity>
                        {showLocationPicker && (
                            <View style={styles.pickerList}>
                                <ScrollView
                                    style={styles.pickerScrollView}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled
                                >
                                    {locations.map((location) => (
                                        <TouchableOpacity
                                            key={location.id}
                                            style={styles.pickerItem}
                                            onPress={() =>
                                                handleLocationSelect(location)
                                            }
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.pickerItemName}>
                                                {location.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
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
                                    {selectedMenuItem.price.toLocaleString(
                                        "ru-RU",
                                    )}{" "}
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

        // ====================================================================
        // Render: Task form
        // ====================================================================

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

                {/* Task Employee (single select) */}
                {employees.length > 0 && (
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>Сотрудник</Text>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => {
                                setShowTaskEmployeePicker(
                                    !showTaskEmployeePicker,
                                );
                                setShowTaskLocationPicker(false);
                                setShowTaskCalendar(false);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.pickerButtonText,
                                    !taskSelectedEmployee &&
                                        styles.pickerPlaceholder,
                                ]}
                            >
                                {taskSelectedEmployee?.name ||
                                    "Выберите сотрудника"}
                            </Text>
                            <Text style={styles.pickerArrow}>
                                {showTaskEmployeePicker ? "▲" : "▼"}
                            </Text>
                        </TouchableOpacity>
                        {showTaskEmployeePicker && (
                            <View style={styles.pickerList}>
                                <ScrollView
                                    style={styles.pickerScrollView}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled
                                >
                                    {employees.map((employee) => (
                                        <TouchableOpacity
                                            key={employee.id}
                                            style={[
                                                styles.pickerItem,
                                                taskSelectedEmployee?.id ===
                                                    employee.id &&
                                                    styles.pickerItemSelected,
                                            ]}
                                            onPress={() =>
                                                handleTaskEmployeeSelect(
                                                    employee,
                                                )
                                            }
                                            activeOpacity={0.7}
                                        >
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
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}

                {/* Task Location */}
                {locations.length > 0 && (
                    <View style={styles.inputSection}>
                        <Text style={styles.inputLabel}>Локация</Text>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={() => {
                                setShowTaskLocationPicker(
                                    !showTaskLocationPicker,
                                );
                                setShowTaskEmployeePicker(false);
                                setShowTaskCalendar(false);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.pickerButtonText,
                                    !taskSelectedLocation &&
                                        styles.pickerPlaceholder,
                                ]}
                            >
                                {taskSelectedLocation?.name ||
                                    "Выберите локацию"}
                            </Text>
                            <Text style={styles.pickerArrow}>
                                {showTaskLocationPicker ? "▲" : "▼"}
                            </Text>
                        </TouchableOpacity>
                        {showTaskLocationPicker && (
                            <View style={styles.pickerList}>
                                <ScrollView
                                    style={styles.pickerScrollView}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled
                                >
                                    {locations.map((location) => (
                                        <TouchableOpacity
                                            key={location.id}
                                            style={[
                                                styles.pickerItem,
                                                taskSelectedLocation?.id ===
                                                    location.id &&
                                                    styles.pickerItemSelected,
                                            ]}
                                            onPress={() =>
                                                handleTaskLocationSelect(
                                                    location,
                                                )
                                            }
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.pickerItemName}>
                                                {location.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}

                {/* Task Due Date */}
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Срок выполнения</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => {
                            setShowTaskCalendar(!showTaskCalendar);
                            setShowTaskEmployeePicker(false);
                            setShowTaskLocationPicker(false);
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

        // ====================================================================
        // Main render
        // ====================================================================

        return (
            <ModalWrapper
                ref={modalRef}
                onOpen={handleOpen}
                onClose={onCancel}
                animationType="scale"
                contentStyle={styles.modalContent}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {renderHeader()}
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
                    {renderActions()}
                </ScrollView>
                <MenuPicker
                    visible={showMenuPicker}
                    onClose={() => setShowMenuPicker(false)}
                    onSelect={handleMenuItemSelect}
                    selectedItem={selectedMenuItem}
                    title="Выберите товар"
                />
            </ModalWrapper>
        );
    },
);

AddQuestModal.displayName = "AddQuestModal";
export default AddQuestModal;

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    modalContent: {
        padding: 0,
        maxHeight: "90%",
    },
    scrollView: {
        flexGrow: 0,
    },
    container: {
        padding: 20,
        gap: 24,
    },
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
    textInput: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        padding: 16,
        color: "#ffffff",
        fontSize: 16,
        lineHeight: 22,
        minHeight: 50,
    },
    textInputMultiline: {
        minHeight: 80,
    },
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
    pickerPlaceholder: {
        color: "rgba(121, 122, 128, 1)",
    },
    pickerArrow: {
        color: "#ffffff",
        fontSize: 12,
        marginLeft: 8,
    },
    pickerList: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        maxHeight: 200,
        marginTop: 4,
    },
    pickerScrollView: {
        padding: 8,
    },
    pickerItem: {
        padding: 12,
        borderRadius: 12,
        marginVertical: 2,
    },
    pickerItemSelected: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    pickerItemContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    pickerItemTextContainer: {
        flex: 1,
    },
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
    selectedEmployeeInfo: {
        gap: 2,
    },
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
    selectedItemInfo: {
        gap: 4,
        flex: 1,
    },
    selectedItemPrice: {
        color: "#797A80",
        fontSize: 14,
    },
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
