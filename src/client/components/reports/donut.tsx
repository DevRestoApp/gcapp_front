import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, G } from "react-native-svg";

import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { ListCard } from "@/src/client/components/ListCard";
import { list } from "postcss";

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
    // TODO Найти норм библиотеку с красивыми чартами для использования дефолтные свг дерьмо
    const renderDonutChart = () => {
        const size = 240;
        const centerX = size / 2;
        const centerY = size / 2;
        const outerRadius = 120;
        const innerRadius = 72;

        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -90; // Start from top

        const paths = chartData.map((item, index) => {
            const angle = (item.value / total) * 360;
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
        });

        return (
            <Svg width={size} height={size}>
                <G>{paths}</G>
            </Svg>
        );
    };

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

    // Calculate percentages and positions
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const dataWithPercentages = chartData.map((item) => ({
        ...item,
        percentage: Math.round((item.value / total) * 100),
    }));

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

            <ListCard items={listItems}></ListCard>
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
});
