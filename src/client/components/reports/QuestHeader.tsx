import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { textStyles } from "@/src/client/styles/ui/text.styles";
import { ReportCalendar } from "@/src/client/components/reports/Calendar";

interface Employee {
    id: string;
    name: string;
}

interface QuestHeaderProps {
    title: string;
    onBack?: () => void;
    date?: string;
    onDateChange?: (date: string) => void;
    employee?: string;
    onEmployeeChange?: (employeeId: string) => void;
    employees?: Employee[];
    completed?: string;
    onCompletedChange?: (value: string) => void;
    showDateSelector?: boolean;
    showEmployeeSelector?: boolean;
    showCompletedSelector?: boolean;
}

const COMPLETED_OPTIONS = [
    { label: "Все", value: "" },
    { label: "Выполненные", value: "true" },
    { label: "Невыполненные", value: "false" },
];

export function QuestHeader({
    title,
    onBack,
    date = "",
    onDateChange,
    employee = "",
    onEmployeeChange,
    employees = [],
    completed = "",
    onCompletedChange,
    showDateSelector = true,
    showEmployeeSelector = true,
    showCompletedSelector = true,
}: QuestHeaderProps) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showCompletedModal, setShowCompletedModal] = useState(false);

    const EMPLOYEE_OPTIONS = useMemo(() => {
        return [
            { label: "Все сотрудники", value: "" },
            ...employees.map((e) => ({
                label: e.name,
                value: String(e.id),
            })),
        ];
    }, [employees]);

    const handleEmployeeSelect = (value: string) => {
        onEmployeeChange?.(value);
        setShowEmployeeModal(false);
    };

    const handleCompletedSelect = (value: string) => {
        onCompletedChange?.(value);
        setShowCompletedModal(false);
    };

    const handleDateSelect = (selectedDate: string) => {
        onDateChange?.(selectedDate);
    };

    const getEmployeeLabel = (value: string) => {
        if (!value) return "Все сотрудники";
        const item = EMPLOYEE_OPTIONS.find((e) => e.value === value);
        return item ? item.label : "Все сотрудники";
    };

    const getCompletedLabel = (value: string) => {
        if (!value) return "Все";
        const item = COMPLETED_OPTIONS.find((c) => c.value === value);
        return item ? item.label : "Все";
    };

    type ItemProps = {
        label: string;
        value: string;
    };

    const renderModal = (
        visible: boolean,
        onClose: () => void,
        items: ItemProps[],
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
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.modalItem,
                                    String(item.value) ===
                                        String(selectedItem) &&
                                        styles.modalItemSelected,
                                ]}
                                onPress={() => onSelect(item.value)}
                            >
                                <Text
                                    style={[
                                        styles.modalItemText,
                                        String(item.value) ===
                                            String(selectedItem) &&
                                            styles.modalItemTextSelected,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                                {String(item.value) ===
                                    String(selectedItem) && (
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
                {showEmployeeSelector && (
                    <TouchableOpacity
                        style={[styles.filterButton, styles.filterButtonWide]}
                        onPress={() => setShowEmployeeModal(true)}
                    >
                        <Ionicons
                            name="person-outline"
                            size={18}
                            color="#FFFFFF"
                        />
                        <Text
                            style={[
                                styles.filterText,
                                styles.filterTextTruncate,
                            ]}
                            numberOfLines={1}
                        >
                            {getEmployeeLabel(employee)}
                        </Text>
                        <Ionicons
                            name="chevron-down"
                            size={20}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                )}

                {showDateSelector && (
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowCalendar(true)}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#FFFFFF"
                        />
                        <Text style={styles.filterText}>
                            {date || "Все даты"}
                        </Text>
                    </TouchableOpacity>
                )}

                {showCompletedSelector && (
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowCompletedModal(true)}
                    >
                        <Text style={styles.filterText}>
                            {getCompletedLabel(completed)}
                        </Text>
                        <Ionicons
                            name="chevron-down"
                            size={20}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                )}
            </View>

            <ReportCalendar
                visible={showCalendar}
                onClose={() => setShowCalendar(false)}
                onDateSelect={handleDateSelect}
                initialDate={date}
            />

            {renderModal(
                showEmployeeModal,
                () => setShowEmployeeModal(false),
                EMPLOYEE_OPTIONS,
                employee,
                handleEmployeeSelect,
            )}

            {renderModal(
                showCompletedModal,
                () => setShowCompletedModal(false),
                COMPLETED_OPTIONS,
                completed,
                handleCompletedSelect,
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
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        ...textStyles.white,
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
        flex: 1,
    },
    filterText: {
        color: "#FFFFFF",
        fontSize: 14,
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
