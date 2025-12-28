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

import { useReports } from "@/src/contexts/ReportDataProvider";

const prepareData = (data, key) => {
    if (!Array.isArray(data) || data.length === 0) {
        return { chartData: [], listItems: [] };
    }

    const randomColor = () =>
        "#" +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0");

    // Total sum for percent calculation
    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);

    // chartData
    const chartData = data.map((item) => ({
        name: item[key] || "Unknown",
        value: total ? Math.round((item.amount / total) * 100) : 0,
        color: randomColor(),
    }));

    // listItems
    const listItems = data.map((item) => ({
        label: item[key] || "Unknown",
        sublabel: `${total ? Math.round((item.amount / total) * 100) : 0}%`,
        value: `${Math.round(item.amount || 0).toLocaleString("ru-RU")} тг`,
    }));

    return { chartData, listItems };
};

function formatNumberShort(value) {
    if (!value || isNaN(value)) return "0";
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + "B";
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(0) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(0) + "K";
    return value.toString();
}

export default function Reports() {
    const router = useRouter();

    // Get everything from context
    const {
        moneyflow,
        analytics,
        salesDynamics,
        organizations,
        filters,
        setDate,
        setPeriod,
        setLocation,
        loading,
        error,
    } = useReports();

    const categories = prepareData(
        moneyflow?.incomes?.income_by_category,
        "category",
    );
    const payments = prepareData(
        moneyflow?.incomes?.income_by_pay_type,
        "payment_type",
    );

    // Safe sales data preparation with null checks
    const sales =
        salesDynamics?.daily_data && Array.isArray(salesDynamics.daily_data)
            ? {
                  revenue: salesDynamics.daily_data.map((el) => ({
                      date: el.date?.slice(0, 5) || "",
                      value: el.revenue || 0,
                      label: formatNumberShort(el.revenue || 0),
                  })),
                  checks: salesDynamics.daily_data.map((el) => ({
                      date: el.date?.slice(0, 5) || "",
                      value: el.checks_count || 0,
                      label: formatNumberShort(el.checks_count || 0),
                  })),
                  average: salesDynamics.daily_data.map((el) => ({
                      date: el.date?.slice(0, 5) || "",
                      value: el.average_check || 0,
                      label: formatNumberShort(el.average_check || 0),
                  })),
              }
            : null;

    const renderMainMetrics = () => {
        const metrics = analytics?.metrics;
        if (!metrics || metrics.length === 0) {
            return null;
        }

        return (
            <View style={cardStyles.section}>
                <Text style={cardStyles.sectionTitle}>Общие показатели</Text>
                <View style={cardStyles.card}>
                    {metrics.map((metric, index) => (
                        <React.Fragment key={metric.id || index}>
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
                    location={filters.organization_id}
                    onBack={() => router.push("/ceo/reports")}
                    onDateChange={setDate}
                    onPeriodChange={setPeriod}
                    onLocationChange={setLocation}
                    organizations={organizations}
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
                    date={filters.date}
                    period={filters.period}
                    location={filters.organization_id}
                    onBack={() => router.push("/ceo/reports")}
                    onDateChange={setDate}
                    onPeriodChange={setPeriod}
                    onLocationChange={setLocation}
                    organizations={organizations}
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
                location={filters.organization_id}
                onBack={() => router.push("/ceo/reports")}
                onDateChange={setDate}
                onPeriodChange={setPeriod}
                onLocationChange={setLocation}
                organizations={organizations}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {renderMainMetrics()}

                {sales && sales.revenue && sales.revenue.length > 0 && (
                    <ReportSalesChart title="Динамика продаж" data={sales} />
                )}

                {payments &&
                    payments.chartData &&
                    payments.chartData.length > 0 && (
                        <ReportDonutSection
                            title="Выручка по типам оплаты"
                            chartData={payments.chartData}
                            listItems={payments.listItems}
                        />
                    )}

                {categories &&
                    categories.chartData &&
                    categories.chartData.length > 0 && (
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
