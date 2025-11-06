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
import ReportCard from "@/src/client/components/ceo/ReportCard";
import { ReportTable } from "@/src/client/components/reports/table";

import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

// ✅ Import from the context file, NOT from _layout
import { useReports } from "@/src/contexts/ReportDataProvider";

export default function ExpensesReports() {
    const router = useRouter();

    // Get everything from context
    const {
        profitloss,
        organizations,
        filters,
        setDate,
        setPeriod,
        setLocation,
        loading,
        error,
    } = useReports();

    // get data from context provider
    const renderGeneralCard = () => {
        const { total_expenses, total_revenue, gross_profit } = profitloss;

        // { title, value, date, type }
        const expensesGeneral = [
            {
                id: 1,
                title: "Итого расходы",
                value: total_expenses,
                date: filters.date.slice(0, 5) ?? "",
                type: "expense",
            },
            {
                id: 2,
                title: "Итого доходы",
                value: total_revenue,
                date: filters.date.slice(0, 5) ?? "",
                type: "income",
            },
            {
                id: 3,
                title: "Итого чистая прибыль",
                value: gross_profit,
                date: filters.date.slice(0, 5) ?? "",
                type: "income",
            },
        ];

        if (!expensesGeneral || expensesGeneral.length === 0) {
            return null;
        }

        return (
            <View style={styles.card}>
                <Text style={cardStyles.subsectionTitle}>Общие показатели</Text>
                <View style={cardStyles.reportsContainer}>
                    {expensesGeneral.map((metric) => (
                        <React.Fragment key={metric.id}>
                            <ReportCard {...metric} />
                        </React.Fragment>
                    ))}
                </View>
            </View>
        );
    };

    const renderItemListExpenses = (items) => {
        // { title, value, date, type }
        const expensesList = items.map((item) => {
            return {
                title: item.transaction_name,
                value: item.amount,
                date: filters.date.slice(0, 5) ?? "",
                type: "expense",
            };
        });
        if (!expensesList || expensesList.length === 0) {
            return null;
        }

        return (
            <View style={styles.card}>
                <Text style={cardStyles.subsectionTitle}>Детали расходов</Text>
                <View style={cardStyles.reportsContainer}>
                    {expensesList.map((item) => (
                        <React.Fragment key={item.id}>
                            <ReportCard {...item} />
                        </React.Fragment>
                    ))}
                </View>
            </View>
        );
    };
    const renderItemListRevenues = (items) => {
        const incomeList = items.map((item) => {
            return {
                title: item.category,
                value: item.amount,
                date: filters.date.slice(0, 5) ?? "",
                type: "income",
            };
        });
        if (!incomeList || incomeList.length === 0) {
            return null;
        }

        return (
            <View style={styles.card}>
                <Text style={cardStyles.subsectionTitle}>Детали доходов</Text>
                <View style={cardStyles.reportsContainer}>
                    {incomeList.map((item) => (
                        <React.Fragment key={item.id}>
                            <ReportCard {...item} />
                        </React.Fragment>
                    ))}
                </View>
            </View>
        );
    };

    const renderTable = (expenses, incomes) => {
        const incomeList = incomes.map((item) => {
            return {
                name: item.category,
                revenue: Number(item.amount.toFixed(2)),
            };
        });
        const expensesList = expenses.map((item) => {
            return {
                name: item.transaction_name,
                revenue: Number(item.amount.toFixed(2)),
            };
        });

        const expensesTable = {
            columns: [
                { key: "name", label: "", flex: 2 },
                { key: "revenue", label: "Все точки", flex: 1 },
            ],
            data: [...incomeList, ...expensesList],
        };

        if (!expensesTable) {
            return null;
        }

        return (
            <View style={styles.card}>
                <Text style={cardStyles.subsectionTitle}>Таблица</Text>
                <ReportTable
                    columns={expensesTable.columns}
                    data={expensesTable.data}
                />
            </View>
        );
    };

    // Loading state
    if (loading) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Расходы и прибыль"
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
                </View>
            </View>
        );
    }

    const { expenses_by_type, revenue_by_category } = profitloss;

    // Error state

    // TODO добавить везде если ошипка
    if (error) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Расходы и прибыль"
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
                title="Расходы и прибыль"
                date={filters.date}
                period={filters.period}
                location={filters.organization_id}
                onBack={() => router.push("/reports")}
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
                {renderGeneralCard()}
                {renderItemListExpenses(expenses_by_type)}
                {renderItemListRevenues(revenue_by_category)}
                {renderTable(expenses_by_type, revenue_by_category)}
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
    card: {
        padding: 12,
        borderRadius: 20,
        gap: 8,
    },
});
