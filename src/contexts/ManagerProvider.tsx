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
import { getEmployeesData } from "@/src/server/general/employees";
import type { FineInputsType, QuestInputsType } from "@/src/server/types/ceo";
import type { AccountsTypeOutput } from "@/src/server/types/storage";
import {
    AddExpensesInputType,
    AddExpensesType,
    ExpensesDataInputType,
    ExpensesDataType,
    GetPayoutTypes,
    GetSupplierType,
    UpdateExpensesInputType,
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
    date?: string; // Format: "DD.MM.YYYY"
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
    id: number; // Changed from string to number
    name: string;
    role: string;
    avatarUrl: string;
    totalAmount: string;
    shiftTime: string;
    isActive: boolean;
    deleted?: boolean; // Add this since it's in your API response
    data?: { label: string; value: string }[];
    // Add other employee properties
}

interface ManagerContextType {
    // State
    loading: boolean;
    error: string | null;
    queryInputs: QueryInputs;
    selectedStorageTab: string;
    selectedExpenseTab: string;
    // TODO прописать приходящие
    locations: any[];
    finesSummary: FinesSummary;
    employees: Employee[] | null;
    shifts: Shift | null;
    quests: Quest | null;
    analytics: AnalyticsInterface | null;

    // Actions
    refetch: () => Promise<void>;
    clearError: () => void;
    setDate: (date: string) => void;
    setPeriod: (period: string) => void;
    setLocation: (organization_id: string) => void;
    setSelectedStorageTab: (tab: string) => void;
    setSelectedExpenseTab: (tab: string) => void;
    createFineAction: (inputs: FineInputsType) => Promise<void>;
    createQuestAction: (inputs: QuestInputsType) => Promise<void>;
    fetchExpensesData: (
        filters: ExpensesDataInputType,
    ) => Promise<ExpensesDataType>;
    fetchSuppliersData: () => Promise<GetSupplierType>;
    fetchPayoutTypesData: () => Promise<GetPayoutTypes>;
    fetchAccountsData: () => Promise<AccountsTypeOutput | null>;
    accounts: AccountsTypeOutput | null;
    payoutTypes: GetPayoutTypes[] | null;
    expenses: ExpensesDataType | null;
    suppliers: GetSupplierType | null;
    addExpenseAction: (body: AddExpensesInputType) => Promise<void>;
    updateExpenseAction: (
        expense_id: number,
        body: UpdateExpensesInputType,
    ) => Promise<void>;
    deleteExpenseAction: (expense_id: number) => Promise<void>;
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

type generalType = {
    id: number;
    label: any;
    type?: any;
    value: any;
};

interface AnalyticsInterface {
    metrics: generalType[];
}

// ============================================================================
// Context Creation
// ============================================================================

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

// ============================================================================
// Hook
// ============================================================================

export const useManager = () => {
    const context = useContext(ManagerContext);
    if (!context) {
        throw new Error("useManager must be used within ManagerProvider");
    }
    return context;
};

const fetchAnalyticsData = async (
    filters: QueryInputs,
): Promise<AnalyticsInterface> => {
    try {
        const response = await getAnalyticsData(filters);
        return response;
    } catch (e) {
        console.log(e);
        return {
            metrics: [],
        };
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

const fetchFinesSummary = async (
    inputs: QueryInputs,
): Promise<FinesSummary | null> => {
    try {
        const response = await getFines(inputs);
        return response;
    } catch (e) {
        return null;
    }
};

const fetchEmployeesData = async (
    inputs: QueryInputs,
): Promise<Employee[] | null> => {
    try {
        //const response = await getEmployeesData({ deleted: false, ...inputs });
        const response = await getEmployeesData({ ...inputs, deleted: false });

        // Validate response structure - getEmployeesData returns the array directly
        if (!Array.isArray(response)) {
            console.error("Invalid employees data structure:", response);
            return null;
        }

        return response;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error; // Re-throw to handle in fetchAll
    }
};

const fetchShiftsData = async (inputs: QueryInputs): Promise<Shift | null> => {
    try {
        const response = await getShifts(inputs);
        console.log("asd", response);

        return response;
    } catch (error) {
        console.error("Error fetching shifts:", error);
        throw error; // Re-throw to handle in fetchAll
    }
};

const fetchQuestsData = async (inputs: QueryInputs): Promise<Quest | null> => {
    try {
        const response = await getQuests(inputs);

        return response;
    } catch (error) {
        console.error("Error fetching quests:", error);
        throw error; // Re-throw to handle in fetchAll
    }
};

// ============================================================================
// Provider Component
// ============================================================================

export const ManagerProvider = ({ children }: { children: ReactNode }) => {
    // State Management
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStorageTab, setSelectedStorageTab] =
        useState<string>("incomingInvoice"); // Set default value
    const [selectedExpenseTab, setSelectedExpenseTab] =
        useState<string>("open"); // Added this

    const [locations, setLocations] = useState<any[]>([]);
    const [finesSummary, setFinesSummary] = useState<FinesSummary>();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shifts, setShifts] = useState<Shift | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsInterface | null>(null);
    const [quests, setQuests] = useState<Quest | null>(null);
    const [expenses, setExpenses] = useState<ExpensesDataType | null>(null);
    const [suppliers, setSuppliers] = useState<GetSupplierType | null>(null);
    const [payoutTypes, setPayoutTypes] = useState<GetPayoutTypes[] | null>(
        null,
    );
    const [accounts, setAccounts] = useState<AccountsTypeOutput | null>(null);

    const [inputs, setInputs] = useState<QueryInputs>({
        date: getTodayFormatted(),
        period: "",
        organization_id: "",
    });

    // ========================================================================
    // Data Fetching - NOW DEPENDS ON INPUTS
    // ========================================================================

    const fetchExpensesData = async (filters: {
        organization_id?: string;
        date?: string;
    }): Promise<ExpensesDataType> => {
        try {
            setLoading(true);
            const preparedFilters = {
                organization_id: filters.organization_id || null,
                from_date: filters.date,
                expense_type: "WRITEOFF",
                limit: 5000,
            };

            const response = await getExpensesData(preparedFilters);

            setExpenses(response);
            setLoading(false);
            return response;
        } catch (e) {
            console.log(`Error: ${e}`);
            setExpenses({
                success: false,
                message: `Error: ${e}`,
                expenses: [],
                total: 0,
            });
            return {
                success: false,
                message: `Error: ${e}`,
                expenses: [],
                total: 0,
            };
        }
    };

    const fetchSuppliersData = async (): Promise<GetSupplierType> => {
        try {
            setLoading(true);

            const response = await getSuppliersData();

            setSuppliers(response);
            setLoading(false);
            return response;
        } catch (e) {
            console.log(`Error: ${e}`);
            setSuppliers({
                success: false,
                message: `Error: ${e}`,
                suppliers: [],
                total: 0,
            });
            return {
                success: false,
                message: `Error: ${e}`,
                suppliers: [],
                total: 0,
            };
        }
    };

    const fetchPayoutTypesData = async (): Promise<GetPayoutTypes[]> => {
        try {
            setLoading(true);

            const response = await getPayoutTypesData();

            setPayoutTypes(response);
            setLoading(false);
            return response;
        } catch (e) {
            console.log(`Error: ${e}`);
            setPayoutTypes(null);
            return null;
        }
    };
    const fetchAccountsData = async (): Promise<AccountsTypeOutput[]> => {
        try {
            setLoading(true);

            const response = await getDocumentsAccounts();

            const filtered = response.accounts.filter(
                (el) => el.type === "EXPENSES",
            );

            console.log("filtered", filtered);
            setAccounts(filtered);
            setLoading(false);
            return null;
        } catch (e) {
            console.log(`Error: ${e}`);
            setAccounts(null);
            return null;
        }
    };

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // PUT REQS here
            const organizations = await fetchOrganizations();
            const finesSummary = await fetchFinesSummary(inputs);
            const employees = await fetchEmployeesData(inputs);
            const shiftsData = await fetchShiftsData(inputs);
            const analyticsData = await fetchAnalyticsData(inputs);
            const questsData = await fetchQuestsData(inputs);

            setFinesSummary(finesSummary);
            setShifts(shiftsData);
            setLocations(organizations);
            setEmployees(employees);
            setAnalytics(analyticsData);
            setQuests(questsData);
        } catch (err: any) {
            console.error("❌ Error fetching Manager data:", err);
            setError(
                err?.message ||
                    "Не удалось загрузить данные. Попробуйте снова.",
            );
        } finally {
            setLoading(false);
        }
    }, [inputs]);

    // ========================================================================
    // Effects
    // ========================================================================

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // ========================================================================
    // Actions
    // ========================================================================

    // Filter update methods
    const setDate = (date: string) => {
        setInputs((prev) => ({ ...prev, date }));
    };

    const setPeriod = (period: string) => {
        setInputs((prev) => ({ ...prev, period }));
    };

    const setLocation = (organization_id: string) => {
        setInputs((prev) => ({ ...prev, organization_id }));
    };

    const refetch = useCallback(async () => {
        await fetchAll();
    }, [fetchAll]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const createFineAction = useCallback(
        async (inputs: FineInputsType) => {
            try {
                await createFine(inputs);
            } catch (e) {
                console.log(e);
            }
        },
        [createFine],
    );

    const createQuestAction = useCallback(
        async (inputs: QuestInputsType) => {
            try {
                await createQuest(inputs);
            } catch (e) {
                console.log(e);
            }
        },
        [createQuest],
    );

    const addExpenseAction = useCallback(
        async (body: AddExpensesInputType) => {
            try {
                await addExpenses(body);
            } catch (e) {
                console.log(e);
            }
        },
        [addExpenses],
    );
    const updateExpenseAction = useCallback(
        async (expense_id: number, body: UpdateExpensesInputType) => {
            try {
                await updateExpense(expense_id, body);
            } catch (e) {
                console.log(e);
            }
        },
        [updateExpense],
    );
    const deleteExpenseAction = useCallback(
        async (expense_id: number) => {
            try {
                await deleteExpense(expense_id);
            } catch (e) {
                console.log(e);
            }
        },
        [deleteExpense],
    );

    // Context Value
    const value: ManagerContextType = {
        employees,
        loading,
        error,
        locations,
        finesSummary,
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
    };

    return (
        <ManagerContext.Provider value={value}>
            {children}
        </ManagerContext.Provider>
    );
};
