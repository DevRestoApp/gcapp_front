import React, {
    useRef,
    useState,
    useCallback,
    useImperativeHandle,
    forwardRef,
} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
} from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";

type ModalType = "start" | "edit";

interface ShiftTimeModalProps {
    type: ModalType;
    onShiftStart?: (time: string) => void;
    onShiftEdit?: (time: string) => void;
    initialTime?: string;
    // TODO: Add additional props as needed
    // shiftId?: string;
    // employeeName?: string;
    // date?: string;
    // onSuccess?: () => void;
    // onError?: (error: Error) => void;
}

const ShiftTimeModal = forwardRef<ModalWrapperRef, ShiftTimeModalProps>(
    ({ type, onShiftStart, onShiftEdit, initialTime }, ref) => {
        const modalRef = useRef<ModalWrapperRef>(null);
        const [time, setTime] = useState(initialTime || getCurrentTime());
        const [isProcessing, setIsProcessing] = useState(false);

        const isStartMode = type === "start";
        const isEditMode = type === "edit";

        // Expose modal methods to parent component
        useImperativeHandle(ref, () => ({
            open: () => modalRef.current?.open(),
            close: () => modalRef.current?.close(),
            isVisible: () => modalRef.current?.isVisible() || false,
        }));

        // Helper function to get current time in HH:MM format
        function getCurrentTime(): string {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
        }

        // Validate time format
        const isValidTime = useCallback((timeString: string): boolean => {
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            return timeRegex.test(timeString);
        }, []);

        // Handle time input change with validation
        const handleTimeChange = useCallback((text: string) => {
            // Allow only digits and colon
            const cleanText = text.replace(/[^0-9:]/g, "");

            // Auto-format time as user types
            if (cleanText.length === 2 && !cleanText.includes(":")) {
                setTime(cleanText + ":");
            } else if (cleanText.length <= 5) {
                setTime(cleanText);
            }
        }, []);

        // Handle modal open
        const handleModalOpen = useCallback(() => {
            // For edit mode, keep the initialTime
            if (isStartMode) {
                setTime(getCurrentTime());
            } else if (initialTime) {
                setTime(initialTime);
            }
        }, [isStartMode, initialTime]);

        // Handle modal close
        const handleModalClose = useCallback(() => {
            setIsProcessing(false);
        }, []);

        // Handle shift start
        const handleStartShift = useCallback(async () => {
            if (!isValidTime(time)) {
                Alert.alert(
                    "Неверный формат времени",
                    "Пожалуйста, введите время в формате ЧЧ:ММ (например, 09:30)",
                    [{ text: "OK" }],
                );
                return;
            }

            setIsProcessing(true);

            try {
                // Simulate API call or processing
                await new Promise((resolve) => setTimeout(resolve, 1000));

                console.log("Смена начата в:", time);
                onShiftStart?.(time);

                modalRef.current?.close();

                Alert.alert("Смена начата", `Время начала смены: ${time}`, [
                    { text: "OK" },
                ]);
            } catch (error) {
                Alert.alert(
                    "Ошибка",
                    "Не удалось начать смену. Попробуйте снова.",
                    [{ text: "OK" }],
                );
            } finally {
                setIsProcessing(false);
            }
        }, [time, isValidTime, onShiftStart]);

        // Handle shift edit
        const handleEditShift = useCallback(async () => {
            if (!isValidTime(time)) {
                Alert.alert(
                    "Неверный формат времени",
                    "Пожалуйста, введите время в формате ЧЧ:ММ (например, 09:30)",
                    [{ text: "OK" }],
                );
                return;
            }

            setIsProcessing(true);

            try {
                // Simulate API call or processing
                await new Promise((resolve) => setTimeout(resolve, 1000));

                console.log("Время смены изменено на:", time);
                onShiftEdit?.(time);

                modalRef.current?.close();
            } catch (error) {
                console.error(error);
            } finally {
                setIsProcessing(false);
            }
        }, [time, isValidTime, onShiftEdit]);

        // Get modal content based on type
        const getModalContent = () => {
            if (isStartMode) {
                return {
                    title: "Начало смены",
                    subtitle: "Для начала смены нужно заполнить информацию",
                    primaryButtonText: isProcessing
                        ? "Начинаем..."
                        : "Начать смену",
                    onPrimaryAction: handleStartShift,
                };
            } else {
                return {
                    title: "Изменить время",
                    subtitle: "Укажите новое время начала смены",
                    primaryButtonText: isProcessing
                        ? "Сохраняем..."
                        : "Сохранить",
                    onPrimaryAction: handleEditShift,
                };
            }
        };

        const modalContent = getModalContent();

        return (
            <>
                {/* Trigger button - only show for start mode */}
                {isStartMode && (
                    <View style={styles.container}>
                        <TouchableOpacity
                            style={ButtonStyles.buttonWhite}
                            onPress={() => modalRef.current?.open()}
                            activeOpacity={0.8}
                        >
                            <Text style={ButtonStyles.buttonText}>
                                Начать смену
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Modal */}
                <ModalWrapper
                    ref={modalRef}
                    onOpen={handleModalOpen}
                    onClose={handleModalClose}
                    animationType="scale"
                    contentStyle={styles.modalContent}
                >
                    <View style={styles.modalInner}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>
                                {modalContent.title}
                            </Text>
                            <Text style={styles.subtitle}>
                                {modalContent.subtitle}
                            </Text>
                        </View>

                        {/* Time input section */}
                        <View style={styles.inputSection}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    Время начала
                                </Text>
                                <TextInput
                                    value={time}
                                    onChangeText={handleTimeChange}
                                    placeholderTextColor="#797A80"
                                    style={[
                                        styles.timeInput,
                                        !isValidTime(time) &&
                                            time.length > 0 &&
                                            styles.timeInputError,
                                    ]}
                                    keyboardType="numeric"
                                    maxLength={5}
                                    returnKeyType="done"
                                    onSubmitEditing={
                                        modalContent.onPrimaryAction
                                    }
                                />
                                {!isValidTime(time) && time.length > 0 && (
                                    <Text style={styles.errorText}>
                                        Неверный формат времени (ЧЧ:ММ)
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            {isStartMode ? (
                                <>
                                    {/* Start mode: Cancel + Start buttons */}
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() =>
                                            modalRef.current?.close()
                                        }
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.cancelButtonText}>
                                            Отмена
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.primaryButton,
                                            styles.primaryButtonStart,
                                            (!isValidTime(time) ||
                                                isProcessing) &&
                                                styles.primaryButtonDisabled,
                                        ]}
                                        onPress={modalContent.onPrimaryAction}
                                        disabled={
                                            !isValidTime(time) || isProcessing
                                        }
                                        activeOpacity={0.8}
                                    >
                                        <Text
                                            style={[
                                                styles.primaryButtonText,
                                                (!isValidTime(time) ||
                                                    isProcessing) &&
                                                    styles.primaryButtonTextDisabled,
                                            ]}
                                        >
                                            {modalContent.primaryButtonText}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    {/* Edit mode: Single save button */}
                                    <TouchableOpacity
                                        style={[
                                            styles.primaryButton,
                                            styles.primaryButtonEdit,
                                            (!isValidTime(time) ||
                                                isProcessing) &&
                                                styles.primaryButtonDisabled,
                                        ]}
                                        onPress={modalContent.onPrimaryAction}
                                        disabled={
                                            !isValidTime(time) || isProcessing
                                        }
                                        activeOpacity={0.8}
                                    >
                                        <Text
                                            style={[
                                                styles.primaryButtonText,
                                                (!isValidTime(time) ||
                                                    isProcessing) &&
                                                    styles.primaryButtonTextDisabled,
                                            ]}
                                        >
                                            {modalContent.primaryButtonText}
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </ModalWrapper>
            </>
        );
    },
);

ShiftTimeModal.displayName = "ShiftTimeModal";

export default ShiftTimeModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        padding: 0,
    },
    modalInner: {
        padding: 24,
    },

    // Header styles
    header: {
        marginBottom: 24,
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "white",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.7)",
        textAlign: "center",
        lineHeight: 20,
    },

    // Input section styles
    inputSection: {
        marginBottom: 24,
    },
    inputContainer: {
        backgroundColor: "rgba(43,43,44,1)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "transparent",
    },
    inputLabel: {
        fontSize: 12,
        color: "rgba(121,122,128,1)",
        marginBottom: 8,
        fontWeight: "500",
    },
    timeInput: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        paddingVertical: 4,
        textAlign: "center",
    },
    timeInputError: {
        color: "#FF6B6B",
    },
    errorText: {
        color: "#FF6B6B",
        fontSize: 12,
        marginTop: 4,
        textAlign: "center",
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
        backgroundColor: "rgba(43,43,44,1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    cancelButtonText: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 16,
        fontWeight: "500",
    },
    primaryButton: {
        height: 48,
        borderRadius: 24,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    primaryButtonStart: {
        flex: 2, // Takes more space in start mode
    },
    primaryButtonEdit: {
        flex: 1, // Full width in edit mode
    },
    primaryButtonDisabled: {
        backgroundColor: "rgba(43,43,44,1)",
        shadowOpacity: 0,
        elevation: 0,
    },
    primaryButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
    primaryButtonTextDisabled: {
        color: "rgba(255,255,255,0.4)",
    },
});
