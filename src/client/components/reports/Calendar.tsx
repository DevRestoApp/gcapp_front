import React, { useState, useCallback, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ============================================================================
// Types
// ============================================================================

interface CalendarProps {
    visible: boolean;
    onClose: () => void;
    onDateSelect: (date: string) => void;
    initialDate?: string;
}

// ============================================================================
// Constants
// ============================================================================

const MONTH_NAMES = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const SCREEN_WIDTH = Dimensions.get("window").width;
const CALENDAR_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 400);
const DAY_CELL_SIZE = (CALENDAR_WIDTH - 32 - 48) / 7; // padding and gaps

// ============================================================================
// Main Component
// ============================================================================

export function ReportCalendar({
    visible,
    onClose,
    onDateSelect,
    initialDate,
}: CalendarProps) {
    // ========================================================================
    // State Management
    // ========================================================================

    const parseInitialDate = useCallback(() => {
        if (initialDate) {
            const [day, month, year] = initialDate.split(".");
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        return new Date();
    }, [initialDate]);

    const [currentDate, setCurrentDate] = useState(parseInitialDate());
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        parseInitialDate(),
    );

    // ========================================================================
    // Computed Values
    // ========================================================================

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarData = useMemo(() => {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();

        let firstWeekDay = firstDayOfMonth.getDay() - 1;
        if (firstWeekDay === -1) firstWeekDay = 6;

        return {
            firstWeekDay,
            daysInMonth,
        };
    }, [year, month]);

    // ========================================================================
    // Utility Functions
    // ========================================================================

    const formatDate = useCallback((date: Date): string => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }, []);

    const isSelectedDate = useCallback(
        (day: number): boolean => {
            if (!selectedDate) return false;
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            return date.getTime() === selectedDate.getTime();
        },
        [selectedDate, year, month],
    );

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const prevMonth = useCallback(() => {
        setCurrentDate(new Date(year, month - 1, 1));
    }, [year, month]);

    const nextMonth = useCallback(() => {
        setCurrentDate(new Date(year, month + 1, 1));
    }, [year, month]);

    const handleDateClick = useCallback(
        (day: number) => {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            setSelectedDate(date);
        },
        [year, month],
    );

    const handleApply = useCallback(() => {
        if (selectedDate) {
            const formattedDate = formatDate(selectedDate);
            onDateSelect(formattedDate);
            onClose();
        }
    }, [selectedDate, formatDate, onDateSelect, onClose]);

    const handleReset = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setSelectedDate(today);
        setCurrentDate(today);
    }, []);

    // ========================================================================
    // Render Functions
    // ========================================================================

    const renderDayCell = useCallback(
        (day: number | null, index: number) => {
            if (day === null) {
                return (
                    <View
                        key={`empty-${index}`}
                        style={[
                            styles.dayCell,
                            { width: DAY_CELL_SIZE, height: DAY_CELL_SIZE },
                        ]}
                    />
                );
            }

            const isSelected = isSelectedDate(day);

            return (
                <TouchableOpacity
                    key={`day-${day}`}
                    onPress={() => handleDateClick(day)}
                    style={[
                        styles.dayCell,
                        { width: DAY_CELL_SIZE, height: DAY_CELL_SIZE },
                        isSelected && styles.dayCellSelected,
                    ]}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.dayText,
                            isSelected && styles.dayTextSelected,
                        ]}
                    >
                        {day}
                    </Text>
                </TouchableOpacity>
            );
        },
        [isSelectedDate, handleDateClick],
    );

    const renderDaysGrid = () => {
        const days: (number | null)[] = [];

        // Empty cells before first day
        for (let i = 0; i < calendarData.firstWeekDay; i++) {
            days.push(null);
        }

        // Days of month
        for (let day = 1; day <= calendarData.daysInMonth; day++) {
            days.push(day);
        }

        // Create rows
        const rows = [];
        for (let i = 0; i < days.length; i += 7) {
            const weekDays = days.slice(i, i + 7);
            rows.push(
                <View key={`row-${i}`} style={styles.weekRow}>
                    {weekDays.map((day, index) =>
                        renderDayCell(day, i + index),
                    )}
                </View>,
            );
        }

        return rows;
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.monthText}>
                {MONTH_NAMES[month]} {year}
            </Text>

            <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );

    const renderWeekDays = () => (
        <View style={styles.weekDaysRow}>
            {WEEK_DAYS.map((day, index) => (
                <View
                    key={day}
                    style={[styles.weekDayCell, { width: DAY_CELL_SIZE }]}
                >
                    <Text
                        style={[
                            styles.weekDayText,
                            index === 0 && styles.weekDayTextHighlight,
                        ]}
                    >
                        {day}
                    </Text>
                </View>
            ))}
        </View>
    );

    const renderActionButtons = () => (
        <View style={styles.actionButtons}>
            <TouchableOpacity
                onPress={handleReset}
                style={styles.resetButton}
                activeOpacity={0.7}
            >
                <Text style={styles.resetButtonText}>Сегодня</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleApply}
                style={[
                    styles.applyButton,
                    !selectedDate && styles.applyButtonDisabled,
                ]}
                disabled={!selectedDate}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.applyButtonText,
                        !selectedDate && styles.applyButtonTextDisabled,
                    ]}
                >
                    Применить
                </Text>
            </TouchableOpacity>
        </View>
    );

    // ========================================================================
    // Main Render
    // ========================================================================

    return (
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
                <View
                    style={styles.calendarContainer}
                    onStartShouldSetResponder={() => true}
                >
                    {renderHeader()}
                    {renderWeekDays()}
                    <View style={styles.daysGrid}>{renderDaysGrid()}</View>
                    {renderActionButtons()}
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    calendarContainer: {
        backgroundColor: "#1C1C1E",
        borderRadius: 20,
        padding: 16,
        width: CALENDAR_WIDTH,
    },

    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    navButton: {
        padding: 8,
    },
    monthText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },

    // Week Days
    weekDaysRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    weekDayCell: {
        alignItems: "center",
        paddingVertical: 8,
        marginRight: 4,
    },
    weekDayText: {
        color: "#8E8E93",
        fontSize: 13,
    },
    weekDayTextHighlight: {
        color: "#FFFFFF",
    },

    // Days Grid
    daysGrid: {
        marginBottom: 16,
    },
    weekRow: {
        flexDirection: "row",
        marginBottom: 4,
    },
    dayCell: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginRight: 4,
    },
    dayCellSelected: {
        backgroundColor: "#3C82FD",
    },
    dayText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
    dayTextSelected: {
        color: "#FFFFFF",
        fontWeight: "600",
    },

    // Action Buttons
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#2C2C2E",
        alignItems: "center",
    },
    resetButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#3C82FD",
        alignItems: "center",
    },
    applyButtonDisabled: {
        backgroundColor: "#2C2C2E",
    },
    applyButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    applyButtonTextDisabled: {
        color: "#8E8E93",
    },
});
