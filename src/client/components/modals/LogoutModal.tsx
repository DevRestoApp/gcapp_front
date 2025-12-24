import * as Updates from "expo-updates";

import React, { useRef, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";

interface AccountActionsModalProps {
    userName?: string;
    currentRole?: string;
    onChangeRole?: () => void;
    onLogout?: () => void;
    onCancel?: () => void;
}

export type AccountActionsModalRef = {
    open: () => void;
    close: () => void;
    isVisible: () => boolean;
};

const AccountActionsModal = React.forwardRef<
    AccountActionsModalRef,
    AccountActionsModalProps
>(
    (
        {
            userName = "Пользователь",
            currentRole = "",
            onChangeRole,
            onLogout,
            onCancel,
        },
        ref,
    ) => {
        const modalRef = useRef<ModalWrapperRef>(null);
        const [isProcessing, setIsProcessing] = useState(false);

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
            setIsProcessing(false);
        }, []);

        // Handle change role
        const handleChangeRole = useCallback(async () => {
            setIsProcessing(true);

            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 500));

                onChangeRole?.();

                console.log("Смена роли", "Переход к выбору роли", [
                    { text: "OK" },
                ]);

                handleClose();
            } catch (error) {
                console.log(
                    "Ошибка",
                    "Не удалось сменить роль. Попробуйте снова.",
                    [{ text: "OK" }],
                );
            } finally {
                setIsProcessing(false);
            }
        }, [onChangeRole, handleClose]);

        // Handle logout
        const handleLogout = useCallback(async () => {
            setIsProcessing(true);

            try {
                console.log("a");
                onLogout?.();
                console.log("b");

                console.log("Выход выполнен", "Вы успешно вышли из системы", [
                    { text: "OK" },
                ]);

                handleClose();
            } catch (error) {
                console.log(
                    "Ошибка",
                    "Не удалось выполнить выход. Попробуйте снова.",
                    [{ text: "OK" }],
                );
            } finally {
                setIsProcessing(false);
            }
        }, [onLogout, handleClose]);

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
                    <Text style={styles.title}>Управление аккаунтом</Text>
                    {renderCloseButton()}
                </View>
            </View>
        );

        // Render content
        const renderContent = () => (
            <View style={styles.content}>
                <Text style={styles.message}>Выберите действие</Text>
                {userName !== "Пользователь" && (
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{userName}</Text>
                        {currentRole && (
                            <Text style={styles.userRole}>{currentRole}</Text>
                        )}
                    </View>
                )}
            </View>
        );

        // Render actions
        const renderActions = () => (
            <View style={styles.actions}>
                {/* Change Role Button */}
                <TouchableOpacity
                    style={[
                        styles.changeRoleButton,
                        isProcessing && styles.buttonDisabled,
                    ]}
                    onPress={handleChangeRole}
                    disabled={isProcessing}
                    activeOpacity={0.8}
                >
                    <Text style={styles.changeRoleButtonText}>
                        {isProcessing ? "Загрузка..." : "Сменить роль"}
                    </Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                    style={[
                        styles.logoutButton,
                        isProcessing && styles.logoutButtonDisabled,
                    ]}
                    onPress={handleLogout}
                    disabled={isProcessing}
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.logoutButtonText,
                            isProcessing && styles.logoutButtonTextDisabled,
                        ]}
                    >
                        {isProcessing ? "Выходим..." : "Выйти"}
                    </Text>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                    disabled={isProcessing}
                >
                    <Text style={styles.cancelButtonText}>Отмена</Text>
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
    },
);

AccountActionsModal.displayName = "AccountActionsModal";
export default AccountActionsModal;

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
        gap: 16,
        alignItems: "center",
    },
    message: {
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: 16,
        lineHeight: 22,
        textAlign: "center",
    },
    userInfo: {
        gap: 4,
        alignItems: "center",
    },
    userName: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    userRole: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 14,
        textAlign: "center",
    },

    // Actions styles
    actions: {
        gap: 12,
    },
    changeRoleButton: {
        height: 48,
        borderRadius: 24,
        backgroundColor: "#4A90E2",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#4A90E2",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    changeRoleButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    logoutButton: {
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
    cancelButton: {
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
    buttonDisabled: {
        opacity: 0.5,
    },
});
