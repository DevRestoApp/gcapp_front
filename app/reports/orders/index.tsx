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

// Mock API functions - replace these with your actual API calls
const fetchOrders = async (filters: ReportFilters) => {
    // TODO: Replace with actual API call
    // const response = await api.get('/reports/metrics', { params: filters });
    // return response.data;

    return {
        checks: {
            id: 12332,
            label: "Средний чек",
            value: "15 800 тг",
        },
        returns: {
            id: 31341,
            label: "Сумма возвратов",
            value: "-15 800 тг",
            type: "negative",
        },
    };
};
const fetchAverages = async (filters: ReportFilters) => {
    // TODO: Replace with actual API call
    // const response = await api.get('/reports/metrics', { params: filters });
    // return response.data;

    return [
        {
            id: 1,
            label: "Среднее количество",
            value: "4 блюда",
        },
        {
            id: 2,
            label: "Популярные блюда",
            value: "Самса с какашками",
            change: { value: "+23%", trend: "up" },
        },
        {
            id: 3,
            label: "Непопулярные блюда",
            value: "Казы с мясом оцелота",
            change: { value: "-15%", trend: "down" },
        },
    ];
};

interface ReportFilters {
    date: string;
    period: string;
    location: string;
}

export default function OrderReports() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ReportFilters>({
        date: "01.09.2025",
        period: "День",
        location: "Все ресторан",
    });

    const [checks, setChecks] = useState({});
    const [returns, setReturns] = useState({});
    const [averages, setAverages] = useState([]);

    useEffect(() => {
        loadReportData();
    }, [filters]); // Reload data when filters change

    const loadReportData = async () => {
        try {
            setLoading(true);
            // TODO описать входящие переменные после того как буду получать рил данные

            // Fetch all data in parallel with filters
            const [orders, averages] = await Promise.all([
                fetchOrders(filters),
                fetchAverages(filters),
            ]);

            setChecks(orders.checks);
            setReturns(orders.returns);
            setAverages(averages);
        } catch (error) {
            console.error("Error loading report data:", error);
            // TODO: Show error message to user
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date: string) => {
        setFilters((prev) => ({ ...prev, date }));
        // TODO: Implement date picker modal
    };

    const handlePeriodChange = (period: string) => {
        setFilters((prev) => ({ ...prev, period }));
    };

    const handleLocationChange = (location: string) => {
        setFilters((prev) => ({ ...prev, location }));
    };

    const renderValueBadge = (value, type) => (
        <ValueBadge value={value} type={type} />
    );

    const renderAverages = () => {
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

    return (
        <View style={{ ...styles.container, ...backgroundsStyles.generalBg }}>
            <ReportHeader
                title="Отчет по заказам"
                date={filters.date}
                period={filters.period}
                location={filters.location}
                onBack={() => router.push("/ceo/analytics")}
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
