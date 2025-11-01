import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CalendarProps {
    visible: boolean;
    onClose: () => void;
    onDateRangeSelect: (startDate: Date, endDate: Date) => void;
    initialStartDate?: Date;
    initialEndDate?: Date;
}

export function ReportCalendar({
    visible,
    onClose,
    onDateRangeSelect,
    initialStartDate,
    initialEndDate,
}: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate, setStartDate] = useState<Date | null>(
        initialStartDate || null,
    );
    const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);

    const monthNames = [
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

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    let firstWeekDay = firstDayOfMonth.getDay() - 1;
    if (firstWeekDay === -1) firstWeekDay = 6;

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const selectedDate = new Date(year, month, day);
        selectedDate.setHours(0, 0, 0, 0);

        if (!startDate || (startDate && endDate)) {
            // Start new selection
            setStartDate(selectedDate);
            setEndDate(null);
        } else if (startDate && !endDate) {
            // Complete the range
            if (selectedDate < startDate) {
                setEndDate(startDate);
                setStartDate(selectedDate);
            } else {
                setEndDate(selectedDate);
            }
        }
    };

    const isInRange = (day: number) => {
        if (!startDate || !endDate) return false;
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        return date >= startDate && date <= endDate;
    };

    const isStartDate = (day: number) => {
        if (!startDate) return false;
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === startDate.getTime();
    };

    const isEndDate = (day: number) => {
        if (!endDate) return false;
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === endDate.getTime();
    };

    const handleApply = () => {
        if (startDate && endDate) {
            onDateRangeSelect(startDate, endDate);
            onClose();
        }
    };

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
    };

    const renderDays = () => {
        const days = [];

        // Empty cells before first day
        for (let i = 0; i < firstWeekDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);
            const inRange = isInRange(day);

            days.push(
                <TouchableOpacity
                    key={day}
                    onPress={() => handleDateClick(day)}
                    style={[
                        styles.dayCell,
                        inRange && styles.dayCellInRange,
                        (isStart || isEnd) && styles.dayCellSelected,
                    ]}
                >
                    <Text
                        style={[
                            styles.dayText,
                            (isStart || isEnd) && styles.dayTextSelected,
                        ]}
                    >
                        {day}
                    </Text>
                </TouchableOpacity>,
            );
        }

        return days;
    };

    const days = renderDays();
    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
        rows.push(
            <View key={`row-${i}`} style={styles.weekRow}>
                {days.slice(i, i + 7)}
            </View>,
        );
    }

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
                            {monthNames[month]} {year}
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

                    {/* Week Days */}
                    <View style={styles.weekDaysRow}>
                        {weekDays.map((day, index) => (
                            <View key={day} style={styles.weekDayCell}>
                                <Text
                                    style={[
                                        styles.weekDayText,
                                        index === 0 &&
                                            styles.weekDayTextHighlight,
                                    ]}
                                >
                                    {day}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Days Grid */}
                    <View style={styles.daysGrid}>{rows}</View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            onPress={handleReset}
                            style={styles.resetButton}
                        >
                            <Text style={styles.resetButtonText}>Сбросить</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleApply}
                            style={[
                                styles.applyButton,
                                (!startDate || !endDate) &&
                                    styles.applyButtonDisabled,
                            ]}
                            disabled={!startDate || !endDate}
                        >
                            <Text
                                style={[
                                    styles.applyButtonText,
                                    (!startDate || !endDate) &&
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
        width: "90%",
        maxWidth: 400,
    },
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
    weekDaysRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    weekDayCell: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
    },
    weekDayText: {
        color: "#8E8E93",
        fontSize: 13,
    },
    weekDayTextHighlight: {
        color: "#FFFFFF",
    },
    daysGrid: {
        marginBottom: 16,
    },
    weekRow: {
        flexDirection: "row",
    },
    dayCell: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    dayCellInRange: {
        backgroundColor: "rgba(60, 130, 253, 0.2)",
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
