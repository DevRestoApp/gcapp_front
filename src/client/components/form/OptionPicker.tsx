// ============================================================================
// OptionPicker.tsx
// ============================================================================
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";

interface Option {
    label: string;
    value: string;
}

interface OptionPickerProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function OptionPicker({
    options,
    value,
    onChange,
    placeholder = "Выберите опцию",
}: OptionPickerProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <>
            <TouchableOpacity
                style={pickerStyles.container}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        pickerStyles.text,
                        !selectedOption && pickerStyles.placeholder,
                    ]}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <Path
                        d="M10.5998 13.1505C10.4827 13.2677 10.3238 13.3337 10.1581 13.3338L9.84147 13.3338C9.67612 13.3319 9.5179 13.2662 9.3998 13.1505L5.1248 8.86713C5.04592 8.78889 5.00155 8.6824 5.00155 8.5713C5.00155 8.4602 5.04592 8.3537 5.1248 8.27546L5.71647 7.6838C5.79327 7.60541 5.89839 7.56124 6.00813 7.56124C6.11787 7.56124 6.223 7.60541 6.2998 7.6838L9.9998 11.3921L13.6998 7.6838C13.778 7.60492 13.8845 7.56055 13.9956 7.56055C14.1067 7.56055 14.2132 7.60492 14.2915 7.6838L14.8748 8.27546C14.9537 8.3537 14.998 8.4602 14.998 8.5713C14.998 8.6824 14.9537 8.78889 14.8748 8.86713L10.5998 13.1505Z"
                        fill="white"
                    />
                </Svg>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={pickerStyles.modalOverlay}>
                    <View style={pickerStyles.modalContent}>
                        <View style={pickerStyles.modalHeader}>
                            <Text style={pickerStyles.modalTitle}>
                                Выберите опцию
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={pickerStyles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={pickerStyles.optionsList}>
                            {options.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        pickerStyles.option,
                                        value === option.value &&
                                            pickerStyles.optionSelected,
                                    ]}
                                    onPress={() => {
                                        onChange(option.value);
                                        setModalVisible(false);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            pickerStyles.optionText,
                                            value === option.value &&
                                                pickerStyles.optionTextSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const pickerStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "rgba(35, 35, 36, 1)",
    },
    text: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    placeholder: {
        color: "#797A80",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#232324",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "100%",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(43, 43, 44, 1)",
    },
    modalTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
    closeButton: {
        color: "#FFFFFF",
        fontSize: 24,
    },
    optionsList: {
        padding: 16,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    optionSelected: {
        backgroundColor: "rgba(43, 43, 44, 1)",
    },
    optionText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    optionTextSelected: {
        fontWeight: "600",
    },
});
