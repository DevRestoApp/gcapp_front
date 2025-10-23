import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ReportHeader } from "@/src/client/components/reports/header";
import { ReportSalesChart } from "@/src/client/components/reports/salesBarChart";
import { ReportDonutSection } from "@/src/client/components/reports/donut";
import MetricCard from "@/src/client/components/ceo/MetricCard";

import { cardStyles } from "@/src/client/styles/ui/components/card.styles";
import { backgroundsStyles } from "@/src/client/styles/ui/components/backgrounds.styles";

// Mock API functions - replace these with your actual API calls
const fetchMainMetrics = async (filters: ReportFilters) => {
    // TODO: Replace with actual API call
    // const response = await api.get('/reports/metrics', { params: filters });
    // return response.data;

    console.log("Fetching metrics with filters:", filters);

    return [
        {
            id: 1,
            label: "Выручка",
            value: "19 589 699 тг",
            change: { value: "-28%", trend: "down" },
        },
        {
            id: 2,
            label: "Чеки",
            value: "886",
            change: { value: "-41%", trend: "down" },
        },
        {
            id: 3,
            label: "Срендний чек",
            value: "22 110,27 тг",
            change: { value: "+21%", trend: "up" },
        },
        { id: 4, label: "Возвраты", value: "0" },
        {
            id: 5,
            label: "Скидки",
            value: "1 241 163,28 тг",
            change: { value: "-37%", trend: "down" },
        },
        { id: 6, label: "НДС", value: "0,00 тг" },
    ];
};

const fetchSalesData = async (filters: ReportFilters) => {
    // TODO: Replace with actual API call
    // const response = await api.get('/reports/sales', { params: filters });
    // return response.data;

    console.log("Fetching sales with filters:", filters);

    return [
        { date: "01.09", value: 25000, label: "25K" },
        { date: "02.09", value: 20000, label: "20K" },
        { date: "03.09", value: 12000, label: "12K" },
        { date: "04.09", value: 0, label: "0K" },
        { date: "05.09", value: 0, label: "0K" },
        { date: "06.09", value: 0, label: "0K" },
        { date: "07.09", value: 0, label: "0K" },
    ];
};

// TODO динамикоа по дням + динамика по часам 24 колонки и 7 колонок

const fetchPaymentData = async (filters: ReportFilters) => {
    // TODO: Replace with actual API call
    // const response = await api.get('/reports/payments', { params: filters });
    // return response.data;

    console.log("Fetching payments with filters:", filters);

    return {
        chartData: [
            { name: "Наличные", value: 69, color: "#ADADFB" },
            { name: "Онлайн стартер", value: 12, color: "#3C82FD" },
            { name: "Карта", value: 10, color: "#FF9E00" },
            { name: "Перевод", value: 9, color: "#20C774" },
        ],
        listItems: [
            {
                label: "Тип оплаты",
                sublabel: "Наличные",
                value: "2 032 525,50тг",
            },
            {
                label: "Тип оплаты",
                sublabel: "Онлайн стартер",
                value: "78 490,00 тг",
            },
            {
                label: "Тип оплаты",
                sublabel: "ПОД ЗП ГК7",
                value: "22 960,00тг",
            },
            { label: "Тип оплаты", sublabel: "ПОД ЗП", value: "41 885,00тг" },
            { label: "Тип оплаты", sublabel: "ПОД ЗП9", value: "18 600,00тг" },
            {
                label: "Тип оплаты",
                sublabel: "ПОД ЗП Нурсая",
                value: "10 040,00тг",
            },
        ],
    };
};

const fetchCategoryData = async (filters: ReportFilters) => {
    // TODO: Replace with actual API call
    // const response = await api.get('/reports/categories', { params: filters });
    // return response.data;

    console.log("Fetching categories with filters:", filters);

    return {
        chartData: [
            { name: "Бар", value: 45, color: "#ADADFB" },
            { name: "Акция", value: 25, color: "#3C82FD" },
            { name: "Кухня", value: 18, color: "#FF9E00" },
            { name: "Десерты", value: 12, color: "#20C774" },
        ],
        listItems: [
            { label: "Категория", sublabel: "Акция", value: "116 618,48тг" },
            { label: "Категория", sublabel: "Бар", value: "3 085 796,43 тг" },
            {
                label: "Категория",
                sublabel: "Без название",
                value: "3 781 987,15тг",
            },
            {
                label: "Категория",
                sublabel: "Бизнес-ланч",
                value: "708 687,13тг",
            },
            {
                label: "Категория",
                sublabel: "Блюда из мясо",
                value: "87 155,22тг",
            },
            {
                label: "Категория",
                sublabel: "Выпечка",
                value: "1 609 949,52тг",
            },
        ],
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

    const [mainMetrics, setMainMetrics] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [paymentData, setPaymentData] = useState({
        chartData: [],
        listItems: [],
    });
    const [categoryData, setCategoryData] = useState({
        chartData: [],
        listItems: [],
    });

    useEffect(() => {
        loadReportData();
    }, [filters]); // Reload data when filters change

    const loadReportData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel with filters
            const [metrics, sales, payments, categories] = await Promise.all([
                fetchMainMetrics(filters),
                fetchSalesData(filters),
                fetchPaymentData(filters),
                fetchCategoryData(filters),
            ]);
            console.log("metrics", metrics);

            setMainMetrics(metrics);
            setSalesData(sales);
            setPaymentData(payments);
            setCategoryData(categories);
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

    const renderMainMetrics = () => {
        console.log("mainMetrics", mainMetrics);
        return (
            <View style={cardStyles.section}>
                <Text style={cardStyles.sectionTitle}>Общие показатели</Text>
                <View style={cardStyles.card}>
                    {mainMetrics.map((metric, index) => (
                        <React.Fragment key={metric.id}>
                            {index > 0 && <View style={cardStyles.divider} />}
                            <MetricCard {...metric} />
                        </React.Fragment>
                    ))}
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
                {renderMainMetrics()}

                <ReportSalesChart title="Динамика продаж" data={salesData} />

                <ReportDonutSection
                    title="Выручка по типам оплаты"
                    chartData={paymentData.chartData}
                    listItems={paymentData.listItems}
                />

                <ReportDonutSection
                    title="Выручка по категориям"
                    chartData={categoryData.chartData}
                    listItems={categoryData.listItems}
                />
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
});
