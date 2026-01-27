// ============================================================================
// OptionPicker.tsx
// ============================================================================
import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
    TextInput,
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
    enableSearch?: boolean;
    searchPlaceholder?: string;
}

export function OptionPicker({
    options,
    value,
    onChange,
    placeholder = "Выберите опцию",
    enableSearch = false,
    searchPlaceholder = "Поиск...",
}: OptionPickerProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const selectedOption = options.find((opt) => opt.value === value);

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) {
            return options;
        }
        const query = searchQuery.toLowerCase().trim();
        return options.filter((option) =>
            option.label.toLowerCase().includes(query),
        );
    }, [options, searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSearchQuery("");
    };

    const handleOptionSelect = (optionValue: string) => {
        onChange(optionValue);
        handleModalClose();
    };

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
                onRequestClose={handleModalClose}
            >
                <View style={pickerStyles.modalOverlay}>
                    <View style={pickerStyles.modalContent}>
                        <View style={pickerStyles.modalHeader}>
                            <Text style={pickerStyles.modalTitle}>
                                Выберите опцию
                            </Text>
                            <TouchableOpacity onPress={handleModalClose}>
                                <Text style={pickerStyles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {enableSearch && options.length > 5 && (
                            <View style={pickerStyles.searchWrapper}>
                                <TextInput
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholder={searchPlaceholder}
                                    placeholderTextColor="#797A80"
                                    style={pickerStyles.searchInput}
                                    returnKeyType="search"
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity
                                        onPress={handleClearSearch}
                                        style={pickerStyles.clearButton}
                                        hitSlop={{
                                            top: 10,
                                            bottom: 10,
                                            left: 10,
                                            right: 10,
                                        }}
                                    >
                                        <Text
                                            style={pickerStyles.clearButtonText}
                                        >
                                            ×
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        {searchQuery.trim() !== "" &&
                            filteredOptions.length > 0 && (
                                <Text style={pickerStyles.searchResultsText}>
                                    Найдено {filteredOptions.length}{" "}
                                    {filteredOptions.length === 1
                                        ? "опция"
                                        : "опций"}
                                </Text>
                            )}

                        <ScrollView style={pickerStyles.optionsList}>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            pickerStyles.option,
                                            value === option.value &&
                                                pickerStyles.optionSelected,
                                        ]}
                                        onPress={() =>
                                            handleOptionSelect(option.value)
                                        }
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
                                ))
                            ) : (
                                <View style={pickerStyles.emptyState}>
                                    <Text style={pickerStyles.emptyStateText}>
                                        По вашему запросу ничего не найдено
                                    </Text>
                                    <TouchableOpacity
                                        onPress={handleClearSearch}
                                        style={pickerStyles.clearSearchButton}
                                    >
                                        <Text
                                            style={
                                                pickerStyles.clearSearchButtonText
                                            }
                                        >
                                            Очистить поиск
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
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
        maxHeight: "80%",
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
    searchWrapper: {
        position: "relative",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    searchInput: {
        height: 44,
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingRight: 50,
        backgroundColor: "rgba(43, 43, 44, 1)",
        color: "#FFFFFF",
        fontSize: 16,
    },
    clearButton: {
        position: "absolute",
        right: 26,
        top: 26,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    clearButtonText: {
        color: "#797A80",
        fontSize: 18,
        fontWeight: "bold",
    },
    searchResultsText: {
        color: "#797A80",
        fontSize: 14,
        paddingHorizontal: 16,
        paddingVertical: 8,
        textAlign: "center",
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
    emptyState: {
        paddingVertical: 40,
        alignItems: "center",
    },
    emptyStateText: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 16,
    },
    clearSearchButton: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    clearSearchButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
    },
});
