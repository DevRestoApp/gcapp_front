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

// ✅ Import from the context file, NOT from _layout
import { useReports } from "@/src/contexts/ReportDataProvider";

export default function Reports() {
    const router = useRouter();

    // Get everything from context
    const {
        metrics,
        sales,
        payments,
        categories,
        filters,
        setDateRange,
        setPeriod,
        setLocation,
        getFormattedDateRange,
        loading,
        error,
    } = useReports();

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
                    date={getFormattedDateRange()}
                    period={filters.period}
                    location={filters.location}
                    onBack={() => router.push("/ceo/analytics")}
                    onDateChange={setDateRange}
                    onPeriodChange={setPeriod}
                    onLocationChange={setLocation}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3C82FD" />
                    <Text style={styles.loadingText}>Загрузка отчетов...</Text>
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
                    date={getFormattedDateRange()}
                    period={filters.period}
                    location={filters.location}
                    onBack={() => router.push("/ceo/analytics")}
                    onDateChange={setDateRange}
                    onPeriodChange={setPeriod}
                    onLocationChange={setLocation}
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
                date={getFormattedDateRange()}
                period={filters.period}
                location={filters.location}
                onBack={() => router.push("/ceo/analytics")}
                onDateChange={setDateRange}
                onPeriodChange={setPeriod}
                onLocationChange={setLocation}
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
        gap: 12,
    },
    loadingText: {
        fontSize: 16,
        color: "#8E8E93",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#FF6B6B",
        textAlign: "center",
    },
});
