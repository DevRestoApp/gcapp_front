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
    const total = data.reduce((sum, item) => sum + item.amount, 0);

    // chartData
    const chartData = data.map((item) => ({
        name: item[key],
        value: total ? Math.round((item.amount / total) * 100) : 0,
        color: randomColor(),
    }));

    // listItems
    const listItems = data.map((item) => ({
        label: item[key],
        sublabel: `${total ? Math.round((item.amount / total) * 100) : 0}%`,
        value: `${Math.round(item.amount).toLocaleString("ru-RU")} тг`,
    }));

    return { chartData, listItems };
};
function formatNumberShort(value) {
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

    /*[
        {
            date: "29.10",
            value: 150,
            label: "150",
        },{
        date: "30.10",
        value: 532,
        label: "532",
    },{
        date: "31.10",
        value: 664,
        label: "664",
    },
    ]*/
    const sales =
        salesDynamics?.daily_data?.map((el) => {
            return {
                date: el.date.slice(0, 5),
                value: el.revenue,
                label: formatNumberShort(el.revenue),
            };
        }) ?? [];

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
                    location={filters.organization_id}
                    onBack={() => router.push("/reports")}
                    onDateChange={setDate}
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
                    date={filters.date}
                    period={filters.period}
                    location={filters.organization_id}
                    onBack={() => router.push("/reports")}
                    onDateChange={setDate}
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
                date={filters.date}
                period={filters.period}
                location={filters.organization_id}
                onBack={() => router.push("/reports")}
                onDateChange={setDate}
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
