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

import { useReports } from "./_layout";

export default function ExpensesReports() {
    const router = useRouter();

    // Get everything from context
    const {
        expensesGeneral,
        expensesList,
        expensesTable,
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

    // get data from context provider
    const renderGeneralCard = () => {
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

    const renderItemList = () => {
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

    const renderTable = () => {
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
                    title="Расходы и прибыль"
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
                title="Расходы и прибыль"
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
                {renderGeneralCard()}
                {renderItemList()}
                {renderTable()}
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
