import React, { useRef, useState, useCallback } from "react";
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

interface ShiftStartModalProps {
    onShiftStart?: (time: string) => void;
    initialTime?: string;
}

export default function ShiftStartModal({
    onShiftStart,
    initialTime,
}: ShiftStartModalProps = {}) {
    const modalRef = useRef<ModalWrapperRef>(null);
    const [time, setTime] = useState(initialTime || getCurrentTime());
    const [isStarting, setIsStarting] = useState(false);

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
        // Reset time to current time when opening
        setTime(getCurrentTime());
    }, []);

    // Handle modal close
    const handleModalClose = useCallback(() => {
        setIsStarting(false);
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

        setIsStarting(true);

        try {
            // Simulate API call or processing
            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log("Смена начата в:", time);
            onShiftStart?.(time);

            modalRef.current?.close();

            // Show success message
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
            setIsStarting(false);
        }
    }, [time, isValidTime, onShiftStart]);

    return (
        <View style={styles.container}>
            {/* Trigger button */}
            <TouchableOpacity
                style={ButtonStyles.buttonWhite}
                onPress={() => modalRef.current?.open()}
                activeOpacity={0.8}
            >
                <Text style={ButtonStyles.buttonText}>Начать смену</Text>
            </TouchableOpacity>

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
                        <Text style={styles.title}>Начало смены</Text>
                        <Text style={styles.subtitle}>
                            Для начала смены нужно заполнить информацию
                        </Text>
                    </View>

                    {/* Time input section */}
                    <View style={styles.inputSection}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Время начала</Text>
                            <TextInput
                                value={time}
                                onChangeText={handleTimeChange}
                                placeholder="12:32"
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
                                onSubmitEditing={handleStartShift}
                            />
                            {!isValidTime(time) && time.length > 0 && (
                                <Text style={styles.errorText}>
                                    Неверный формат времени (ЧЧ:ММ)
                                </Text>
                            )}
                        </View>

                        {/* Current time helper */}
                        <TouchableOpacity
                            style={styles.currentTimeButton}
                            onPress={() => setTime(getCurrentTime())}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.currentTimeText}>
                                Текущее время: {getCurrentTime()}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => modalRef.current?.close()}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Отмена</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.startButton,
                                (!isValidTime(time) || isStarting) &&
                                    styles.startButtonDisabled,
                            ]}
                            onPress={handleStartShift}
                            disabled={!isValidTime(time) || isStarting}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.startButtonText,
                                    (!isValidTime(time) || isStarting) &&
                                        styles.startButtonTextDisabled,
                                ]}
                            >
                                {isStarting ? "Начинаем..." : "Начать смену"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ModalWrapper>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        padding: 0, // Remove default padding
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
    currentTimeButton: {
        alignItems: "center",
        paddingVertical: 8,
    },
    currentTimeText: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 13,
        textDecorationLine: "underline",
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
    startButton: {
        flex: 2,
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
    startButtonDisabled: {
        backgroundColor: "rgba(43,43,44,1)",
        shadowOpacity: 0,
        elevation: 0,
    },
    startButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
    startButtonTextDisabled: {
        color: "rgba(255,255,255,0.4)",
    },
});
