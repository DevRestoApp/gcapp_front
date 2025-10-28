import React, { useRef, useCallback, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
} from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";

interface AddQuestModalProps {
    onAddQuest?: (data: {
        name: string;
        amount: number;
        reward: string;
    }) => void;
    onCancel?: () => void;
}

export type AddQuestModalRef = {
    open: () => void;
    close: () => void;
    isVisible: () => boolean;
};

const AddQuestModal = React.forwardRef<AddQuestModalRef, AddQuestModalProps>(
    ({ onAddQuest, onCancel }, ref) => {
        const modalRef = useRef<ModalWrapperRef>(null);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [questName, setQuestName] = useState("");
        const [amount, setAmount] = useState("");
        const [reward, setReward] = useState("");

        // Imperative handle for parent control
        React.useImperativeHandle(ref, () => ({
            open: () => modalRef.current?.open(),
            close: () => modalRef.current?.close(),
            isVisible: () => modalRef.current?.isVisible() || false,
        }));

        // Reset form when modal opens
        const handleOpen = useCallback(() => {
            setQuestName("");
            setAmount("");
            setReward("");
            setIsSubmitting(false);
        }, []);

        // Handle modal close
        const handleClose = useCallback(() => {
            setQuestName("");
            setAmount("");
            setReward("");
            setIsSubmitting(false);
            onCancel?.();
            modalRef.current?.close();
        }, [onCancel]);

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
                // TODO: Replace with actual API call
                await new Promise((resolve) => setTimeout(resolve, 1000));

                onAddQuest?.({
                    name: questName.trim(),
                    amount: Number(amount),
                    reward: reward.trim(),
                });

                Alert.alert("Успешно", "Квест успешно создан", [
                    { text: "OK", onPress: handleClose },
                ]);
            } catch (error) {
                console.log(error);
                Alert.alert("Ошибка", "Не удалось создать квест");
            } finally {
                setIsSubmitting(false);
            }
        }, [questName, amount, reward, onAddQuest, handleClose]);

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
                    <Text style={styles.title}>Создать квест</Text>
                    {renderCloseButton()}
                </View>
            </View>
        );

        // Render quest name input
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

        // Render amount input
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

        // Render reward input
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
                        {renderAmountInput()}
                        {renderRewardInput()}
                    </View>
                    {renderActions()}
                </View>
            </ModalWrapper>
        );
    },
);

AddQuestModal.displayName = "AddQuestModal";
export default AddQuestModal;

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
