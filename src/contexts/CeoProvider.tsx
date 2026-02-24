import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

import { getTodayFormatted } from "@/src/utils/utils";
import { getEmployeesData } from "@/src/server/general/employees";
import type { FineInputsType, QuestInputsType } from "@/src/server/types/ceo";
import {
    getQuests,
    getShifts,
    createFine,
    getFines,
    createQuest,
} from "@/src/server/ceo/generals";
import { getOrganizationsData } from "@/src/server/general/organizations";
import { getAnalyticsData } from "@/src/server/ceo/analytics";

// ============================================================================
// Types
// ============================================================================

interface QueryInputs {
    date?: string;
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

type AnalyticsItem = {
    id: number;
    label: string;
    value: string;
    type?: string | null;
    change?: string | null;
};

type AnalyticsReport = {
    id: number;
    title: string;
    value: string;
    date: string;
    type: string;
};

type AnalyticsEmployee = {
    id: number;
    label: string;
    value: string;
    type?: string | null;
};

interface AnalyticsInterface {
    metrics: AnalyticsItem[];
    reports: AnalyticsReport[];
    orders: AnalyticsItem[];
    financial: AnalyticsItem[];
    inventory: AnalyticsItem[];
    employees: AnalyticsEmployee[];
}

interface CeoContextType {
    employees: Employee[] | null;
    shifts: Shift | null;
    quests: Quest | null;
    analytics: AnalyticsInterface | null;
    locations: any[];
    finesSummary: FinesSummary | null;
    loading: boolean;
    error: string | null;
    queryInputs: QueryInputs;

    refetch: () => Promise<void>;
    clearError: () => void;
    setDate: (date: string) => void;
    createFineAction: (inputs: FineInputsType) => Promise<void>;
    createQuestAction: (inputs: QuestInputsType) => Promise<void>;
    fetchEmployeesDataWrapper: (inputs: QueryInputs) => Promise<void>;
}

// ============================================================================
// Context
// ============================================================================

const CeoContext = createContext<CeoContextType | undefined>(undefined);

export const useCeo = () => {
    const context = useContext(CeoContext);
    if (!context) {
        throw new Error("useCeo must be used within CeoProvider");
    }
    return context;
};

// ============================================================================
// Internal fetch helpers
// ============================================================================

const analyticsEmpty: AnalyticsInterface = {
    metrics: [],
    reports: [],
    orders: [],
    financial: [],
    inventory: [],
    employees: [],
};

const fetchAnalyticsData = async (
    inputs: QueryInputs,
): Promise<AnalyticsInterface> => {
    try {
        return await getAnalyticsData(inputs);
    } catch (e) {
        console.error(e);
        return analyticsEmpty;
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

const fetchOrganizations = async (): Promise<any[]> => {
    try {
        const response = await getOrganizationsData();
        return response.organizations ?? [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

// ============================================================================
// Provider
// ============================================================================

export const CeoProvider = ({ children }: { children: ReactNode }) => {
    const [employees, setEmployees] = useState<Employee[] | null>(null);
    const [shifts, setShifts] = useState<Shift | null>(null);
    const [quests, setQuests] = useState<Quest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locations, setLocations] = useState<any[]>([]);
    const [finesSummary, setFinesSummary] = useState<FinesSummary | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsInterface | null>(null);

    const [inputs, setInputs] = useState<QueryInputs>({
        date: getTodayFormatted(),
    });

    // ========================================================================
    // Main fetch
    // ========================================================================

    const fetchAll = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const [
                employeesData,
                shiftsData,
                questsData,
                organizations,
                fines,
                analyticsData,
            ] = await Promise.all([
                fetchEmployeesData(inputs),
                fetchShiftsData(inputs),
                fetchQuestsData(inputs),
                fetchOrganizations(),
                fetchFinesSummary(inputs),
                fetchAnalyticsData(inputs),
            ]);

            setEmployees(employeesData);
            setShifts(shiftsData);
            setQuests(questsData);
            setLocations(organizations);
            setFinesSummary(fines);
            setAnalytics(analyticsData);
        } catch (err: any) {
            console.error("Error fetching CEO data:", err);
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

    // ========================================================================
    // Context value
    // ========================================================================

    const value: CeoContextType = {
        employees,
        locations,
        finesSummary,
        shifts,
        quests,
        analytics,
        loading,
        error,
        queryInputs: inputs,
        createFineAction,
        createQuestAction,
        refetch,
        clearError,
        setDate,
        fetchEmployeesDataWrapper,
    };

    return <CeoContext.Provider value={value}>{children}</CeoContext.Provider>;
};
