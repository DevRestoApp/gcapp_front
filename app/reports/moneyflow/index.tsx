import React, { useState, useEffect } from "react";
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

interface ReportFilters {
    date: string;
    period: string;
    location: string;
}

export default function MoneyflowReports() {
    const router = useRouter();
    const { setMoneyFlowData } = useMoneyFlow();

    const {
        moneyflowData,
        filters,
        setDateRange,
        setPeriod,
        setLocation,
        getFormattedDateRange,
        loading,
        error,
    } = useReports();
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ReportFilters>({
        date: "01.09.2025",
        period: "День",
        location: "Все ресторан",
    });

    const [dishes, setDishes] = useState({});
    const [writeoffs, setWriteoff] = useState({});
    const [expenses, setExpenses] = useState({});
    const [incomes, setIncomes] = useState({});

    useEffect(() => {
        loadReportData();
    }, [filters]); // Reload data when filters change

    const loadReportData = async () => {
        try {
            setLoading(true);
            const data = moneyflowData;

            setDishes(data.dishes);
            setWriteoff(data.writeoffs);
            setExpenses(data.expenses);
            setIncomes(data.incomes);

            // Set data in context for child routes
            setMoneyFlowData({
                dishes: data.dishes,
                writeoffs: data.writeoffs,
                expenses: data.expenses,
                incomes: data.incomes,
            });
        } catch (error) {
            console.error("Error loading report data:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderValueBadge = (value, type) => (
        <ValueBadge value={value} type={type} />
    );

    const renderGeneralCard = () => {
        return (
            <View style={cardStyles.section}>
                <Text style={cardStyles.sectionTitle}>Сегодня</Text>
                <View style={{ ...cardStyles.card }}>
                    <TouchableOpacity
                        onPress={() => router.push("/reports/moneyflow/dishes")}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <ListItemIcon
                                label={dishes.label}
                                value={
                                    dishes.type
                                        ? renderValueBadge(
                                              dishes.value,
                                              dishes.type,
                                          )
                                        : dishes.value
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
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/reports/moneyflow/writeoffs")
                        }
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <ListItemIcon
                                label={writeoffs.label}
                                value={
                                    writeoffs.type
                                        ? renderValueBadge(
                                              writeoffs.value,
                                              writeoffs.type,
                                          )
                                        : writeoffs.value
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
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/reports/moneyflow/expenses")
                        }
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <ListItemIcon
                                label={expenses.label}
                                value={
                                    expenses.type
                                        ? renderValueBadge(
                                              expenses.value,
                                              expenses.type,
                                          )
                                        : expenses.value
                                }
                                icon={
                                    <AntDesign
                                        name="arrow-down"
                                        size={20}
                                        color={textStyles.negative.color}
                                    />
                                }
                                iconType={"negative"}
                                withChevron={true}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            router.push("/reports/moneyflow/incomes")
                        }
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <ListItemIcon
                                label={incomes.label}
                                value={
                                    incomes.type
                                        ? renderValueBadge(
                                              incomes.value,
                                              incomes.type,
                                          )
                                        : incomes.value
                                }
                                icon={
                                    <AntDesign
                                        name="arrow-up"
                                        size={20}
                                        color={textStyles.positive.color}
                                    />
                                }
                                iconType={"positive"}
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
                    date={getFormattedDateRange()}
                    period={filters.period}
                    location={filters.location}
                    onBack={() => router.push("/ceo/analytics")}
                    onDateChange={setDateRange}
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
                title="Денежные отчеты"
                date={getFormattedDateRange()}
                period={filters.period}
                location={filters.location}
                onBack={() => router.push("/ceo/analytics")}
                onDateChange={setDateRange}
                onPeriodChange={setPeriod}
                onLocationChange={setLocation}
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
    },
    card: {
        padding: 12,
        borderRadius: 20,
        gap: 8,
    },
});
