import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { ReportHeader } from "@/src/client/components/reports/header";
import { useReports } from "@/src/contexts/ReportDataProvider";
import { useMoneyFlow } from "./_layout";

import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { textStyles } from "@/src/client/styles/ui/text.styles";
import ValueBadge from "@/src/client/components/ValueBadge";
import ListItemIcon from "@/src/client/components/ceo/ListItemIcon";

export default function MoneyflowReports() {
    const router = useRouter();
    const { setMoneyFlowData } = useMoneyFlow();

    const {
        moneyflow,
        organizations,
        filters,
        setDate,
        setPeriod,
        setLocation,
        loading,
        error,
    } = useReports();

    // Move the transformation logic outside useEffect
    const transformedData = useMemo(() => {
        if (!moneyflow) return null;

        const incomes = (data) => {
            const paytypes = data.income_by_pay_type.map((el) => ({
                id: el.id,
                name: el.payment_type,
                amount: el.amount,
            }));
            const categories = data.income_by_category.map((el) => ({
                id: el.id,
                name: el.category,
                amount: el.amount,
            }));

            return {
                id: data.id,
                label: data.label,
                type: data.type,
                value: data.value,
                data: [...paytypes, ...categories],
            };
        };

        return {
            dishes: moneyflow.dishes,
            writeoffs: moneyflow.writeoffs,
            expenses: moneyflow.expenses,
            incomes: incomes(moneyflow.incomes),
        };
    }, [moneyflow]);

    // Use useEffect only to update the context, not for transformation
    useEffect(() => {
        if (transformedData) {
            setMoneyFlowData(transformedData);
        }
    }, [transformedData]); // Only depend on transformedData, remove setMoneyFlowData

    const renderValueBadge = (value: string, type: string) => (
        <ValueBadge value={String(value)} type={type} />
    );

    const renderGeneralCard = () => {
        if (!moneyflow) return null;

        const { dishes, writeoffs, expenses, incomes } = moneyflow;

        return (
            <View style={cardStyles.section}>
                <Text style={cardStyles.sectionTitle}>Сегодня</Text>
                <View style={cardStyles.card}>
                    {/* Dishes */}
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/ceo/reports/moneyflow/dishes")
                        }
                    >
                        <View style={styles.listItemContainer}>
                            <ListItemIcon
                                label={dishes?.label || ""}
                                value={
                                    dishes?.type && dishes?.value
                                        ? renderValueBadge(
                                              String(dishes.value),
                                              dishes.type,
                                          )
                                        : String(dishes?.value || "")
                                }
                                icon={
                                    <Ionicons
                                        name="restaurant"
                                        size={20}
                                        color="white"
                                    />
                                }
                                withChevron={true}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Writeoffs */}
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/ceo/reports/moneyflow/writeoffs")
                        }
                    >
                        <View style={styles.listItemContainer}>
                            <ListItemIcon
                                label={writeoffs?.label || ""}
                                value={
                                    writeoffs?.type && writeoffs?.value
                                        ? renderValueBadge(
                                              String(writeoffs.value),
                                              writeoffs.type,
                                          )
                                        : String(writeoffs?.value || "")
                                }
                                icon={
                                    <Ionicons
                                        name="receipt-sharp"
                                        size={20}
                                        color="white"
                                    />
                                }
                                withChevron={true}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Expenses */}
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/ceo/reports/moneyflow/expenses")
                        }
                    >
                        <View style={styles.listItemContainer}>
                            <ListItemIcon
                                label={expenses?.label || ""}
                                value={
                                    expenses?.type && expenses?.value
                                        ? renderValueBadge(
                                              String(expenses.value),
                                              expenses.type,
                                          )
                                        : String(expenses?.value || "")
                                }
                                icon={
                                    <Ionicons
                                        name="arrow-down"
                                        size={20}
                                        color={textStyles.negative.color}
                                    />
                                }
                                iconType="negative"
                                withChevron={true}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Incomes */}
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/ceo/reports/moneyflow/incomes")
                        }
                    >
                        <View style={styles.listItemContainer}>
                            <ListItemIcon
                                label={incomes?.label || ""}
                                value={
                                    incomes?.type && incomes?.value
                                        ? renderValueBadge(
                                              String(incomes.value),
                                              incomes.type,
                                          )
                                        : String(incomes?.value || "")
                                }
                                icon={
                                    <Ionicons
                                        name="arrow-up"
                                        size={20}
                                        color={textStyles.positive.color}
                                    />
                                }
                                iconType="positive"
                                withChevron={true}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // Loading state
    if (loading) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Денежные отчеты"
                    date={filters.date}
                    period={filters.period}
                    location={filters.organization_id}
                    onBack={() => router.push("/ceo/reports")}
                    onDateChange={setDate}
                    onPeriodChange={setPeriod}
                    onLocationChange={setLocation}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3C82FD" />
                    <Text style={styles.loadingText}>Загрузка данных...</Text>
                </View>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={[styles.container, backgroundsStyles.generalBg]}>
                <ReportHeader
                    title="Денежные отчеты"
                    date={filters.date}
                    period={filters.period}
                    location={filters.organization_id}
                    onBack={() => router.push("/ceo/reports")}
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
                title="Денежные отчеты"
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
                {renderGeneralCard()}
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
    listItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
});
