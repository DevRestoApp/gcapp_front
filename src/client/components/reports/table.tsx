import React, { ReactNode } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export interface TableColumn {
    key: string;
    label: string;
    width?: number; // Use number for flex or fixed width
    flex?: number; // Flex weight for responsive columns
}

export interface TableRow {
    [key: string]: any;
    children?: TableRow[];
}

interface ReportTableProps {
    columns: TableColumn[];
    data: TableRow[];
    renderCell?: (value: any, key: string) => ReactNode;
}

interface TableRowComponentProps {
    row: TableRow;
    columns: TableColumn[];
    renderCell?: (value: any, key: string) => ReactNode;
    depth?: number;
}

function TableRowComponent({
    row,
    columns,
    renderCell,
    depth = 0,
}: TableRowComponentProps) {
    const { children, ...rowData } = row;
    const paddingLeft = depth * 20;

    return (
        <>
            <View style={styles.tableRow}>
                {columns.map((column, index) => {
                    const isFirstColumn = index === 0;
                    const cellStyle = [
                        styles.tableCell,
                        isFirstColumn && styles.tableCellLeft,
                        !isFirstColumn && styles.tableCellCenter,
                        column.flex && { flex: column.flex },
                        column.width && { width: column.width },
                    ];

                    return (
                        <View key={`${column.key}-${depth}`} style={cellStyle}>
                            <Text
                                style={[
                                    styles.cellText,
                                    isFirstColumn && { paddingLeft },
                                    isFirstColumn && styles.cellTextLeft,
                                ]}
                            >
                                {renderCell
                                    ? renderCell(
                                          rowData[column.key],
                                          column.key,
                                      )
                                    : rowData[column.key]}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {children &&
                children.length > 0 &&
                children.map((child, index) => (
                    <TableRowComponent
                        key={index}
                        row={child}
                        columns={columns}
                        renderCell={renderCell}
                        depth={depth + 1}
                    />
                ))}
        </>
    );
}

export function ReportTable({ columns, data, renderCell }: ReportTableProps) {
    return (
        <ScrollView>
            <View style={styles.tableContainer}>
                {/* Header */}
                <View style={styles.tableHeader}>
                    {columns.map((column, index) => {
                        const isFirstColumn = index === 0;
                        const headerStyle = [
                            styles.tableHeaderCell,
                            isFirstColumn && styles.tableCellLeft,
                            !isFirstColumn && styles.tableCellCenter,
                            column.flex && { flex: column.flex },
                            column.width && { width: column.width },
                        ];

                        return (
                            <View key={column.key} style={headerStyle}>
                                <Text
                                    style={[
                                        styles.headerText,
                                        isFirstColumn && styles.cellTextLeft,
                                    ]}
                                >
                                    {column.label}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Body */}
                <View>
                    {data.map((row, index) => (
                        <TableRowComponent
                            key={index}
                            row={row}
                            columns={columns}
                            renderCell={renderCell}
                            depth={0}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    tableContainer: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#2C2C2E",
        borderTopLeftRadius: 12,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
    },
    tableHeaderCell: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: "center",
    },
    headerText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#2C2C2E",
    },
    tableCell: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: "center",
    },
    tableCellLeft: {
        alignItems: "flex-start",
    },
    tableCellCenter: {
        alignItems: "flex-end",
    },
    cellText: {
        color: "#FFFFFF",
        fontSize: 16,
        lineHeight: 20,
        textAlign: "right",
    },
    cellTextLeft: {
        textAlign: "left",
    },
});
