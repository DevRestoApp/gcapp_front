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
import { Entypo } from "@expo/vector-icons";

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
    amount: number;
    reward: string;
    unit: string;
    employeeId?: string;
    employeeName?: string;
    locationId?: string;
    locationName?: string;
}

interface AddQuestModalProps {
    employees?: Employee[];
    locations?: Location[];
    onAddQuest?: (data: QuestFormData) => void;
    onCancel?: () => void;
}

export type AddQuestModalRef = {
    open: () => void;
    close: () => void;
    isVisible: () => boolean;
};

// ============================================================================
// Component
// ============================================================================

const AddQuestModal = React.forwardRef<AddQuestModalRef, AddQuestModalProps>(
    ({ employees = [], locations = [], onAddQuest, onCancel }, ref) => {
        const modalRef = useRef<ModalWrapperRef>(null);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [questName, setQuestName] = useState("");
        const [amount, setAmount] = useState("");
        const [reward, setReward] = useState("");
        const [selectedEmployee, setSelectedEmployee] =
            useState<Employee | null>(null);
        const [selectedLocation, setSelectedLocation] =
            useState<Location | null>(null);
        const [showEmployeePicker, setShowEmployeePicker] = useState(false);
        const [showLocationPicker, setShowLocationPicker] = useState(false);

        const [showMenuPicker, setShowMenuPicker] = useState(false);
        const [selectedMenuItem, setSelectedMenuItem] =
            useState<MenuItem | null>(null);

        // Imperative handle for parent control
        React.useImperativeHandle(ref, () => ({
            open: () => modalRef.current?.open(),
            close: () => modalRef.current?.close(),
            isVisible: () => modalRef.current?.isVisible() || false,
        }));

        // Reset form when modal opens
        const handleOpen = useCallback(() => {
            setQuestName("");
            setSelectedMenuItem(null);
            setAmount("");
            setReward("");
            setSelectedEmployee(null);
            setSelectedLocation(null);
            setShowEmployeePicker(false);
            setShowLocationPicker(false);
            setIsSubmitting(false);
        }, []);

        // Handle modal close
        const handleClose = useCallback(() => {
            setQuestName("");
            setAmount("");
            setReward("");
            setSelectedMenuItem(null);
            setSelectedEmployee(null);
            setSelectedLocation(null);
            setShowEmployeePicker(false);
            setShowLocationPicker(false);
            setIsSubmitting(false);
            onCancel?.();
            modalRef.current?.close();
        }, [onCancel]);

        const handleMenuItemSelect = (item: MenuItem) => {
            setSelectedMenuItem(item);
            console.log("ITEM", item);
        };

        // Handle employee select
        const handleEmployeeSelect = useCallback((employee: Employee) => {
            setSelectedEmployee(employee);
            setShowEmployeePicker(false);
        }, []);

        // Handle location select
        const handleLocationSelect = useCallback((location: Location) => {
            setSelectedLocation(location);
            setShowLocationPicker(false);
        }, []);

        // Handle quest submission
        const handleSubmit = useCallback(async () => {
            // Validation
            if (!questName.trim()) {
                Alert.alert("Ошибка", "Пожалуйста, укажите название квеста");
                return;
            }
            if (
                !amount.trim() ||
                isNaN(Number(amount)) ||
                Number(amount) <= 0
            ) {
                Alert.alert("Ошибка", "Пожалуйста, укажите корректную сумму");
                return;
            }
            if (!reward.trim()) {
                Alert.alert("Ошибка", "Пожалуйста, укажите награду");
                return;
            }

            setIsSubmitting(true);

            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                onAddQuest?.({
                    title: questName.trim(),
                    amount: Number(amount),
                    reward: reward.trim(),
                    unit: selectedMenuItem.name?.trim() ?? "",
                    employeeId: selectedEmployee?.id,
                    employeeName: selectedEmployee?.name,
                    locationId: selectedLocation?.id,
                    locationName: selectedLocation?.name,
                });

                // Close modal first
                handleClose();

                // Then show success message
                setTimeout(() => {
                    Alert.alert("Успешно", "Квест успешно создан");
                }, 300); // Small delay for smooth transition
            } catch (error) {
                console.log(error);
                Alert.alert("Ошибка", "Не удалось создать квест");
            } finally {
                setIsSubmitting(false);
            }
        }, [
            questName,
            amount,
            reward,
            selectedEmployee,
            selectedLocation,
            onAddQuest,
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
                    <Text style={styles.title}>Создать квест</Text>
                    {renderCloseButton()}
                </View>
            </View>
        );

        const renderEmployeePicker = () => {
            if (employees.length === 0) return null;

            return (
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>
                        Сотрудник (опционально)
                    </Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => {
                            setShowEmployeePicker(!showEmployeePicker);
                            setShowLocationPicker(false);
                        }}
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
                        <View style={styles.pickerList}>
                            <ScrollView
                                style={styles.pickerScrollView}
                                showsVerticalScrollIndicator={false}
                            >
                                {employees.map((employee) => (
                                    <TouchableOpacity
                                        key={employee.id}
                                        style={styles.pickerItem}
                                        onPress={() =>
                                            handleEmployeeSelect(employee)
                                        }
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.pickerItemName}>
                                            {employee.name}
                                        </Text>
                                        <Text style={styles.pickerItemSubtext}>
                                            {employee.role}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            );
        };

        const renderLocationPicker = () => {
            if (locations.length === 0) return null;

            return (
                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Локация (опционально)</Text>
                    <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={() => {
                            setShowLocationPicker(!showLocationPicker);
                            setShowEmployeePicker(false);
                        }}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.pickerButtonText,
                                !selectedLocation && styles.pickerPlaceholder,
                            ]}
                        >
                            {selectedLocation
                                ? selectedLocation.name
                                : "Выберите локацию"}
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
            );
        };

        const renderQuestNameInput = () => (
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Название квеста</Text>
                <TextInput
                    style={styles.textInput}
                    value={questName}
                    onChangeText={setQuestName}
                    placeholder="Введите название квеста..."
                    placeholderTextColor="rgba(121, 122, 128, 1)"
                    maxLength={100}
                />
                <Text style={styles.characterCount}>
                    {questName.length}/100
                </Text>
            </View>
        );
        const MenuItemPickerButton = () => (
            <TouchableOpacity
                style={styles.inputSection}
                onPress={() => setShowMenuPicker(true)}
            >
                <Text style={styles.inputLabel}>Товар</Text>
                <View style={styles.textInput}>
                    {selectedMenuItem ? (
                        <View style={styles.selectedItemInfo}>
                            <Text style={styles.inputLabel}>
                                {selectedMenuItem.name}
                            </Text>
                            <Text style={styles.selectedItemPrice}>
                                {selectedMenuItem.price.toLocaleString("ru-RU")}{" "}
                                тг
                            </Text>
                        </View>
                    ) : (
                        <Text
                            style={{
                                ...styles.placeholderText,
                                ...styles.selectedItemInfo,
                            }}
                        >
                            Нажмите для выбора товара
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );

        const renderAmountInput = () => (
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Сумма</Text>
                <View style={styles.amountInputContainer}>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0"
                        placeholderTextColor="rgba(121, 122, 128, 1)"
                        keyboardType="numeric"
                        maxLength={10}
                    />
                    <Text style={styles.currencyLabel}>тг</Text>
                </View>
            </View>
        );

        const renderRewardInput = () => (
            <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Награда</Text>
                <TextInput
                    style={styles.textInput}
                    value={reward}
                    onChangeText={setReward}
                    placeholder="Опишите награду за выполнение квеста..."
                    placeholderTextColor="rgba(121, 122, 128, 1)"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    maxLength={200}
                />
                <Text style={styles.characterCount}>{reward.length}/200</Text>
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
                        {isSubmitting ? "Создаем..." : "Создать квест"}
                    </Text>
                </TouchableOpacity>
            </View>
        );

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
                        {renderQuestNameInput()}
                        {renderEmployeePicker()}
                        {renderLocationPicker()}
                        {renderAmountInput()}
                        {MenuItemPickerButton()}
                        {renderRewardInput()}
                    </View>
                    {renderActions()}
                    <MenuPicker
                        visible={showMenuPicker}
                        onClose={() => setShowMenuPicker(false)}
                        onSelect={handleMenuItemSelect}
                        selectedItem={selectedMenuItem}
                        title="Выберите товар"
                    />
                </View>
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
    container: {
        padding: 20,
        gap: 24,
    },

    // Header styles
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

    // Form section styles
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

    // Text input styles
    textInput: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        padding: 16,
        color: "#ffffff",
        fontSize: 16,
        lineHeight: 22,
        minHeight: 50,
    },
    characterCount: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 12,
        textAlign: "right",
        marginTop: 4,
    },

    // Amount input styles
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

    // Picker styles (shared by employee and location)
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

    // Actions styles
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
    menuPickerButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
    },
    menuPickerContent: {
        flex: 1,
    },
    selectedItemInfo: {
        gap: 4,
    },
    selectedItemName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    selectedItemPrice: {
        color: "#797A80",
        fontSize: 14,
    },
    placeholderText: {
        color: "#797A80",
        fontSize: 16,
    },
    chevron: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "300",
    },
});
