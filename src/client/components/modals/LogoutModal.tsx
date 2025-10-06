import React, { useRef, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";

interface LogoutConfirmationModalProps {
    userName?: string;
    onConfirmLogout?: () => void;
    onCancel?: () => void;
}

export type LogoutConfirmationModalRef = {
    open: () => void;
    close: () => void;
    isVisible: () => boolean;
};

const LogoutConfirmationModal = React.forwardRef<
    LogoutConfirmationModalRef,
    LogoutConfirmationModalProps
>(({ userName = "Пользователь", onConfirmLogout, onCancel }, ref) => {
    const modalRef = useRef<ModalWrapperRef>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        setIsLoggingOut(false);
    }, []);

    // Handle logout confirmation
    const handleConfirmLogout = useCallback(async () => {
        setIsLoggingOut(true);

        try {
            // Simulate logout API call
            await new Promise((resolve) => setTimeout(resolve, 800));

            onConfirmLogout?.();

            Alert.alert("Выход выполнен", "Вы успешно вышли из системы", [
                { text: "OK" },
            ]);

            handleClose();
        } catch (error) {
            Alert.alert(
                "Ошибка",
                "Не удалось выполнить выход. Попробуйте снова.",
                [{ text: "OK" }],
            );
        } finally {
            setIsLoggingOut(false);
        }
    }, [onConfirmLogout, handleClose]);

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
                <Text style={styles.title}>Выход из аккаунта</Text>
                {renderCloseButton()}
            </View>
        </View>
    );

    // Render content
    const renderContent = () => (
        <View style={styles.content}>
            <Text style={styles.message}>
                Вы уверены, что хотите выйти из аккаунта?
            </Text>
            {userName !== "Пользователь" && (
                <Text style={styles.userName}>{userName}</Text>
            )}
        </View>
    );

    // Render actions
    const renderActions = () => (
        <View style={styles.actions}>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                activeOpacity={0.7}
                disabled={isLoggingOut}
            >
                <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.logoutButton,
                    isLoggingOut && styles.logoutButtonDisabled,
                ]}
                onPress={handleConfirmLogout}
                disabled={isLoggingOut}
                activeOpacity={0.8}
            >
                <Text
                    style={[
                        styles.logoutButtonText,
                        isLoggingOut && styles.logoutButtonTextDisabled,
                    ]}
                >
                    {isLoggingOut ? "Выходим..." : "Выйти"}
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
                {renderContent()}
                {renderActions()}
            </View>
        </ModalWrapper>
    );
});

LogoutConfirmationModal.displayName = "LogoutConfirmationModal";
export default LogoutConfirmationModal;

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

    // Content styles
    content: {
        gap: 12,
        alignItems: "center",
    },
    message: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 16,
        lineHeight: 22,
        textAlign: "center",
    },
    userName: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
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
    logoutButton: {
        flex: 1,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FF4444",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#FF4444",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutButtonDisabled: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        shadowOpacity: 0,
        elevation: 0,
    },
    logoutButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    logoutButtonTextDisabled: {
        color: "rgba(255, 255, 255, 0.4)",
    },
});
