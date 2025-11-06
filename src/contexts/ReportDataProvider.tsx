// contexts/ReportsContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useRouter } from "expo-router";
import { getMoneyflowData } from "@/src/server/reports/moneyflow";
import { getOrdersData } from "@/src/server/reports/orders";
import { getProfitLossData } from "@/src/server/reports/profitloss";
import { getAnalyticsData } from "@/src/server/ceo/analytics";
import { getGoodsData } from "@/src/server/ceo/goods";
import { getGeneralOrders } from "@/src/server/general/generalOrders";
import { getSalesDynamicsData } from "@/src/server/reports/salesDynamics";
import { storage } from "@/src/server/storage";
import { getOrganizationsData } from "@/src/server/general/organizations";

// Define your report data types
interface MetricData {
    id: number;
    label: string;
    value: string;
    change?: { value: string; trend: "up" | "down" };
}

type OrdersInterfaceItem = {
    id: string;
    tableNumber: string;
    amount: string;
    time: string;
};

interface OrdersInterface {
    checks: OrdersInterfaceItem[];
    returns: OrdersInterfaceItem[];
    averages: OrdersInterfaceItem[];
}

type expensesByTypeItem = {
    amount: number;
    transaction_name: string;
    transaction_type: string;
};
type revenueByCategoryItem = {
    amount: number;
    category: string;
};

interface ProfitlossInterface {
    bank_commission: number;
    expenses_by_type: expensesByTypeItem[];
    gross_profit: number;
    message: string;
    profit_margin: number;
    revenue_by_category: revenueByCategoryItem[];
    success: boolean;
    total_expenses: number;
    total_revenue: number;
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
    role?: string;
    avatar: string;
    amount: string;
    shiftTime?: string;
    isActive?: boolean;
    data?: { label: string; value: string }[];
}
type byPayType = {
    id: number;
    amount: number;
    payment_type: string;
};
type byCategoryType = {
    id: number;
    amount: number;
    category: string;
};
type MoneyflowInterfaceItem = {
    id: string;
    tableNumber: string;
    amount: string;
    time: string;
    income_by_category?: byCategoryType[];
    income_by_pay_type?: byPayType[];
};

interface MoneyflowInterface {
    dishes: MoneyflowInterfaceItem[];
    writeoffs: MoneyflowInterfaceItem[];
    expenses: MoneyflowInterfaceItem[];
    incomes: MoneyflowInterfaceItem[];
}

// for fast coding
type generalType = {
    id: number;
    label: any;
    type?: any;
    value: any;
};

interface AnalyticsInterface {
    employees: EmployeesData[];
    financial: generalType[];
    metrics: generalType[];
    inventory: generalType[];
    orders: generalType[];
    reports: generalType[];
}

interface ReportFilters {
    date: string; // Format: "DD.MM.YYYY"
    period?: string;
    organization_id?: string;
}

interface OrganizationsInterface {
    name: string;
    id: number;
    is_active: boolean;
    code: string;
}

interface ReportsContextType {
    // Data for all report screens
    metrics: MetricData[];
    orders: OrdersInterface | null;
    payments: PaymentData | null;
    categories: CategoryData | null;
    employees: EmployeesData[];
    moneyflow: MoneyflowInterface | null;
    profitloss: ProfitlossInterface | null;
    analytics: AnalyticsInterface | null;
    organizations: OrganizationsInterface | null;

    // TODO прописать пропсы
    generalOrders: any;
    salesDynamics: any;
    goods: any;

    // Filters - shared across ALL report screens
    filters: ReportFilters;
    setDate: (date: string) => void; // Takes formatted string "DD.MM.YYYY"
    setPeriod: (period: string) => void;
    setLocation: (organization_id: string) => void;

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

const fetchOrdersData = async (
    filters: ReportFilters,
): Promise<OrdersInterface> => {
    const response = await getOrdersData(filters);
    return response;
};

const fetchProfitLossData = async (
    filters: ReportFilters,
): Promise<ProfitlossInterface> => {
    const response = await getProfitLossData(filters);
    return response;
};

const fetchGeneralOrdersData = async (filters: ReportFilters): Promise<any> => {
    // const response = await getGeneralOrders(filters);
    // return response;
    return [];
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
            avatar: "https://api.builder.io/api/v1/image/assets/TEMP/3a1a0f795dd6cebc375ac2f7fbeab6a0d791efc8?width=80",
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
            avatar: "https://api.builder.io/api/v1/image/assets/TEMP/4bd88d9313f5402e21d3f064a4ad85d264b177bb?width=80",
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
            avatar: "https://api.builder.io/api/v1/image/assets/TEMP/4a47f1eee62770da0326efa94f2187fd2ec7547d?width=80",
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
        console.log(`Error fetching moneyflow data: ${e}`);
        return {
            dishes: [],
            writeoffs: [],
            expenses: [],
            incomes: [],
        };
    }
};

