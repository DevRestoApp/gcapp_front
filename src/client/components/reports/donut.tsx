import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, G } from "react-native-svg";

import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { ListCard } from "@/src/client/components/ListCard";

interface DonutData {
    name: string;
    value: number;
    color: string;
}

interface ListItem {
    label: string;
    sublabel: string;
    value: string;
}

interface ReportDonutSectionProps {
    title: string;
    chartData: DonutData[];
    listItems: ListItem[];
}

export function ReportDonutSection({
    title,
    chartData,
    listItems,
}: ReportDonutSectionProps) {
    // Validate data before rendering
    if (!chartData || chartData.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.noDataText}>
                    Нет данных для отображения
                </Text>
            </View>
        );
    }

    const polarToCartesian = (
        centerX: number,
        centerY: number,
        radius: number,
        angleInDegrees: number,
    ) => {
        const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    };

    const describeArc = (
        x: number,
        y: number,
        outerRadius: number,
        innerRadius: number,
        startAngle: number,
        endAngle: number,
    ) => {
        const outerStart = polarToCartesian(x, y, outerRadius, endAngle);
        const outerEnd = polarToCartesian(x, y, outerRadius, startAngle);
        const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
        const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        // Validate all values before creating path
        const values = [
            outerStart.x,
            outerStart.y,
            outerRadius,
            outerEnd.x,
            outerEnd.y,
            innerEnd.x,
            innerEnd.y,
            innerRadius,
            innerStart.x,
            innerStart.y,
        ];

        // Check if any value is NaN or Infinity
        if (values.some((v) => !isFinite(v))) {
            console.warn("Invalid arc values detected", values);
            return "M 0 0"; // Return a valid but invisible path
        }

        return [
            "M",
            outerStart.x,
            outerStart.y,
            "A",
            outerRadius,
            outerRadius,
            0,
            largeArcFlag,
            0,
            outerEnd.x,
            outerEnd.y,
            "L",
            innerEnd.x,
            innerEnd.y,
            "A",
            innerRadius,
            innerRadius,
            0,
            largeArcFlag,
            1,
            innerStart.x,
            innerStart.y,
            "Z",
        ].join(" ");
    };

    const renderDonutChart = () => {
        const size = 240;
        const centerX = size / 2;
        const centerY = size / 2;
        const outerRadius = 120;
        const innerRadius = 72;

        // Calculate total and validate
        const total = chartData.reduce((sum, item) => {
            const value = Number(item.value);
            return sum + (isFinite(value) ? value : 0);
        }, 0);

        // If total is 0 or invalid, don't render chart
        if (!total || !isFinite(total)) {
            return null;
        }

        let currentAngle = -90; // Start from top

        const paths = chartData
            .filter((item) => {
                const value = Number(item.value);
                return isFinite(value) && value > 0;
            })
            .map((item, index) => {
                const value = Number(item.value);
                const angle = (value / total) * 360;

                // Skip if angle is invalid
                if (!isFinite(angle) || angle === 0) {
                    return null;
                }

                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;

                const path = describeArc(
                    centerX,
                    centerY,
                    outerRadius,
                    innerRadius,
                    startAngle,
                    endAngle,
                );

                currentAngle = endAngle;

                return <Path key={index} d={path} fill={item.color} />;
            })
            .filter(Boolean); // Remove null entries

        return (
            <Svg width={size} height={size}>
                <G>{paths}</G>
            </Svg>
        );
    };

    // Calculate percentages
    const total = chartData.reduce((sum, item) => {
        const value = Number(item.value);
        return sum + (isFinite(value) ? value : 0);
    }, 0);

    const dataWithPercentages = chartData
        .filter((item) => {
            const value = Number(item.value);
            return isFinite(value) && value > 0;
        })
        .map((item) => {
            const value = Number(item.value);
            const percentage =
                total > 0 ? Math.round((value / total) * 100) : 0;
            return {
                ...item,
                percentage: isFinite(percentage) ? percentage : 0,
            };
        });

    const getPercentagePositions = () => {
        const positions = [
            { bottom: 62, right: 110 },
            { bottom: 70, left: 107 },
            { top: 120, left: 81 },
            { top: 62, right: 117 },
        ];
        return positions;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.chartContainer}>
                {renderDonutChart()}

                {dataWithPercentages.slice(0, 4).map((item, index) => {
                    const positions = getPercentagePositions();
                    const position = positions[index];

                    if (!position) return null;

                    return (
                        <View key={index} style={[styles.percentage, position]}>
                            <Text style={styles.percentageText}>
                                {item.percentage}%
                            </Text>
                        </View>
                    );
                })}
            </View>

            {listItems && listItems.length > 0 && (
                <ListCard items={listItems} />
            )}
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
    chartContainer: {
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        paddingVertical: 16,
        paddingHorizontal: 59,
    },
    percentage: {
        position: "absolute",
    },
    percentageText: {
        color: "#FFFFFF",
        fontSize: 12,
        lineHeight: 16,
    },
    noDataText: {
        color: "#8E8E93",
        fontSize: 16,
        textAlign: "center",
        paddingVertical: 32,
    },
});
