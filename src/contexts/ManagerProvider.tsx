import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

import { getTodayFormatted } from "@/src/utils/utils";
import { getOrganizationsData } from "@/src/server/general/organizations";
import {
    createFine,
    createQuest,
    getFines,
    getQuests,
    getShifts,
} from "@/src/server/ceo/generals";
import {
    changeEmployeePassword,
    getEmployeesData,
} from "@/src/server/general/employees";
import type { FineInputsType, QuestInputsType } from "@/src/server/types/ceo";
import type {
    AddExpensesInputType,
    ExpensesDataInputType,
    ExpensesDataType,
    GetPayoutTypes,
    GetSupplierType,
    UpdateExpensesInputType,
    WarehouseDocumentsAccountsType,
} from "@/src/server/types/expenses";
import { getAnalyticsData } from "@/src/server/ceo/analytics";
import {
    getExpensesData,
    addExpenses,
    updateExpense,
    deleteExpense,
    getSuppliersData,
    getPayoutTypesData,
} from "@/src/server/general/expenses";
import { getDocumentsAccounts } from "@/src/server/general/warehouse";

// ============================================================================
// Types
// ============================================================================

interface QueryInputs {
    date?: string;
    period?: string;
    organization_id?: string;
}

type Fine = {
    id: number;
    employeeId: number;
    employeeName: string;
    amount: number;
    reason: string;
    date: string;
    createdAt: string;
};

interface FinesSummary {
    succes: boolean;
    message: string;
    fines: Fine[];
}

interface Employee {
    id: number;
    name: string;
    role: string;
    avatarUrl: string;
    totalAmount: string;
    shiftTime: string;
    isActive: boolean;
    deleted?: boolean;
    data?: { label: string; value: string }[];
}

interface Shift {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    elapsedTime: string;
    openEmployees: number;
    totalAmount: number;
    finesCount: number;
    motivationCount: number;
    questsCount: number;
    status: string;
}

type EmployeeProgress = {
    employeeId: string;
    employeeName: string;
    progress: number;
    completed: true;
    points: number;
    rank: number;
};

interface Quest {
    id: string;
    title: string;
    description: string;
    reward: number;
    current: number;
    target: number;
    unit: string;
    completed: true;
    progress: number;
    expiresAt: string;
    totalEmployees: number;
    completedEmployees: number;
    employeeNames: string[];
    date: string;
    employeeProgress: EmployeeProgress[];
}

type GeneralType = {
    id: number;
    label: any;
    type?: any;
    value: any;
};

interface AnalyticsInterface {
    metrics: GeneralType[];
}

interface ManagerContextType {
    loading: boolean;
    error: string | null;
    queryInputs: QueryInputs;
    selectedStorageTab: string;
    selectedExpenseTab: string;
    locations: any[];
    finesSummary: FinesSummary | null;
    employees: Employee[] | null;
    shifts: Shift | null;
    quests: Quest | null;
    analytics: AnalyticsInterface | null;
    accounts: WarehouseDocumentsAccountsType[] | null;
    payoutTypes: GetPayoutTypes[] | null;
    expenses: ExpensesDataType | null;
    suppliers: GetSupplierType | null;

    refetch: () => Promise<void>;
    clearError: () => void;
    setDate: (date: string) => void;
    setPeriod: (period: string) => void;
    setLocation: (organization_id: string) => void;
    setSelectedStorageTab: (tab: string) => void;
    setSelectedExpenseTab: (tab: string) => void;

    createFineAction: (inputs: FineInputsType) => Promise<void>;
    createQuestAction: (inputs: QuestInputsType) => Promise<void>;
    fetchEmployeesDataWrapper: (inputs: QueryInputs) => Promise<void>;
    fetchExpensesData: (
        filters: ExpensesDataInputType,
    ) => Promise<ExpensesDataType>;
    fetchSuppliersData: () => Promise<GetSupplierType>;
    fetchPayoutTypesData: () => Promise<GetPayoutTypes[]>;
    fetchAccountsData: () => Promise<WarehouseDocumentsAccountsType[] | null>;
    addExpenseAction: (body: AddExpensesInputType) => Promise<void>;
    updateExpenseAction: (
        expense_id: number,
        body: UpdateExpensesInputType,
    ) => Promise<void>;
    deleteExpenseAction: (expense_id: number) => Promise<void>;
    changePasswordWrapper: (params: {
        employee_id: number;
        new_password: string;
    }) => Promise<void>;
}

