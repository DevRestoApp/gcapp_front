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
import { ReportCalendarRange } from "@/src/client/components/reports/ReportCalendarRange";

interface ReportHeaderPeriodProps {
    title: string;
    dateFrom?: string;
    dateTo?: string;
    activePeriod?: string; // "day" | "week" | "month" | ""
    location?: string | number;
    onBack?: () => void;
    onDateRangeChange?: (dateFrom: string, dateTo: string) => void;
    onPeriodChange?: (period: string, dateFrom: string, dateTo: string) => void;
    onLocationChange?: (location: string) => void;
    organizations?: {
        name: string;
        code: string;
        id: number;
        is_active: boolean;
    }[];
}

const PERIODS = [
    { label: "День", value: "day", days: 1 },
    { label: "Неделя", value: "week", days: 7 },
    { label: "Месяц", value: "month", days: 30 },
];

const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const calcPeriodRange = (
    days: number,
): { dateFrom: string; dateTo: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const from = new Date(today);
    from.setDate(today.getDate() - (days - 1));
    return { dateFrom: formatDate(from), dateTo: formatDate(today) };
};

export function ReportHeaderPeriod({
    title,
    dateFrom = "",
    dateTo = "",
    activePeriod = "",
    location = "",
    onBack,
    onDateRangeChange,
    onPeriodChange,
    onLocationChange,
    organizations,
}: ReportHeaderPeriodProps) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    const LOCATIONS = useMemo(() => {
        if (organizations && organizations.length > 0) {
            return [
                { label: "Все точки", value: "" },
                ...organizations.map((org) => ({
                    label: org.name,
                    value: String(org.id),
                })),
            ];
        }
        return [];
    }, [organizations]);

    const handlePeriodPress = (period: (typeof PERIODS)[number]) => {
        const { dateFrom: from, dateTo: to } = calcPeriodRange(period.days);
        onPeriodChange?.(period.value, from, to);
    };

    const handlePeriodSelect = (selectedValue: string) => {
        const period = PERIODS.find((p) => p.value === selectedValue);
        if (period) handlePeriodPress(period);
        setShowPeriodModal(false);
    };

    const getPeriodLabel = (value: string) => {
        if (!value) return "Выбрать...";
        const item = PERIODS.find((p) => p.value === value);
        return item ? item.label : "Выбрать...";
    };

    const handleRangeSelect = (from: string, to: string) => {
        onDateRangeChange?.(from, to);
    };

    const handleLocationSelect = (selectedLocation: string) => {
        onLocationChange?.(selectedLocation);
        setShowLocationModal(false);
    };

    const getLocationLabel = (value: string | number) => {
        if (!value && value !== 0) return "Все точки";
        const stringValue = String(value);
        const item = LOCATIONS.find((l) => l.value === stringValue);
        return item ? item.label : "Все точки";
    };

    const rangeLabel = useMemo(() => {
        if (dateFrom && dateTo) {
            if (dateFrom === dateTo) return dateFrom;
            return `${dateFrom} — ${dateTo}`;
        }
        return "Период";
    }, [dateFrom, dateTo]);

    const isCustomRange = !activePeriod && dateFrom && dateTo;

    type ItemProps = { label: string; value: string };

    const renderModal = (
        visible: boolean,
        onClose: () => void,
        items: ItemProps[],
        selectedItem: string | number,
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
            {/* Header row */}
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

            {/* Filters row */}
            <View style={styles.filtersContainer}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowPeriodModal(true)}
                >
                    <Text style={styles.filterText}>
                        {getPeriodLabel(activePeriod)}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowCalendar(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#FFFFFF"
                    />
                    <Text style={styles.filterText} numberOfLines={1}>
                        {isCustomRange ? rangeLabel : "Период"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                {organizations && organizations.length > 0 && (
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowLocationModal(true)}
                    >
                        <Ionicons
                            name="location-outline"
                            size={18}
                            color="#FFFFFF"
                        />
                        <Text style={styles.filterText} numberOfLines={1}>
                            {getLocationLabel(location)}
                        </Text>
                        <Ionicons
                            name="chevron-down"
                            size={20}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                )}
            </View>

            <ReportCalendarRange
                visible={showCalendar}
                onClose={() => setShowCalendar(false)}
                onRangeSelect={handleRangeSelect}
                initialStartDate={dateFrom}
                initialEndDate={dateTo}
            />

            {renderModal(
                showPeriodModal,
                () => setShowPeriodModal(false),
                PERIODS,
                activePeriod,
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
        marginTop: 12,
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
    placeholder: { width: 28, height: 28 },
    filtersContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        gap: 8,
        paddingBottom: 12,
    },
    filterButton: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignItems: "center",
        gap: 4,
        borderRadius: 16,
        backgroundColor: "#1C1C1E",
    },
    filterText: {
        color: "#FFFFFF",
        fontSize: 14,
        lineHeight: 20,
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
