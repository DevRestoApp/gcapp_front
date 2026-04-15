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

interface CalendarRangeProps {
    visible: boolean;
    onClose: () => void;
    onRangeSelect: (startDate: string, endDate: string) => void;
    initialStartDate?: string;
    initialEndDate?: string;
}

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
const DAY_CELL_SIZE = (CALENDAR_WIDTH - 32 - 48) / 7;

const parseDate = (dateStr?: string): Date | null => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split(".");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const isSameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const isBetween = (date: Date, start: Date, end: Date): boolean =>
    date.getTime() > start.getTime() && date.getTime() < end.getTime();

export function ReportCalendarRange({
    visible,
    onClose,
    onRangeSelect,
    initialStartDate,
    initialEndDate,
}: CalendarRangeProps) {
    const [currentDate, setCurrentDate] = useState(() => {
        return parseDate(initialStartDate) || new Date();
    });
    const [startDate, setStartDate] = useState<Date | null>(() =>
        parseDate(initialStartDate),
    );
    const [endDate, setEndDate] = useState<Date | null>(() =>
        parseDate(initialEndDate),
    );

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarData = useMemo(() => {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        let firstWeekDay = firstDayOfMonth.getDay() - 1;
        if (firstWeekDay === -1) firstWeekDay = 6;
        return { firstWeekDay, daysInMonth };
    }, [year, month]);

    const prevMonth = useCallback(() => {
        setCurrentDate(new Date(year, month - 1, 1));
    }, [year, month]);

    const nextMonth = useCallback(() => {
        setCurrentDate(new Date(year, month + 1, 1));
    }, [year, month]);

    const handleDateClick = useCallback(
        (day: number) => {
            const clicked = new Date(year, month, day);
            clicked.setHours(0, 0, 0, 0);

            if (!startDate || (startDate && endDate)) {
                // Start new selection
                setStartDate(clicked);
                setEndDate(null);
            } else {
                // Set end date
                if (clicked.getTime() < startDate.getTime()) {
                    // Clicked before start — swap
                    setEndDate(startDate);
                    setStartDate(clicked);
                } else if (isSameDay(clicked, startDate)) {
                    // Same day — set both
                    setEndDate(clicked);
                } else {
                    setEndDate(clicked);
                }
            }
        },
        [year, month, startDate, endDate],
    );

    const handleApply = useCallback(() => {
        if (startDate && endDate) {
            onRangeSelect(formatDate(startDate), formatDate(endDate));
            onClose();
        } else if (startDate) {
            // Single date selected — treat as single-day range
            onRangeSelect(formatDate(startDate), formatDate(startDate));
            onClose();
        }
    }, [startDate, endDate, onRangeSelect, onClose]);

    const handleReset = useCallback(() => {
        setStartDate(null);
        setEndDate(null);
    }, []);

    const getDayState = useCallback(
        (day: number): "start" | "end" | "between" | "single" | null => {
            if (!startDate) return null;
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);

            if (!endDate) {
                return isSameDay(date, startDate) ? "single" : null;
            }

            if (isSameDay(date, startDate) && isSameDay(date, endDate))
                return "single";
            if (isSameDay(date, startDate)) return "start";
            if (isSameDay(date, endDate)) return "end";
            if (isBetween(date, startDate, endDate)) return "between";
            return null;
        },
        [startDate, endDate, year, month],
    );

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

            const state = getDayState(day);
            const isEndpoint =
                state === "start" || state === "end" || state === "single";
            const isBetweenDays = state === "between";

            return (
                <TouchableOpacity
                    key={`day-${day}`}
                    onPress={() => handleDateClick(day)}
                    style={[
                        styles.dayCell,
                        { width: DAY_CELL_SIZE, height: DAY_CELL_SIZE },
                        isBetweenDays && styles.dayCellBetween,
                        state === "start" && styles.dayCellStart,
                        state === "end" && styles.dayCellEnd,
                    ]}
                    activeOpacity={0.7}
                >
                    <View
                        style={[
                            styles.dayInner,
                            isEndpoint && styles.dayInnerSelected,
                        ]}
                    >
                        <Text
                            style={[
                                styles.dayText,
                                (isEndpoint || isBetweenDays) &&
                                    styles.dayTextSelected,
                            ]}
                        >
                            {day}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        },
        [getDayState, handleDateClick],
    );

    const renderDaysGrid = () => {
        const days: (number | null)[] = [];
        for (let i = 0; i < calendarData.firstWeekDay; i++) days.push(null);
        for (let day = 1; day <= calendarData.daysInMonth; day++)
            days.push(day);

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

    const rangeLabel = useMemo(() => {
        if (startDate && endDate) {
            return `${formatDate(startDate)} — ${formatDate(endDate)}`;
        }
        if (startDate) {
            return `${formatDate(startDate)} — ...`;
        }
        return "Выберите даты";
    }, [startDate, endDate]);

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
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={prevMonth}
                            style={styles.navButton}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                        <Text style={styles.monthText}>
                            {MONTH_NAMES[month]} {year}
                        </Text>
                        <TouchableOpacity
                            onPress={nextMonth}
                            style={styles.navButton}
                        >
                            <Ionicons
                                name="chevron-forward"
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Range label */}
                    <View style={styles.rangeLabelContainer}>
                        <Text style={styles.rangeLabelText}>{rangeLabel}</Text>
                    </View>

                    {/* Week days */}
                    <View style={styles.weekDaysRow}>
                        {WEEK_DAYS.map((day) => (
                            <View
                                key={day}
                                style={[
                                    styles.weekDayCell,
                                    { width: DAY_CELL_SIZE },
                                ]}
                            >
                                <Text style={styles.weekDayText}>{day}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Days grid */}
                    <View style={styles.daysGrid}>{renderDaysGrid()}</View>

                    {/* Actions */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            onPress={handleReset}
                            style={styles.resetButton}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.resetButtonText}>Сбросить</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleApply}
                            style={[
                                styles.applyButton,
                                !startDate && styles.applyButtonDisabled,
                            ]}
                            disabled={!startDate}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.applyButtonText,
                                    !startDate &&
                                        styles.applyButtonTextDisabled,
                                ]}
                            >
                                Применить
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    navButton: { padding: 8 },
    monthText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },
    rangeLabelContainer: {
        alignItems: "center",
        marginBottom: 12,
    },
    rangeLabelText: {
        color: "#8E8E93",
        fontSize: 14,
    },
    weekDaysRow: { flexDirection: "row", marginBottom: 8 },
    weekDayCell: { alignItems: "center", paddingVertical: 8, marginRight: 4 },
    weekDayText: { color: "#8E8E93", fontSize: 13 },
    daysGrid: { marginBottom: 16 },
    weekRow: { flexDirection: "row", marginBottom: 2 },
    dayCell: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 4,
    },
    dayCellBetween: {
        backgroundColor: "rgba(60, 130, 253, 0.15)",
    },
    dayCellStart: {
        backgroundColor: "rgba(60, 130, 253, 0.15)",
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    dayCellEnd: {
        backgroundColor: "rgba(60, 130, 253, 0.15)",
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    dayInner: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    dayInnerSelected: {
        backgroundColor: "#3C82FD",
    },
    dayText: { color: "#FFFFFF", fontSize: 16 },
    dayTextSelected: { color: "#FFFFFF", fontWeight: "600" },
    actionButtons: { flexDirection: "row", gap: 12 },
    resetButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#2C2C2E",
        alignItems: "center",
    },
    resetButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
    applyButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#3C82FD",
        alignItems: "center",
    },
    applyButtonDisabled: { backgroundColor: "#2C2C2E" },
    applyButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
    applyButtonTextDisabled: { color: "#8E8E93" },
});
