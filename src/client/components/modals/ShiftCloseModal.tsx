import React, { useRef, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";

interface ShiftCloseModalProps {
    startTime: string; // Format: "HH:MM"
    totalOrdersSold: number;
    totalRevenue: number;
    onCloseShift?: (data: {
        startTime: string;
        endTime: string;
        totalOrdersSold: number;
        totalRevenue: number;
        duration: string;
    }) => void;
    onCancel?: () => void;
}

export type ShiftCloseModalRef = {
    open: () => void;
    close: () => void;
    isVisible: () => boolean;
};

const ShiftCloseModal = React.forwardRef<
    ShiftCloseModalRef,
    ShiftCloseModalProps
>(
    (
        { startTime, totalOrdersSold, totalRevenue, onCloseShift, onCancel },
        ref,
    ) => {
        const modalRef = useRef<ModalWrapperRef>(null);
        const [isClosing, setIsClosing] = useState(false);

        // Get current time
        const getCurrentTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
        };

        // Calculate shift duration
        const calculateDuration = () => {
            const [startHours, startMinutes] = startTime.split(":").map(Number);
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();

            let durationMinutes =
                (currentHours - startHours) * 60 +
                (currentMinutes - startMinutes);

            if (durationMinutes < 0) {
                durationMinutes += 24 * 60; // Add 24 hours if negative
            }

            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;

            return `${hours} ч ${minutes} мин`;
        };

        // Imperative handle for parent control
        React.useImperativeHandle(ref, () => ({
            open: () => modalRef.current?.open(),
            close: () => modalRef.current?.close(),
            isVisible: () => modalRef.current?.isVisible() || false,
        }));

        // Handle modal close
        const handleClose = useCallback(() => {
            onCancel?.();
            modalRef.current?.close();
        }, [onCancel]);

        // Handle modal open
        const handleOpen = useCallback(() => {
            setIsClosing(false);
        }, []);

        // Handle shift close
        const handleCloseShift = useCallback(async () => {
            const endTime = getCurrentTime();
            const duration = calculateDuration();
            setIsClosing(true);

            try {
                onCloseShift?.({
                    startTime,
                    endTime,
                    totalOrdersSold,
                    totalRevenue,
                    duration,
                });

                Alert.alert(
                    "Смена закрыта",
                    "Смена успешно завершена. Хорошей работы!",
                    [{ text: "OK" }],
                );

                handleClose();
            } catch (error) {
                console.log(error);
            } finally {
                setIsClosing(false);
            }
        }, [
            startTime,
            totalOrdersSold,
            totalRevenue,
            onCloseShift,
            handleClose,
        ]);

        // Render close button
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

        // Render header
        const renderHeader = () => (
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Закрытие смены</Text>
                    {renderCloseButton()}
                </View>
            </View>
        );

        // Render shift info
        const renderShiftInfo = () => (
            <View style={styles.infoSection}>
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Время начала:</Text>
                        <Text style={styles.infoValue}>{startTime}</Text>
                    </View>

                    <View style={styles.infoDivider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Время окончания:</Text>
                        <Text style={styles.infoValue}>{getCurrentTime()}</Text>
                    </View>

                    <View style={styles.infoDivider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Продолжительность:</Text>
                        <Text style={styles.infoValue}>
                            {calculateDuration()}
                        </Text>
                    </View>
                </View>

                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Заказов продано</Text>
                        <Text style={styles.statValue}>{totalOrdersSold}</Text>
                    </View>

                    <View style={styles.statsVerticalDivider} />

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Общая выручка</Text>
                        <Text style={styles.statValue}>
                            {totalRevenue.toLocaleString()} тг
                        </Text>
                    </View>
                </View>
            </View>
        );

        // Render actions
        const renderActions = () => (
            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                    disabled={isClosing}
                >
                    <Text style={styles.cancelButtonText}>Отмена</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.closeShiftButton,
                        isClosing && styles.closeShiftButtonDisabled,
                    ]}
                    onPress={handleCloseShift}
                    disabled={isClosing}
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.closeShiftButtonText,
                            isClosing && styles.closeShiftButtonTextDisabled,
                        ]}
                    >
                        {isClosing ? "Закрываем..." : "Закончить смену"}
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
                    {renderShiftInfo()}
                    {renderActions()}
                </View>
            </ModalWrapper>
        );
    },
);

ShiftCloseModal.displayName = "ShiftCloseModal";
export default ShiftCloseModal;

const styles = StyleSheet.create({
    modalContent: {
        padding: 0,
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

    // Info section styles
    infoSection: {
        gap: 16,
    },
    infoCard: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 20,
        padding: 16,
        gap: 12,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    infoLabel: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 14,
        lineHeight: 20,
    },
    infoValue: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
        lineHeight: 22,
    },
    infoDivider: {
        height: 1,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },

    // Stats card styles
    statsCard: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 20,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    statItem: {
        flex: 1,
        alignItems: "center",
        gap: 8,
    },
    statLabel: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 12,
        textAlign: "center",
        lineHeight: 16,
    },
    statValue: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 24,
    },
    statsVerticalDivider: {
        width: 1,
        height: 40,
        backgroundColor: "rgba(35, 35, 36, 1)",
        marginHorizontal: 16,
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
    closeShiftButton: {
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
    closeShiftButtonDisabled: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        shadowOpacity: 0,
        elevation: 0,
    },
    closeShiftButtonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "600",
    },
    closeShiftButtonTextDisabled: {
        color: "rgba(255, 255, 255, 0.4)",
    },
});
