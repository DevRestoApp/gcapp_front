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

import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

import { useReports } from "@/src/contexts/ReportDataProvider";

const RenderEmployeeCard = (employeeData) => {
    const { name, avatar, amount, data, role } = employeeData;

    return (
        <EmployeeCardExtended
            name={name}
            avatar={avatar}
            amount={amount}
            role={role}
            stats={data}
            onPress={() => {}}
        />
    );
};

export default function ExpensesReports() {
    const router = useRouter();

    const {
        analytics,
        organizations,
        filters,
        setDate,
        setPeriod,
        setLocation,
        loading,
        error,
    } = useReports();

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

    // Error state
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

    const employees = analytics?.employees?.map((employees) => {
        /*const { name, avatarUrl, amount, data, role } = employeeData;*/
        return {
            id: employees.id,
            avatar: employees.avatar,
            amount: "100",
            name: employees.name,
            role: "Официант",
            data: [
                {
                    label: "Общая сумма",
                    value: employees.amount,
                },
                {
                    label: "Средний чек",
                    value: "0",
                },
                {
                    label: "Количество чеков",
                    value: "0",
                },
                {
                    label: "Количество возвратов",
                    value: "0",
                },
            ],
        };
    });

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
