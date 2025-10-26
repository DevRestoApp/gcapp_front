import React from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Text,
} from "react-native";
import { useRouter } from "expo-router";
import { ReportHeader } from "@/src/client/components/reports/header";
import { ReportSalesChart } from "@/src/client/components/reports/salesBarChart";
import { ReportDonutSection } from "@/src/client/components/reports/donut";
import MetricCard from "@/src/client/components/ceo/MetricCard";

import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

import { useReports } from "./_layout";

export default function Reports() {
    const router = useRouter();

    // Get everything from context - no need for local state
    const {
        metrics,
        sales,
        payments,
        categories,
        filters,
        setFilters,
        loading,
        error,
    } = useReports();

    const handleDateChange = (date: string) => {
        setFilters({ ...filters, date });
    };

    const handlePeriodChange = (period: string) => {
        setFilters({ ...filters, period });
    };

    const handleLocationChange = (location: string) => {
        setFilters({ ...filters, location });
    };

    const renderMainMetrics = () => {
        if (!metrics || metrics.length === 0) {
            return null;
        }

        return (
            <View style={cardStyles.section}>
                <Text style={cardStyles.sectionTitle}>Общие показатели</Text>
                <View style={cardStyles.card}>
                    {metrics.map((metric, index) => (
                        <React.Fragment key={metric.id}>
                            {index > 0 && <View style={cardStyles.divider} />}
                            <MetricCard {...metric} />
                        </React.Fragment>
                    ))}
                </View>
            </View>
        );
    };

    // Loading state
    if (loading) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Общие показатели"
                    date={filters.date}
                    period={filters.period}
                    location={filters.location}
                    onBack={() => router.back()}
                    onDateChange={handleDateChange}
                    onPeriodChange={handlePeriodChange}
                    onLocationChange={handleLocationChange}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3C82FD" />
                </View>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Общие показатели"
                    date={filters.date}
                    period={filters.period}
                    location={filters.location}
                    onBack={() => router.back()}
                    onDateChange={handleDateChange}
                    onPeriodChange={handlePeriodChange}
                    onLocationChange={handleLocationChange}
                />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    // Main content
    return (
        <View style={[styles.container, backgroundsStyles.generalBg]}>
            <ReportHeader
                title="Общие показатели"
                date={filters.date}
                period={filters.period}
                location={filters.location}
                onBack={() => router.back()}
                onDateChange={handleDateChange}
                onPeriodChange={handlePeriodChange}
                onLocationChange={handleLocationChange}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {renderMainMetrics()}

                {sales && sales.length > 0 && (
                    <ReportSalesChart title="Динамика продаж" data={sales} />
                )}

                {payments && (
                    <ReportDonutSection
                        title="Выручка по типам оплаты"
                        chartData={payments.chartData}
                        listItems={payments.listItems}
                    />
                )}

                {categories && (
                    <ReportDonutSection
                        title="Выручка по категориям"
                        chartData={categories.chartData}
                        listItems={categories.listItems}
                    />
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 16,
        paddingBottom: 32,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#FFFFFF",
        textAlign: "center",
    },
});
