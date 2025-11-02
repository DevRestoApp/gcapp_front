// contexts/ReportsContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { getMoneyflowData } from "@/src/server/reports/moneyflow";

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

interface EmployeesData {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    amount: string;
    shiftTime: string;
    isActive: boolean;
    data: { label: string; value: string }[];
}
type MoneyflowInterfaceItem = {
    id: string;
    tableNumber: string;
    amount: string;
    time: string;
};

interface MoneyflowInterface {
    dishes: MoneyflowInterfaceItem[];
    writeoffs: MoneyflowInterfaceItem[];
    expenses: MoneyflowInterfaceItem[];
    incomes: MoneyflowInterfaceItem[];
}

interface ReportFilters {
    startDate: Date;
    endDate: Date;
    period: string;
    location: string;
}

interface ReportsContextType {
    // Data for all report screens
    metrics: MetricData[];
    sales: SalesData[];
    payments: PaymentData | null;
    categories: CategoryData | null;
    employees: EmployeesData[];
    moneyflow: MoneyflowInterface | null;

    // Filters - shared across ALL report screens
    filters: ReportFilters;
    setDateRange: (startDate: Date, endDate: Date) => void;
    setPeriod: (period: string) => void;
    setLocation: (location: string) => void;

    // Helper to format date range for display in ReportHeader
    getFormattedDateRange: () => string;

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
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
        {
            id: 1,
            label: "Выручка",
            value: "2 441 222 тг",
            change: { value: "+12%", trend: "up" },
        },
        {
            id: 2,
            label: "Чеки",
            value: "256",
            change: { value: "-5%", trend: "down" },
        },
        {
            id: 3,
            label: "Средний чек",
            value: "9 536 тг",
            change: { value: "+8%", trend: "up" },
        },
    ];
};

const fetchSalesData = async (filters: ReportFilters): Promise<SalesData[]> => {
    console.log("Fetching sales with filters:", filters);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
        { date: "Пн", value: 45000, label: "45 000" },
        { date: "Вт", value: 52000, label: "52 000" },
        { date: "Ср", value: 48000, label: "48 000" },
        { date: "Чт", value: 61000, label: "61 000" },
        { date: "Пт", value: 55000, label: "55 000" },
        { date: "Сб", value: 67000, label: "67 000" },
        { date: "Вс", value: 58000, label: "58 000" },
    ];
};

const fetchPaymentData = async (
    filters: ReportFilters,
): Promise<PaymentData> => {
    console.log("Fetching payments with filters:", filters);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        chartData: [
            { name: "Наличные", value: 45, color: "#3C82FD" },
            { name: "Карта", value: 35, color: "#00C48C" },
            { name: "Kaspi", value: 20, color: "#FF6B6B" },
        ],
        listItems: [
            { label: "Наличные", sublabel: "45%", value: "1 098 549 тг" },
            { label: "Карта", sublabel: "35%", value: "854 427 тг" },
            { label: "Kaspi", sublabel: "20%", value: "488 244 тг" },
        ],
    };
};

const fetchCategoryData = async (
    filters: ReportFilters,
): Promise<CategoryData> => {
    console.log("Fetching categories with filters:", filters);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        chartData: [
            { name: "Еда", value: 60, color: "#3C82FD" },
            { name: "Напитки", value: 30, color: "#00C48C" },
            { name: "Другое", value: 10, color: "#FF6B6B" },
        ],
        listItems: [
            { label: "Еда", sublabel: "60%", value: "1 464 733 тг" },
            { label: "Напитки", sublabel: "30%", value: "732 366 тг" },
            { label: "Другое", sublabel: "10%", value: "244 122 тг" },
        ],
    };
};

const fetchEmployeesData = async (
    filters: ReportFilters,
): Promise<EmployeesData[]> => {
    console.log("Fetching employees with filters:", filters);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
        {
            id: "1",
            name: "Аслан Аманов",
            role: "Оффицант",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/3a1a0f795dd6cebc375ac2f7fbeab6a0d791efc8?width=80",
            amount: "55",
            shiftTime: "15 768 тг",
            isActive: true,
            data: [
                { label: "Сумма продаж", value: "441222 тг" },
                { label: "Время смены", value: "15 768 тг" },
                { label: "Количество чеков", value: "256" },
                { label: "Количество возвратов", value: "14" },
            ],
        },
        {
            id: "2",
            name: "Аида Таманова",
            role: "Оффицант",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/4bd88d9313f5402e21d3f064a4ad85d264b177bb?width=80",
            amount: "55",
            shiftTime: "15 768 тг",
            isActive: true,
            data: [
                { label: "Сумма продаж", value: "441222 тг" },
                { label: "Время смены", value: "15 768 тг" },
                { label: "Количество чеков", value: "256" },
                { label: "Количество возвратов", value: "14" },
            ],
        },
        {
            id: "3",
            name: "Арман Ашимов",
            role: "Бармен",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/4a47f1eee62770da0326efa94f2187fd2ec7547d?width=80",
            amount: "55",
            shiftTime: "15 768 тг",
            isActive: true,
            data: [
                { label: "Сумма продаж", value: "441222 тг" },
                { label: "Время смены", value: "15 768 тг" },
                { label: "Количество чеков", value: "256" },
                { label: "Количество возвратов", value: "14" },
            ],
        },
    ];
};

const fetchMoneyflowData = async (
    filters: ReportFilters,
): Promise<MoneyflowInterface> => {
    try {
        const response = await getMoneyflowData(filters);
        return response;
    } catch (e) {
        console.log(`Error fetchin monetflow data: ${e}`);
        return {
            dishes: [],
            writeoffs: [],
            expenses: [],
            incomes: [],
        };
    }
};

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
    // Data state
    const [metrics, setMetrics] = useState<MetricData[]>([]);
    const [sales, setSales] = useState<SalesData[]>([]);
    const [payments, setPayments] = useState<PaymentData | null>(null);
    const [categories, setCategories] = useState<CategoryData | null>(null);
    const [employees, setEmployees] = useState<EmployeesData[]>([]);
    const [moneyflow, setMoneyflowData] = useState<MoneyflowInterface | null>(
        null,
    );

    // Filter state - shared across ALL report screens
    const [filters, setFilters] = useState<ReportFilters>({
        startDate: new Date(),
        endDate: new Date(),
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
                moneyflowData,
            ] = await Promise.all([
                fetchMainMetrics(filters),
                fetchSalesData(filters),
                fetchPaymentData(filters),
                fetchCategoryData(filters),
                fetchEmployeesData(filters),
                fetchMoneyflowData(filters),
            ]);

            setMetrics(metricsData);
            setSales(salesData);
            setPayments(paymentsData);
            setCategories(categoriesData);
            setEmployees(employeesData);
            setMoneyflowData(moneyflowData);
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

    // Filter update methods
    const setDateRange = (startDate: Date, endDate: Date) => {
        setFilters((prev) => ({ ...prev, startDate, endDate }));
    };

    const setPeriod = (period: string) => {
        setFilters((prev) => ({ ...prev, period }));
    };

    const setLocation = (location: string) => {
        setFilters((prev) => ({ ...prev, location }));
    };

    // Helper to format date range for ReportHeader
    const getFormattedDateRange = () => {
        const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        const start = formatDate(filters.startDate);
        const end = formatDate(filters.endDate);
        return start === end ? start : `${start} - ${end}`;
    };

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
                moneyflow,
                filters,
                setDateRange,
                setPeriod,
                setLocation,
                getFormattedDateRange,
                loading,
                error,
                refetch,
            }}
        >
            {children}
        </ReportsContext.Provider>
    );
};