const fetchAnalyticsData = async (
    filters: ReportFilters,
): Promise<AnalyticsInterface> => {
    try {
        const response = await getAnalyticsData(filters);
        return response;
    } catch (e) {
        console.log(e);
        return {
            employees: [],
            financial: [],
            metrics: [],
            inventory: [],
            orders: [],
            reports: [],
        };
    }
};

const fetchGoodsData = async (filters: ReportFilters): Promise<any> => {
    try {
        const response = await getGoodsData(filters);
        return response;
    } catch (e) {
        console.log(e);
        return null;
    }
};

const fetchSalesDynamicsData = async (filters: ReportFilters): Promise<any> => {
    try {
        const response = await getSalesDynamicsData(filters);
        return response;
    } catch (e) {
        console.log(e);
        return null;
    }
};
const fetchOrganizations = async (): Promise<any> => {
    try {
        const response = await getOrganizationsData();
        return response.organizations;
    } catch (e) {
        console.log(e);
        return null;
    }
};

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
    // ✅ useRouter must be called at the top level
    const router = useRouter();

    // Data state
    const [metrics, setMetrics] = useState<MetricData[]>([]);
    const [orders, setOrders] = useState<OrdersInterface | null>(null);
    const [profitloss, setProfitloss] = useState<ProfitlossInterface | null>(
        null,
    );
    const [payments, setPayments] = useState<PaymentData | null>(null);
    const [categories, setCategories] = useState<CategoryData | null>(null);
    const [employees, setEmployees] = useState<EmployeesData[]>([]);
    const [moneyflow, setMoneyflowData] = useState<MoneyflowInterface | null>(
        null,
    );
    const [analytics, setAnalytics] = useState<AnalyticsInterface | null>(null);
    const [goods, setGoods] = useState<any | null>(null);
    const [generalOrders, setGeneralOrders] = useState<any | null>(null);
    const [salesDynamics, setSalesDynamics] = useState<any | null>(null);
    const [organizations, setOrganizations] = useState<any | null>(null);

    // Helper function to format today's date as DD.MM.YYYY
    const getTodayFormatted = () => {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, "0");
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const year = today.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Filter state - shared across ALL report screens
    const [filters, setFilters] = useState<ReportFilters>({
        date: "29.10.2025",
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
                ordersData,
                employeesData,
                moneyflowData,
                profitlossData,
                analyticsData,
                goodsData,
                generalOrdersData,
                salesDynamicsData,
                organizationsData,
            ] = await Promise.all([
                fetchMainMetrics(filters),
                fetchOrdersData(filters),
                fetchEmployeesData(filters),
                fetchMoneyflowData(filters),
                fetchProfitLossData(filters),
                fetchAnalyticsData(filters),
                fetchGoodsData(filters),
                fetchGeneralOrdersData(filters),
                fetchSalesDynamicsData(filters),
                fetchOrganizations(),
            ]);

            setMetrics(metricsData);
            setOrders(ordersData);
            setEmployees(employeesData);
            setMoneyflowData(moneyflowData);
            setProfitloss(profitlossData);
            setAnalytics(analyticsData);
            setGoods(goodsData);
            setGeneralOrders(generalOrdersData);
            setSalesDynamics(salesDynamicsData);
            setOrganizations(organizationsData);
        } catch (err: any) {
            console.error("Error fetching reports:", err);
            setError("Не удалось загрузить отчеты");

            // Check if it's an authentication error
            await storage.removeItem("access_token");
            await storage.removeItem("user");
            router.push("/auth");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount and when filters change
    useEffect(() => {
        fetchAllReports();
    }, [filters]);

    // Filter update methods
    const setDate = (date: string) => {
        setFilters((prev) => ({ ...prev, date }));
    };

    const setPeriod = (period: string) => {
        setFilters((prev) => ({ ...prev, period }));
    };

    const setLocation = (organization_id: string) => {
        setFilters((prev) => ({ ...prev, organization_id }));
    };

    const refetch = async () => {
        await fetchAllReports();
    };

    return (
        <ReportsContext.Provider
            value={{
                metrics,
                orders,
                payments,
                categories,
                employees,
                moneyflow,
                profitloss,
                analytics,
                generalOrders,
                goods,
                salesDynamics,
                organizations,
                filters,
                setDate,
                setPeriod,
                setLocation,
                loading,
                error,
                refetch,
            }}
        >
            {children}
        </ReportsContext.Provider>
    );
};
