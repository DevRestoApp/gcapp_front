import React, { useState, useRef, useCallback, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";

interface DishCommentsModalProps {
    dishName?: string;
    initialComment?: string;
    onSubmitComment?: (comment: string) => void;
    onClose?: () => void;
}

export type DishCommentsModalRef = {
    open: () => void;
    close: () => void;
    isVisible: () => boolean;
};

const DishCommentsModal = React.forwardRef<
    DishCommentsModalRef,
    DishCommentsModalProps
>(({ dishName, initialComment = "", onSubmitComment, onClose }, ref) => {
    const modalRef = useRef<ModalWrapperRef>(null);
    const [comment, setComment] = useState(initialComment);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync initial comment when it changes
    useEffect(() => {
        setComment(initialComment);
    }, [initialComment]);

    // Imperative handle for parent control
    React.useImperativeHandle(ref, () => ({
        open: () => modalRef.current?.open(),
        close: () => modalRef.current?.close(),
        isVisible: () => modalRef.current?.isVisible() || false,
    }));

    // Handle modal close
    const handleClose = useCallback(() => {
        onClose?.();
        modalRef.current?.close();
    }, [onClose]);

    // Handle modal open
    const handleOpen = useCallback(() => {
        setComment(initialComment);
        setIsSubmitting(false);
    }, [initialComment]);

    // Handle comment submission
    const handleSubmit = useCallback(async () => {
        const trimmedComment = comment.trim();

        if (trimmedComment.length === 0) {
            Alert.alert(
                "Пустой комментарий",
                "Пожалуйста, введите комментарий перед отправкой",
                [{ text: "OK" }],
            );
            return;
        }

        if (trimmedComment.length > 500) {
            Alert.alert(
                "Слишком длинный комментарий",
                "Комментарий должен быть не более 500 символов",
                [{ text: "OK" }],
            );
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            onSubmitComment?.(trimmedComment);

            // Show success message
            Alert.alert(
                "Комментарий отправлен",
                "Ваш комментарий успешно добавлен к блюду",
                [{ text: "OK" }],
            );

            // Clear and close
            setComment("");
            handleClose();
        } catch (error) {
            Alert.alert(
                "Ошибка",
                "Не удалось отправить комментарий. Попробуйте снова.",
                [{ text: "OK" }],
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [comment, onSubmitComment, handleClose]);

    // Handle comment change
    const handleCommentChange = useCallback((text: string) => {
        setComment(text);
    }, []);

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
                <Text style={styles.title}>Комментарии к еде</Text>
                {renderCloseButton()}
            </View>
            {dishName && <Text style={styles.subtitle}>Блюдо: {dishName}</Text>}
        </View>
    );

    // Render comment input
    const renderCommentInput = () => (
        <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Комментарии</Text>
                <TextInput
                    value={comment}
                    onChangeText={handleCommentChange}
                    style={styles.textInput}
                    placeholder="Введите ваш комментарий..."
                    placeholderTextColor="rgba(121, 122, 128, 0.6)"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    maxLength={500}
                    returnKeyType="default"
                    blurOnSubmit={false}
                />
                <Text style={styles.characterCounter}>
                    {comment.length}/500
                </Text>
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
                disabled={isSubmitting}
            >
                <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    (comment.trim().length === 0 || isSubmitting) &&
                        styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={comment.trim().length === 0 || isSubmitting}
                activeOpacity={0.8}
            >
                <Text
                    style={[
                        styles.submitButtonText,
                        (comment.trim().length === 0 || isSubmitting) &&
                            styles.submitButtonTextDisabled,
                    ]}
                >
                    {isSubmitting ? "Отправляем..." : "Отправить"}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ModalWrapper
            ref={modalRef}
            onOpen={handleOpen}
            onClose={onClose}
            animationType="scale"
            contentStyle={styles.modalContent}
        >
            <View style={styles.container}>
                {renderHeader()}
                {renderCommentInput()}
                {renderActions()}
            </View>
        </ModalWrapper>
    );
});

DishCommentsModal.displayName = "DishCommentsModal";
export default DishCommentsModal;

const styles = StyleSheet.create({
    modalContent: {
        padding: 0,
    },
    container: {
        padding: 20,
        gap: 20,
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
    subtitle: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 14,
        lineHeight: 20,
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

    // Input section styles
    inputSection: {
        gap: 16,
    },
    inputContainer: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 20,
        padding: 16,
        minHeight: 100,
    },
    inputLabel: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
        lineHeight: 20,
    },
    textInput: {
        color: "#ffffff",
        fontSize: 16,
        lineHeight: 22,
        flex: 1,
        minHeight: 60,
        textAlignVertical: "top",
        paddingVertical: 0,
    },
    characterCounter: {
        color: "rgba(121, 122, 128, 0.7)",
        fontSize: 12,
        textAlign: "right",
        marginTop: 8,
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
});