// ============================================================================
// Context
// ============================================================================

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export const useManager = () => {
    const context = useContext(ManagerContext);
    if (!context) {
        throw new Error("useManager must be used within ManagerProvider");
    }
    return context;
};

// ============================================================================
// Internal fetch helpers
// ============================================================================

const fetchAnalyticsData = async (
    filters: QueryInputs,
): Promise<AnalyticsInterface> => {
    try {
        return await getAnalyticsData(filters);
    } catch (e) {
        console.error(e);
        return { metrics: [] };
    }
};

const fetchOrganizations = async (): Promise<any[]> => {
    try {
        const response = await getOrganizationsData();
        return response.organizations ?? [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

const fetchFinesSummary = async (
    inputs: QueryInputs,
): Promise<FinesSummary | null> => {
    try {
        return await getFines(inputs);
    } catch (e) {
        console.error(e);
        return null;
    }
};

const fetchEmployeesData = async (
    inputs: QueryInputs,
): Promise<Employee[] | null> => {
    try {
        const response = await getEmployeesData({ ...inputs, deleted: false });
        if (!Array.isArray(response)) {
            console.error("Invalid employees data structure:", response);
            return null;
        }
        return response;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};

const fetchShiftsData = async (inputs: QueryInputs): Promise<Shift | null> => {
    try {
        return await getShifts(inputs);
    } catch (error) {
        console.error("Error fetching shifts:", error);
        throw error;
    }
};

const fetchQuestsData = async (inputs: QueryInputs): Promise<Quest | null> => {
    try {
        return await getQuests(inputs);
    } catch (error) {
        console.error("Error fetching quests:", error);
        throw error;
    }
};

// ============================================================================
// Provider
// ============================================================================

export const ManagerProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStorageTab, setSelectedStorageTab] =
        useState("incomingInvoice");
    const [selectedExpenseTab, setSelectedExpenseTab] = useState("open");

    const [locations, setLocations] = useState<any[]>([]);
    const [finesSummary, setFinesSummary] = useState<FinesSummary | null>(null);
    const [employees, setEmployees] = useState<Employee[] | null>(null);
    const [shifts, setShifts] = useState<Shift | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsInterface | null>(null);
    const [quests, setQuests] = useState<Quest | null>(null);
    const [expenses, setExpenses] = useState<ExpensesDataType | null>(null);
    const [suppliers, setSuppliers] = useState<GetSupplierType | null>(null);
    const [payoutTypes, setPayoutTypes] = useState<GetPayoutTypes[] | null>(
        null,
    );
    const [accounts, setAccounts] = useState<
        WarehouseDocumentsAccountsType[] | null
    >(null);

    const [inputs, setInputs] = useState<QueryInputs>({
        date: getTodayFormatted(),
        period: "",
        organization_id: "",
    });

    // ========================================================================
    // Fetch actions (exposed via context)
    // ========================================================================

    const fetchEmployeesDataWrapper = useCallback(
        async (inputs: QueryInputs): Promise<void> => {
            try {
                const response = await getEmployeesData({
                    ...inputs,
                    deleted: false,
                });
                if (Array.isArray(response)) {
                    setEmployees(response);
                } else {
                    console.error(
                        "Invalid employees data structure:",
                        response,
                    );
                    setEmployees([]);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
                setEmployees([]);
            }
        },
        [],
    );

    const fetchExpensesData = useCallback(
        async (filters: ExpensesDataInputType): Promise<ExpensesDataType> => {
            const fallback: ExpensesDataType = {
                success: false,
                message: "Error",
                expenses: [],
                total: 0,
            };
            try {
                setLoading(true);
                const response = await getExpensesData({
                    organization_id: filters.organization_id ?? null,
                    from_date: filters.from_date,
                    expense_type: filters.expense_type ?? "WRITEOFF",
                    limit: filters.limit ?? 5000,
                    offset: filters.offset,
                });
                setExpenses(response);
                return response;
            } catch (e) {
                console.error(e);
                setExpenses(fallback);
                return fallback;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const fetchSuppliersData =
        useCallback(async (): Promise<GetSupplierType> => {
            const fallback: GetSupplierType = {
                success: false,
                message: "Error",
                suppliers: [],
                total: 0,
            };
            try {
                setLoading(true);
                const response = await getSuppliersData();
                setSuppliers(response);
                return response;
            } catch (e) {
                console.error(e);
                setSuppliers(fallback);
                return fallback;
            } finally {
                setLoading(false);
            }
        }, []);

    const fetchPayoutTypesData = useCallback(async (): Promise<
        GetPayoutTypes[]
    > => {
        try {
            setLoading(true);
            const response = await getPayoutTypesData();
            setPayoutTypes(response);
            return response;
        } catch (e) {
            console.error(e);
            setPayoutTypes(null);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAccountsData = useCallback(async (): Promise<
        WarehouseDocumentsAccountsType[] | null
    > => {
        try {
            setLoading(true);
            const response = await getDocumentsAccounts();
            const filtered = response.accounts.filter(
                (el) => el.type === "EXPENSES",
            );
            setAccounts(filtered);
            return filtered;
        } catch (e) {
            console.error(e);
            setAccounts(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ========================================================================
    // Main fetch
    // ========================================================================

    const fetchAll = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const [
                organizations,
                fines,
                employeesData,
                shiftsData,
                analyticsData,
                questsData,
            ] = await Promise.all([
                fetchOrganizations(),
                fetchFinesSummary(inputs),
                fetchEmployeesData(inputs),
                fetchShiftsData(inputs),
                fetchAnalyticsData(inputs),
                fetchQuestsData(inputs),
            ]);

            setLocations(organizations);
            setFinesSummary(fines);
            setEmployees(employeesData);
            setShifts(shiftsData);
            setAnalytics(analyticsData);
            setQuests(questsData);
        } catch (err: any) {
            console.error("Error fetching Manager data:", err);
            setError(
                err?.message ??
                    "Не удалось загрузить данные. Попробуйте снова.",
            );
        } finally {
            setLoading(false);
        }
    }, [inputs]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // ========================================================================
    // Actions
    // ========================================================================

    const setDate = useCallback((date: string) => {
        setInputs((prev) => ({ ...prev, date }));
    }, []);

    const setPeriod = useCallback((period: string) => {
        setInputs((prev) => ({ ...prev, period }));
    }, []);

    const setLocation = useCallback((organization_id: string) => {
        setInputs((prev) => ({ ...prev, organization_id }));
    }, []);

    const refetch = useCallback(async (): Promise<void> => {
        await fetchAll();
    }, [fetchAll]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const createFineAction = useCallback(
        async (inputs: FineInputsType): Promise<void> => {
            try {
                await createFine(inputs);
            } catch (e) {
                console.error(e);
            }
        },
        [],
    );

    const createQuestAction = useCallback(
        async (inputs: QuestInputsType): Promise<void> => {
            try {
                await createQuest(inputs);
            } catch (e) {
                console.error(e);
            }
        },
        [],
    );

    const addExpenseAction = useCallback(
        async (body: AddExpensesInputType): Promise<void> => {
            try {
                await addExpenses(body);
            } catch (e) {
                console.error(e);
            }
        },
        [],
    );

    const updateExpenseAction = useCallback(
        async (
            expense_id: number,
            body: UpdateExpensesInputType,
        ): Promise<void> => {
            try {
                await updateExpense(expense_id, body);
            } catch (e) {
                console.error(e);
            }
        },
        [],
    );

    const deleteExpenseAction = useCallback(
        async (expense_id: number): Promise<void> => {
            try {
                await deleteExpense(expense_id);
            } catch (e) {
                console.error(e);
            }
        },
        [],
    );
    const changePasswordWrapper = useCallback(
        async (params: {
            employee_id: number;
            new_password: string;
        }): Promise<void> => {
            try {
                const response = await changeEmployeePassword(params);
                return response;
            } catch (e) {
                console.error(e);
                return;
            }
        },
        [],
    );

    // ========================================================================
    // Context value
    // ========================================================================

    const value: ManagerContextType = {
        loading,
        error,
        locations,
        finesSummary,
        employees,
        shifts,
        quests,
        analytics,
        selectedStorageTab,
        selectedExpenseTab,
        setSelectedStorageTab,
        setSelectedExpenseTab,
        queryInputs: inputs,
        setDate,
        setPeriod,
        setLocation,
        createFineAction,
        createQuestAction,
        refetch,
        clearError,
        fetchExpensesData,
        fetchSuppliersData,
        fetchPayoutTypesData,
        fetchAccountsData,
        accounts,
        payoutTypes,
        expenses,
        suppliers,
        addExpenseAction,
        updateExpenseAction,
        deleteExpenseAction,
        fetchEmployeesDataWrapper,
        changePasswordWrapper,
    };

    return (
        <ManagerContext.Provider value={value}>
            {children}
        </ManagerContext.Provider>
    );
};
