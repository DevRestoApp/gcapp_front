import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";

interface TableNumberGridProps {
    tableCount?: number; // Total number of tables
    selectedTable?: number | null;
    onTableSelect?: (tableNumber: number) => void;
    columns?: number; // Number of columns in grid
    disabledTables?: number[]; // Array of disabled table numbers
}

export default function TableNumberGrid({
    tableCount = 20,
    selectedTable = null,
    onTableSelect,
    columns = 4,
    disabledTables = [],
}: TableNumberGridProps) {
    const [selected, setSelected] = useState<number | null>(selectedTable);

    const handleTableChange = (table: string) => {
        console.log("Table changed to:", table);
        // Additional logic if needed beyond the order update
    };

    const handleRoomChange = (room: string) => {
        console.log("Room changed to:", room);
        // Additional logic if needed beyond the order update
    };

    const handleTablePress = (tableNumber: number) => {
        if (disabledTables.includes(tableNumber)) return;

        setSelected(tableNumber);
        onTableSelect?.(tableNumber);
    };

    const isTableDisabled = (tableNumber: number) => {
        return disabledTables.includes(tableNumber);
    };

    const isTableSelected = (tableNumber: number) => {
        return selected === tableNumber;
    };

    // Generate table numbers array
    const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.grid}>
                {tables.map((tableNumber) => {
                    const disabled = isTableDisabled(tableNumber);
                    const isSelected = isTableSelected(tableNumber);

                    return (
                        <TouchableOpacity
                            key={tableNumber}
                            style={[
                                styles.tableButton,
                                { width: `${100 / columns - 2}%` },
                                isSelected && styles.tableButtonSelected,
                                disabled && styles.tableButtonDisabled,
                            ]}
                            onPress={() => handleTablePress(tableNumber)}
                            disabled={disabled}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.tableText,
                                    isSelected && styles.tableTextSelected,
                                    disabled && styles.tableTextDisabled,
                                ]}
                            >
                                {tableNumber}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        padding: 4,
    },
    tableButton: {
        aspectRatio: 1,
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "transparent",
    },
    tableButtonSelected: {
        backgroundColor: "#fff",
        borderColor: "#fff",
    },
    tableButtonDisabled: {
        backgroundColor: "rgba(43, 43, 44, 0.5)",
        opacity: 0.5,
    },
    tableText: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
    },
    tableTextSelected: {
        color: "#000",
    },
    tableTextDisabled: {
        color: "rgba(255, 255, 255, 0.3)",
    },
});
