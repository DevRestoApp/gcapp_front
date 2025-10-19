import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReportHeaderProps {
    title: string;
    date?: string;
    period?: string;
    location?: string;
    onBack?: () => void;
    onDateChange?: (date: string) => void;
    onPeriodChange?: (period: string) => void;
    onLocationChange?: (location: string) => void;
}

const PERIODS = ["День", "Неделя", "Месяц", "Год"];
const LOCATIONS = ["Все ресторан", "Ресторан 1", "Ресторан 2", "Ресторан 3"];

// TODO import calendar date picker library for period filter

export function ReportHeader({
    title,
    date = "01.09.2025",
    period = "День",
    location = "Все ресторан",
    onBack,
    onDateChange,
    onPeriodChange,
    onLocationChange,
}: ReportHeaderProps) {
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    const handlePeriodSelect = (selectedPeriod: string) => {
        onPeriodChange?.(selectedPeriod);
        setShowPeriodModal(false);
    };

    const handleLocationSelect = (selectedLocation: string) => {
        onLocationChange?.(selectedLocation);
        setShowLocationModal(false);
    };

    const renderModal = (
        visible: boolean,
        onClose: () => void,
        items: string[],
        selectedItem: string,
        onSelect: (item: string) => void,
    ) => (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.modalContent}>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    item === selectedItem &&
                                        styles.modalItemSelected,
                                ]}
                                onPress={() => onSelect(item)}
                            >
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        item === selectedItem &&
                                            styles.modalItemTextSelected,
                                    ]}
                                >
                                    {item}
                                </Text>
                                {item === selectedItem && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#3C82FD"
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={onBack}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.title}>{title}</Text>

                <View style={styles.placeholder} />
            </View>

            <View style={styles.filtersContainer}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => onDateChange?.(date)}
                >
                    <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#FFFFFF"
                    />
                    <Text style={styles.filterText}>{date}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterButton, styles.filterButtonWide]}
                    onPress={() => setShowPeriodModal(true)}
                >
                    <Text style={styles.filterText}>{period}</Text>
                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterButton, styles.filterButtonWide]}
                    onPress={() => setShowLocationModal(true)}
                >
                    <Text
                        style={[styles.filterText, styles.filterTextTruncate]}
                        numberOfLines={1}
                    >
                        {location}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {renderModal(
                showPeriodModal,
                () => setShowPeriodModal(false),
                PERIODS,
                period,
                handlePeriodSelect,
            )}

            {renderModal(
                showLocationModal,
                () => setShowLocationModal(false),
                LOCATIONS,
                location,
                handleLocationSelect,
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#19191A",
    },
    header: {
        flexDirection: "row",
        height: 56,
        paddingHorizontal: 16,
        justifyContent: "space-between",
        alignItems: "center",
    },
    backButton: {
        width: 28,
        height: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    placeholder: {
        width: 28,
        height: 28,
    },
    filtersContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingBottom: 12,
        paddingHorizontal: 16,
    },
    filterButton: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 12,
        alignItems: "center",
        gap: 4,
        borderRadius: 16,
        backgroundColor: "#1C1C1E",
    },
    filterButtonWide: {
        minWidth: 106,
    },
    filterText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    filterTextTruncate: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1C1C1E",
        borderRadius: 20,
        width: "80%",
        maxHeight: "50%",
        overflow: "hidden",
    },
    modalItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
    },
    modalItemSelected: {
        backgroundColor: "rgba(60, 130, 253, 0.1)",
    },
    modalItemText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
    },
    modalItemTextSelected: {
        color: "#3C82FD",
        fontWeight: "600",
    },
});
