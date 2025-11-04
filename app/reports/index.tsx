import React, { useState, useEffect } from "react";
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
import { getAnalyticsData } from "@/src/server/ceo/analytics";
import { useReports } from "@/src/contexts/ReportDataProvider";
import { ReportHeader } from "@/src/client/components/reports/header";

export default function AnalyticsScreen() {
    const { filters, setDate, setPeriod, setLocation } = useReports();
    const [isLoading, setIsLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState<any>(null);

    const router = useRouter();

    // Fetch analytics data when filters change
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                console.log("Fetching analytics with filters:", filters);

                // Fetch analytics data with current filters
                const data = await getAnalyticsData(filters);

                console.log("Analytics data received:", data);
                setAnalyticsData(data);
            } catch (err) {
                console.error("Failed to load analytics data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [filters]); // Re-fetch when filters change

    const renderValueBadge = (value: string, type: string) => (
        <ValueBadge value={value} type={type} />
    );

    // Loading state
    if (isLoading || !analyticsData) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Аналитика"
                    date={filters.date}
                    period={filters.period}
                    location={filters.organization_id}
                    onDateChange={setDate}
                    onPeriodChange={setPeriod}
                    onLocationChange={setLocation}
                />
                <Loading />
            </View>
        );
    }

    return (
        <View style={[styles.container, backgroundsStyles.generalBg]}>
            {/* Header */}
            <ReportHeader
                title="Аналитика"
                date={filters.date}
                period={filters.period}
                location={filters.organization_id}
                onDateChange={setDate}
                onPeriodChange={setPeriod}
                onLocationChange={setLocation}
            />

            {/* Scrollable Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* General Metrics */}
                {analyticsData?.metrics?.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push("/reports/analytics")}
                    >
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Общие показатели
                            </Text>
                            <View style={cardStyles.card}>
                                {analyticsData.metrics.map(
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

                {/* Profit & Loss Report */}
                {analyticsData?.reports?.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push("/reports/expenses")}
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
                                    {analyticsData.reports.map(
                                        (report: any) => (
                                            <ReportCard
                                                key={report.id}
                                                {...report}
                                            />
                                        ),
                                    )}
                                </View>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        Посмотреть все
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Orders Report */}
                {analyticsData?.orders?.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push("/reports/orders")}
                    >
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Отчеты по заказам
                            </Text>
                            <View style={cardStyles.card}>
                                {analyticsData.orders.map(
                                    (item: any, index: number) => (
                                        <React.Fragment key={item.id}>
                                            {index > 0 && (
                                                <View
                                                    style={cardStyles.divider}
                                                />
                                            )}
                                            <ListItem
                                                label={item.label}
                                                value={
                                                    item.type
                                                        ? renderValueBadge(
                                                              item.value,
                                                              item.type,
                                                          )
                                                        : item.value
                                                }
                                            />
                                        </React.Fragment>
                                    ),
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Financial Reports */}
                {analyticsData?.financial?.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push("/reports/moneyflow")}
                    >
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Денежные отчеты
                            </Text>
                            <View style={cardStyles.card}>
                                {analyticsData.financial.map(
                                    (item: any, index: number) => (
                                        <React.Fragment key={item.id}>
                                            {index > 0 && (
                                                <View
                                                    style={cardStyles.divider}
                                                />
                                            )}
                                            <ListItem
                                                label={item.label}
                                                value={
                                                    item.type
                                                        ? renderValueBadge(
                                                              item.value,
                                                              item.type,
                                                          )
                                                        : item.value
                                                }
                                            />
                                        </React.Fragment>
                                    ),
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Inventory Reports */}
                {analyticsData?.inventory?.length > 0 && (
                    <TouchableOpacity
                        onPress={() => router.push("/reports/storage")}
                    >
                        <View style={cardStyles.section}>
                            <Text style={cardStyles.sectionTitle}>
                                Складские отчеты
                            </Text>
                            <View style={cardStyles.card}>
                                {analyticsData.inventory.map(
                                    (item: any, index: number) => (
                                        <React.Fragment key={item.id}>
                                            {index > 0 && (
                                                <View
                                                    style={cardStyles.divider}
                                                />
                                            )}
                                            <ListItem
                                                label={item.label}
                                                value={
                                                    item.type
                                                        ? renderValueBadge(
                                                              item.value,
                                                              item.type,
                                                          )
                                                        : item.value
                                                }
                                            />
                                        </React.Fragment>
                                    ),
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Employee Reports */}
                {analyticsData?.employees?.length > 0 && (
                    <View style={cardStyles.section}>
                        <Text style={cardStyles.sectionTitle}>
                            Отчеты по персоналу
                        </Text>
                        <View style={cardStyles.card}>
                            {analyticsData.employees.map(
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
                                                    "/reports/employees",
                                                );
                                            }}
                                        />
                                    </React.Fragment>
                                ),
                            )}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                    router.push("/reports/employees")
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
});
