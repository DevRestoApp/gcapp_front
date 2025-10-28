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
import EmployeeCardExtended from "@/src/client/components/ceo/EmployeeCardExtended";

import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

import { useReports } from "./_layout";
import ReportCard from "@/src/client/components/ceo/ReportCard";

const RenderEmployeeCard = (employeeData) => {
    const { name, avatar, stats } = employeeData;
    console.log("employeeData: ", employeeData);
    console.log(name, avatar, stats);

    return (
        <EmployeeCardExtended
            name={name}
            avatar={avatar}
            role=""
            stats={stats}
            onPress={() => {}}
        />
    );
};

export default function ExpensesReports() {
    const router = useRouter();

    // Get everything from context
    const { employees, filters, setFilters, loading, error } = useReports();

    const handleDateChange = (date: string) => {
        setFilters({ ...filters, date });
    };

    const handlePeriodChange = (period: string) => {
        setFilters({ ...filters, period });
    };

    const handleLocationChange = (location: string) => {
        setFilters({ ...filters, location });
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
                {/*// DATA HERE*/}
                {employees.map((emp) => (
                    <RenderEmployeeCard key={emp.id} {...emp} />
                ))}
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
