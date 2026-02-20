import React, {
    useRef,
    useState,
    useCallback,
    useImperativeHandle,
    forwardRef,
} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";

type ModalType = "start" | "edit";

interface ShiftTimeModalProps {
    type: ModalType;
    onShiftStart?: () => Promise<void> | void;
    onShiftEdit?: (time: string) => Promise<void> | void;
}

const ShiftTimeModal = forwardRef<ModalWrapperRef, ShiftTimeModalProps>(
    ({ type, onShiftStart, onShiftEdit }, ref) => {
        const modalRef = useRef<ModalWrapperRef>(null);
        const [currentTime, setCurrentTime] = useState(getCurrentTime());
        const [isProcessing, setIsProcessing] = useState(false);

        const isStartMode = type === "start";

        useImperativeHandle(ref, () => ({
            open: () => modalRef.current?.open(),
            close: () => modalRef.current?.close(),
            isVisible: () => modalRef.current?.isVisible() || false,
        }));

        function getCurrentTime(): string {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
        }

        const handleModalOpen = useCallback(() => {
            setCurrentTime(getCurrentTime());
        }, []);

        const handleModalClose = useCallback(() => {
            setIsProcessing(false);
        }, []);

        const handleStartShift = useCallback(async () => {
            if (!onShiftStart) {
                console.error("onShiftStart callback is not provided");
                return;
            }

            setIsProcessing(true);

            try {
                await onShiftStart();
                modalRef.current?.close();
                Alert.alert(
                    "Смена начата",
                    `Время начала смены: ${currentTime}`,
                    [{ text: "OK" }],
                );
            } catch (error) {
                console.error("Failed to start shift:", error);
                Alert.alert(
                    "Ошибка",
                    "Не удалось начать смену. Попробуйте снова.",
                    [{ text: "OK" }],
                );
            } finally {
                setIsProcessing(false);
            }
        }, [currentTime, onShiftStart]);

        const handleEditShift = useCallback(async () => {
            if (!onShiftEdit) {
                console.error("onShiftEdit callback is not provided");
                return;
            }

            setIsProcessing(true);

            try {
                await onShiftEdit(currentTime);
                modalRef.current?.close();
                Alert.alert("Время изменено", `Новое время: ${currentTime}`, [
                    { text: "OK" },
                ]);
            } catch (error) {
                console.error("Failed to edit shift:", error);
                Alert.alert(
                    "Ошибка",
                    "Не удалось изменить время. Попробуйте снова.",
                    [{ text: "OK" }],
                );
            } finally {
                setIsProcessing(false);
            }
        }, [currentTime, onShiftEdit]);

        const modalTitle = isStartMode ? "Начало смены" : "Изменить время";
        const modalSubtitle = isStartMode
            ? "Для начала смены нужно заполнить информацию"
            : "Укажите новое время начала смены";
        const primaryButtonText = isStartMode
            ? isProcessing
                ? "Начинаем..."
                : "Начать смену"
            : isProcessing
              ? "Сохраняем..."
              : "Сохранить";
        const primaryAction = isStartMode ? handleStartShift : handleEditShift;

        return (
            <>
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
                            <Text style={styles.title}>{modalTitle}</Text>
                            <Text style={styles.subtitle}>{modalSubtitle}</Text>
                        </View>

                        {/* Current time display */}
                        <View style={styles.timeSection}>
                            <Text style={styles.timeLabel}>Время начала</Text>
                            <Text style={styles.timeDisplay}>
                                {currentTime}
                            </Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            {isStartMode && (
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => modalRef.current?.close()}
                                    activeOpacity={0.7}
                                    disabled={isProcessing}
                                >
                                    <Text style={styles.cancelButtonText}>
                                        Отмена
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.primaryButton,
                                    isStartMode
                                        ? styles.primaryButtonStart
                                        : styles.primaryButtonEdit,
                                    isProcessing &&
                                        styles.primaryButtonDisabled,
                                ]}
                                onPress={primaryAction}
                                disabled={isProcessing}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.primaryButtonText,
                                        isProcessing &&
                                            styles.primaryButtonTextDisabled,
                                    ]}
                                >
                                    {primaryButtonText}
                                </Text>
                            </TouchableOpacity>
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

    // Time display styles
    timeSection: {
        backgroundColor: "rgba(43,43,44,1)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        alignItems: "center",
    },
    timeLabel: {
        fontSize: 12,
        color: "rgba(121,122,128,1)",
        marginBottom: 8,
        fontWeight: "500",
    },
    timeDisplay: {
        color: "white",
        fontSize: 32,
        fontWeight: "700",
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
        flex: 2,
    },
    primaryButtonEdit: {
        flex: 1,
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
