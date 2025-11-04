import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { ReportHeader } from "@/src/client/components/reports/header";

import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import ValueBadge from "@/src/client/components/ValueBadge";
import ListItemIcon from "@/src/client/components/ceo/ListItemIcon";
import MetricCard from "@/src/client/components/ceo/MetricCard";
import { useReports } from "@/src/contexts/ReportDataProvider";

interface ReportFilters {
    date: string;
    period: string;
    location: string;
}

export default function OrderReports() {
    const router = useRouter();

    const { orders, filters, setDate, setPeriod, setLocation, loading, error } =
        useReports();

    /*setChecks(orders.data.checks);
    setReturns(orders.data.returns);
    setAverages(orders.data.averages);*/

    const renderValueBadge = (value, type) => (
        <ValueBadge value={value} type={type} />
    );

    const renderAverages = () => {
        const { averages } = orders;
        return (
            <View style={cardStyles.section}>
                <Text style={cardStyles.sectionTitle}>Общие показатели</Text>
                <View style={cardStyles.card}>
                    {averages.map((item, index) => (
                        <React.Fragment key={item.id}>
                            {index > 0 && <View style={cardStyles.divider} />}
                            <MetricCard {...item} />
                        </React.Fragment>
                    ))}
                </View>
            </View>
        );
    };

    const renderGeneralCard = () => {
        const { checks, returns } = orders;
        return (
            <View style={cardStyles.section}>
                <Text style={cardStyles.sectionTitle}>Сегодня</Text>
                <View style={cardStyles.card}>
                    <TouchableOpacity
                        onPress={() => {
                            router.push("reports/orders/history");
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <ListItemIcon
                                label={checks.label}
                                value={
                                    checks.type
                                        ? renderValueBadge(
                                              checks.value,
                                              checks.type,
                                          )
                                        : checks.value
                                }
                                icon={
                                    <AntDesign
                                        name="alibaba"
                                        size={20}
                                        color="white"
                                    />
                                }
                                withChevron={true}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            router.push("reports/orders/returns");
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <ListItemIcon
                                label={returns.label}
                                value={
                                    returns.type
                                        ? renderValueBadge(
                                              returns.value,
                                              returns.type,
                                          )
                                        : returns.value
                                }
                                icon={
                                    <AntDesign
                                        name="alibaba"
                                        size={20}
                                        color="white"
                                    />
                                }
                                withChevron={true}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View
                style={{ ...styles.container, ...backgroundsStyles.generalBg }}
            >
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
                </View>
            </View>
        );
    }

    return (
        <View style={{ ...styles.container, ...backgroundsStyles.generalBg }}>
            <ReportHeader
                title="Отчет по заказам"
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
                {renderGeneralCard()}

                {renderAverages()}
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
    card: {
        padding: 12,
        borderRadius: 20,
        gap: 8,
    },
});
