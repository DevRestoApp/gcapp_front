import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface ChartData {
    date: string;
    value: number;
    label: string;
}

interface ReportSalesChartProps {
    title: string;
    data: {
        revenue: ChartData[];
        checks: ChartData[];
        average: ChartData[];
    };
}

type TabType = "revenue" | "checks" | "average";

export function ReportSalesChart({ title, data }: ReportSalesChartProps) {
    const [activeTab, setActiveTab] = useState<TabType>("revenue");

    const resultData = data[activeTab];

    const maxValue = Math.max(...resultData.map((d) => d.value));
    const chartHeight = 120;

    const renderBar = (item: ChartData, index: number, barWidth: number) => {
        const hasValue = item.value > 0;
        const height = hasValue ? (item.value / maxValue) * chartHeight : 44;
        const color = hasValue ? "#20C774" : "#1C1C1E";

        return (
            <View
                key={index}
                style={[styles.barContainer, { width: barWidth }]}
            >
                <Svg
                    width={barWidth - 8}
                    height={chartHeight}
                    style={styles.svg}
                >
                    <Rect
                        x={0}
                        y={chartHeight - height}
                        width={barWidth - 8}
                        height={height}
                        fill={color}
                        rx={12}
                        ry={12}
                    />
                </Svg>

                <View style={styles.labelContainer}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <Text style={styles.valueText}>{item.label}</Text>
                </View>
            </View>
        );
    };

    const barWidth = 400 / resultData.length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "revenue" && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab("revenue")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "revenue" && styles.tabTextActive,
                        ]}
                    >
                        Выручка
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "checks" && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab("checks")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "checks" && styles.tabTextActive,
                        ]}
                    >
                        Кол.чек
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "average" && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab("average")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "average" && styles.tabTextActive,
                        ]}
                        numberOfLines={1}
                    >
                        Средний чек
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
                {resultData.map((item, index) =>
                    renderBar(item, index, barWidth),
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 24,
        lineHeight: 28,
        fontWeight: "700",
    },
    tabsContainer: {
        flexDirection: "row",
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        borderRadius: 12,
        backgroundColor: "#1C1C1E",
    },
    tab: {
        flex: 1,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        backgroundColor: "transparent",
    },
    tabActive: {
        backgroundColor: "#2C2C2E",
    },
    tabText: {
        fontSize: 16,
        lineHeight: 20,
        color: "#74767A",
    },
    tabTextActive: {
        color: "#FFFFFF",
    },
    chartContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
        paddingVertical: 16,
    },
    barContainer: {
        flex: 1,
        alignItems: "center",
        gap: 4,
    },
    svg: {
        marginBottom: 4,
    },
    labelContainer: {
        alignItems: "center",
    },
    dateText: {
        color: "#797A80",
        fontSize: 12,
        lineHeight: 16,
    },
    valueText: {
        color: "#FFFFFF",
        fontSize: 12,
        lineHeight: 16,
        fontWeight: "500",
    },
});
