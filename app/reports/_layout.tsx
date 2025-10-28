// TODO move context and all fetches into single Context.tsx file in contexts directory
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { Stack } from "expo-router";

// Define your report data types
interface MetricData {
    id: number;
    label: string;
    value: string;
    change?: { value: string; trend: "up" | "down" };
}

interface SalesData {
    date: string;
    value: number;
    label: string;
}

interface PaymentData {
    chartData: { name: string; value: number; color: string }[];
    listItems: { label: string; sublabel: string; value: string }[];
}

interface CategoryData {
    chartData: { name: string; value: number; color: string }[];
    listItems: { label: string; sublabel: string; value: string }[];
}

interface ExpensesMetricData {
    id: number;
    title: string;
    value: string;
    date: string;
    type: "income" | "expense";
}

interface EmployeesData {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    totalAmount: string;
    shiftTime: string;
    isActive: boolean;
    data: { label: string; value: string }[];
}

interface ExpensesTableData {
    columns: { key: string; label: string; flex: number }[];
    data: { name: string; revenue: string }[];
}

interface ReportFilters {
    date: string;
    period: string;
    location: string;
}

interface ReportsContextType {
    // Data for index page
    metrics: MetricData[];
    sales: SalesData[];
    payments: PaymentData | null;
    categories: CategoryData | null;
    employees: EmployeesData[];

    // Filters
    filters: ReportFilters;
    setFilters: (filters: ReportFilters) => void;

    // State
    loading: boolean;
    error: string | null;

    // Actions
    refetch: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const useReports = () => {
    const context = useContext(ReportsContext);
    if (!context) {
        throw new Error("useReports must be used within ReportsProvider");
    }
    return context;
};

// Mock API functions - replace with your actual API calls
const fetchMainMetrics = async (
    filters: ReportFilters,
): Promise<MetricData[]> => {
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

const fetchSalesData = async (filters: ReportFilters): Promise<SalesData[]> => {
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

const fetchPaymentData = async (
    filters: ReportFilters,
): Promise<PaymentData> => {
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

const fetchCategoryData = async (
    filters: ReportFilters,
): Promise<CategoryData> => {
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

const fetchEmployeesData = async (
    filters: ReportFilters,
): Promise<ExpensesMetricData[]> => {
    return [
        {
            id: "1",
            name: "Аслан Аманов",
            role: "Оффицант",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/3a1a0f795dd6cebc375ac2f7fbeab6a0d791efc8?width=80",
            totalAmount: "56 897 тг",
            shiftTime: "00:56:25",
            isActive: true,
            data: [
                {
                    label: "Общая сумма",
                    value: "4412",
                },
                {
                    label: "Время смены",
                    value: "00:56:25",
                },
            ],
        },
        {
            id: "2",
            name: "Аида Таманова",
            role: "Оффицант",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/4bd88d9313f5402e21d3f064a4ad85d264b177bb?width=80",
            totalAmount: "56 897 тг",
            shiftTime: "00:56:25",
            isActive: true,
            data: [
                {
                    label: "Общая сумма",
                    value: "4412",
                },
                {
                    label: "Время смены",
                    value: "00:56:25",
                },
            ],
        },
        {
            id: "3",
            name: "Арман Ашимов",
            role: "Бармен",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/4a47f1eee62770da0326efa94f2187fd2ec7547d?width=80",
            totalAmount: "56 897 тг",
            shiftTime: "00:56:25",
            isActive: true,
            data: [
                {
                    label: "Общая сумма",
                    value: "4412",
                },
                {
                    label: "Время смены",
                    value: "00:56:25",
                },
            ],
        },
        {
            id: "4",
            name: "Тима Янь",
            role: "Хостес",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/b97cb7d8a6a91ffcc6568eea52ade41a7e8dec91?width=80",
            totalAmount: "56 897 тг",
            shiftTime: "00:56:25",
            isActive: true,
            data: [
                {
                    label: "Общая сумма",
                    value: "4412",
                },
                {
                    label: "Время смены",
                    value: "00:56:25",
                },
            ],
        },
        {
            id: "5",
            name: "Асылай Арнатова",
            role: "Официант",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/da6152e88e4a02dca62dd7161b21651c66d6c6ce?width=80",
            totalAmount: "56 897 тг",
            shiftTime: "00:56:25",
            isActive: true,
            data: [
                {
                    label: "Общая сумма",
                    value: "4412",
                },
                {
                    label: "Время смены",
                    value: "00:56:25",
                },
            ],
        },
        {
            id: "7",
            name: "Тима Янь",
            role: "Хостес",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/b97cb7d8a6a91ffcc6568eea52ade41a7e8dec91?width=80",
            totalAmount: "56 897 тг",
            shiftTime: "00:56:25",
            isActive: false,
            data: [
                {
                    label: "Общая сумма",
                    value: "4412",
                },
                {
                    label: "Время смены",
                    value: "00:56:25",
                },
            ],
        },
        {
            id: "8",
            name: "Асылай Арнатова",
            role: "Официант",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/da6152e88e4a02dca62dd7161b21651c66d6c6ce?width=80",
            totalAmount: "56 897 тг",
            shiftTime: "00:56:25",
            isActive: false,
            data: [
                {
                    label: "Общая сумма",
                    value: "4412",
                },
                {
                    label: "Время смены",
                    value: "00:56:25",
                },
            ],
        },
    ];
};

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
    const [metrics, setMetrics] = useState<MetricData[]>([]);
    const [sales, setSales] = useState<SalesData[]>([]);
    const [payments, setPayments] = useState<PaymentData | null>(null);
    const [categories, setCategories] = useState<CategoryData | null>(null);
    const [employees, setEmployees] = useState<EmployeesData[]>([]);

    const [filters, setFilters] = useState<ReportFilters>({
        date: new Date().toLocaleDateString("ru-RU"),
        period: "День",
        location: "Все ресторан",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllReports = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all reports in parallel
            const [
                metricsData,
                salesData,
                paymentsData,
                categoriesData,
                employeesData,
            ] = await Promise.all([
                fetchMainMetrics(filters),
                fetchSalesData(filters),
                fetchPaymentData(filters),
                fetchCategoryData(filters),
                fetchEmployeesData(filters),
            ]);

            setMetrics(metricsData);
            setSales(salesData);
            setPayments(paymentsData);
            setCategories(categoriesData);
            setEmployees(employeesData);
        } catch (err) {
            console.error("Error fetching reports:", err);
            setError("Не удалось загрузить отчеты");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount and when filters change
    useEffect(() => {
        fetchAllReports();
    }, [filters]);

    const refetch = async () => {
        await fetchAllReports();
    };

    return (
        <ReportsContext.Provider
            value={{
                metrics,
                sales,
                payments,
                categories,
                employees,
                filters,
                setFilters,
                loading,
                error,
                refetch,
            }}
        >
            {children}
        </ReportsContext.Provider>
    );
};

export default function ReportsLayout() {
    return (
        <ReportsProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="index" />
            </Stack>
        </ReportsProvider>
    );
}
