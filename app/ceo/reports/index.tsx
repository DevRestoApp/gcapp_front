import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

import Loading from "@/src/client/components/Loading";

import EmployeeCard from "@/src/client/components/ceo/EmployeeCard";
import MetricCard from "@/src/client/components/ceo/MetricCard";
import ListItem from "@/src/client/components/ceo/ListItem";
import ReportCard from "@/src/client/components/ceo/ReportCard";
import ValueBadge from "@/src/client/components/ValueBadge";

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { useRouter } from "expo-router";
import { useReports } from "@/src/contexts/ReportDataProvider";
import { ReportHeader } from "@/src/client/components/reports/header";

export default function AnalyticsScreen() {
    const router = useRouter();

    // Get analytics data directly from context
    const {
        analytics,
        profitloss,
        organizations,
        filters,
        setDate,
        setPeriod,
        setLocation,
        loading,
        error,
    } = useReports();

    // { title, value, date, type }
    const expensesGeneral = [
        {
            id: 1,
            title: "Итого расходы",
            value: profitloss?.total_expenses?.toFixed(2) || "0.00",
            date: filters.date?.slice(0, 5) || "",
            type: "expense",
        },
        {
            id: 2,
            title: "Итого доходы",
            value: profitloss?.total_revenue?.toFixed(2) || "0.00",
            date: filters.date?.slice(0, 5) || "",
            type: "income",
        },
        {
            id: 3,
            title: "Итого чистая прибыль",
            value: profitloss?.gross_profit?.toFixed(2) || "0.00",
            date: filters.date?.slice(0, 5) || "",
            type: (profitloss?.gross_profit || 0) > 0 ? "income" : "expense",
        },
    ];

    const renderValue = (value: any, type?: string) => {
        if (!value && value !== 0) return <Text>-</Text>;

        if (type) {
            return <ValueBadge value={String(value)} type={type} />;
        }

        // Always wrap in Text component
        return <Text style={styles.valueText}>{String(value)}</Text>;
    };

    // Loading state
    if (loading) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Аналитика"
                    date={filters.date}
                    period={filters.period}
                    location={filters.organization_id}
                    onBack={() => router.push("/ceo")}
                    onDateChange={setDate}
                    onPeriodChange={setPeriod}
                    onLocationChange={setLocation}
                    showPeriodSelector={true}
                    showDateSelector={true}
                    showLocationSelector={true}
                />
                <Loading />
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Аналитика"
                    date={filters.date}
                    period={filters.period}
                    location={filters.organization_id}
                    onBack={() => router.push("/ceo")}
                    onDateChange={setDate}
                    onPeriodChange={setPeriod}
                    onLocationChange={setLocation}
                    showPeriodSelector={true}
                    showDateSelector={true}
                    showLocationSelector={true}
                />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, backgroundsStyles.generalBg]}>
            <ReportHeader
                title="Аналитика"
                date={filters.date}
                period={filters.period}
                location={filters.organization_id}
                onBack={() => router.push("/ceo")}
                onDateChange={setDate}
                onPeriodChange={setPeriod}
                onLocationChange={setLocation}
                organizations={organizations}
                showPeriodSelector={true}
                showDateSelector={true}
                showLocationSelector={true}
            />

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {analytics?.metrics && analytics.metrics.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push("/ceo/reports/analytics")}
                    >
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Общие показатели
                            </Text>
                            <View style={cardStyles.card}>
                                {analytics.metrics.map(
                                    (metric: any, index: number) => (
                                        <React.Fragment key={metric.id}>
                                            {index > 0 && (
                                                <View
                                                    style={cardStyles.divider}
                                                />
                                            )}
                                            <MetricCard {...metric} />
                                        </React.Fragment>
                                    ),
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {analytics?.reports && analytics.reports.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push("/ceo/reports/expenses")}
                    >
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Отчет о прибылях и убытках
                            </Text>
                            <View style={cardStyles.card}>
                                <Text style={cardStyles.subsectionTitle}>
                                    Сегодня
                                </Text>
                                <View style={cardStyles.reportsContainer}>
                                    {expensesGeneral.map((report: any) => (
                                        <ReportCard
                                            key={report.id}
                                            {...report}
                                        />
                                    ))}
                                </View>
                                <TouchableOpacity
                                    onPress={() =>
                                        router.push("/ceo/reports/expenses")
                                    }
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>
                                        Посмотреть все
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {analytics?.orders && analytics.orders.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push("/ceo/reports/orders")}
                    >
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Отчеты по заказам
                            </Text>
                            <View style={cardStyles.card}>
                                {analytics.orders.map(
                                    (item: any, index: number) => (
                                        <React.Fragment key={item.id}>
                                            {index > 0 && (
                                                <View
                                                    style={cardStyles.divider}
                                                />
                                            )}
                                            <ListItem
                                                label={item.label}
                                                value={renderValue(
                                                    item.value,
                                                    item.type,
                                                )}
                                            />
                                        </React.Fragment>
                                    ),
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {analytics?.financial && analytics.financial.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push("/ceo/reports/moneyflow")}
                    >
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Денежные отчеты
                            </Text>
                            <View style={cardStyles.card}>
                                {analytics.financial.map(
                                    (item: any, index: number) => (
                                        <React.Fragment key={item.id}>
                                            {index > 0 && (
                                                <View
                                                    style={cardStyles.divider}
                                                />
                                            )}
                                            <ListItem
                                                label={item.label}
                                                value={renderValue(
                                                    item.value,
                                                    item.type,
                                                )}
                                            />
                                        </React.Fragment>
                                    ),
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {analytics?.inventory && analytics.inventory.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push("/ceo/reports/storage")}
                    >
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Складские отчеты
                            </Text>
                            <View style={cardStyles.card}>
                                {analytics.inventory.map(
                                    (item: any, index: number) => (
                                        <React.Fragment key={item.id}>
                                            {index > 0 && (
                                                <View
                                                    style={cardStyles.divider}
                                                />
                                            )}
                                            <ListItem
                                                label={item.label}
                                                value={renderValue(
                                                    item.value,
                                                    item.type,
                                                )}
                                            />
                                        </React.Fragment>
                                    ),
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {analytics?.employees && analytics.employees.length > 0 && (
                    <View style={cardStyles.section}>
                        <Text style={cardStyles.sectionTitle}>
                            Отчеты по персоналу
                        </Text>
                        <View style={cardStyles.card}>
                            {analytics.employees.map(
                                (employee: any, index: number) => (
                                    <React.Fragment key={employee.id}>
                                        {index > 0 && (
                                            <View style={cardStyles.divider} />
                                        )}
                                        <EmployeeCard
                                            name={employee.name}
                                            amount={employee.amount}
                                            avatar={employee.avatar}
                                            role=""
                                            totalAmount=""
                                            shiftTime=""
                                            variant="simple"
                                            showStats={false}
                                            onPress={() => {
                                                router.push(
                                                    "/ceo/reports/employees",
                                                );
                                            }}
                                        />
                                    </React.Fragment>
                                ),
                            )}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                    router.push("/ceo/reports/employees")
                                }
                            >
                                <Text style={styles.buttonText}>
                                    Все сотрудники
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={{ height: 16 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
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
    button: {
        height: 44,
        paddingHorizontal: 14,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        marginTop: 16,
    },
    buttonText: {
        color: "#2C2D2E",
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 24,
    },
    valueText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 20,
    },
});
