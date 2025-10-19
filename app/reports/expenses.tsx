import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ReportHeader } from "@/src/client/components/reports/header";
import ReportCard from "@/src/client/components/ceo/ReportCard";

import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";
import { ReportTable } from "@/src/client/components/reports/table";

// Mock API functions - replace these with your actual API calls
const fetchGeneralMetrics = async (filters: ReportFilters) => {
    // TODO: Replace with actual API call
    // const response = await api.get('/reports/metrics', { params: filters });
    // return response.data;

    return [
        {
            id: 1,
            title: "Итого Расходы",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "expense",
        },
        {
            id: 2,
            title: "Итого Прибыль от основной деятельности",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "income",
        },
        {
            id: 3,
            title: "Итого чистая прибыль",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "income",
        },
    ];
};
const fetchExpenses = async (filters: ReportFilters) => {
    // TODO: Replace with actual API call
    // const response = await api.get('/reports/metrics', { params: filters });
    // return response.data;

    return [
        {
            id: 1,
            title: "Итого Расходы",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "expense",
        },
        {
            id: 2,
            title: "Итого Прибыль от основной деятельности",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "income",
        },
        {
            id: 3,
            title: "Итого чистая прибыль",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "income",
        },
        {
            id: 4,
            title: "Итого Расходы",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "expense",
        },
        {
            id: 5,
            title: "Итого Прибыль от основной деятельности",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "income",
        },
        {
            id: 6,
            title: "Итого чистая прибыль",
            value: "+14 000 568 тг",
            date: "07.09",
            type: "income",
        },
    ];
};
const fetchTableData = async (filters: ReportFilters) => {
    const columns = [
        { key: "name", label: "", flex: 2 },
        { key: "revenue", label: "ГК Шарль", flex: 1 },
    ];

    // children tree nodes if there be some ex: {...el, children: [props]}
    const data = [
        {
            name: "Прибыль от основной деятельности",
            revenue: "1 000 000 тг",
        },
        {
            name: "Выручка",
            revenue: "750 000 тг",
        },
        {
            name: "Итого выручка",
            revenue: "134 000 тг",
        },
        {
            name: "Продажа фабрика",
            revenue: "35 000 тг",
        },
        {
            name: "Себестоимость",
            revenue: "90 000 тг",
        },
        {
            name: "Предоставленные скидки",
            revenue: "142 000 тг",
        },
    ];

    return {
        columns,
        data,
    };
};

interface ReportFilters {
    date: string;
    period: string;
    location: string;
}

export default function Reports() {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ReportFilters>({
        date: "01.09.2025",
        period: "День",
        location: "Все ресторан",
    });

    const [generalMetrics, setGeneralMetrics] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [tableColumns, setTableColumn] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        loadReportData();
    }, [filters]); // Reload data when filters change

    const loadReportData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel with filters
            const [metrics, expenses, tableData] = await Promise.all([
                fetchGeneralMetrics(filters),
                fetchExpenses(filters),
                fetchTableData(filters),
            ]);
            console.log("metrics", metrics);

            setGeneralMetrics(metrics);
            setExpenses(expenses);
            setTableColumn(tableData.columns);
            setTableData(tableData.data);
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

    const renderGeneralCard = () => {
        return (
            <View style={cardStyles.card}>
                <Text style={cardStyles.subsectionTitle}>Сегодня</Text>
                <View style={cardStyles.reportsContainer}>
                    {generalMetrics.map((metric, index) => (
                        <React.Fragment key={metric.id}>
                            {index > 0 && <View style={cardStyles.divider} />}
                            <ReportCard {...metric} />
                        </React.Fragment>
                    ))}
                </View>
            </View>
        );
    };
    const renderItemList = () => {
        return (
            <View style={styles.card}>
                <Text style={cardStyles.subsectionTitle}>Сегодня</Text>

                <View style={cardStyles.reportsContainer}>
                    {expenses.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <ReportCard {...item} />
                        </React.Fragment>
                    ))}
                </View>
            </View>
        );
    };
    const renderTable = () => {
        return (
            <View style={styles.card}>
                <Text style={cardStyles.subsectionTitle}>Сегодня</Text>

                <ReportTable columns={tableColumns} data={tableData} />
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
                    onBack={() => navigation.goBack()}
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
                title="Общие показатели"
                date={filters.date}
                period={filters.period}
                location={filters.location}
                onBack={() => navigation.goBack()}
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
    card: {
        padding: 12,
        borderRadius: 20,
        gap: 8,
    },
});
