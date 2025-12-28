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

// ============================================================================
// Types
// ============================================================================

interface QueryInputs {
    date?: string; // Format: "DD.MM.YYYY"
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

interface CeoContextType {
    // Data
    employees: Employee[] | null;
    shifts: Shift | null;
    quests: Quest | null;

    // TODO прописать входящие
    locations: any[];
    finesSummary: FinesSummary;

    // State
    loading: boolean;
    error: string | null;
    queryInputs: QueryInputs;

    // Actions
    refetch: () => Promise<void>;
    clearError: () => void;
    setDate: (date: string) => void;
    createFineAction: (inputs: FineInputsType) => Promise<void>;
    createQuestAction: (inputs: QuestInputsType) => Promise<void>;
}

// ============================================================================
// Context Creation
// ============================================================================

const CeoContext = createContext<CeoContextType | undefined>(undefined);

// ============================================================================
// Hook
// ============================================================================

export const useCeo = () => {
    const context = useContext(CeoContext);
    if (!context) {
        throw new Error("useCeo must be used within CeoProvider");
    }
    return context;
};

// ============================================================================
// Helper Functions
// ============================================================================

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
        // TODO change to input while there be quests
        const response = await getQuests(2, {});

        console.log("quests", response);
        // TODO Добавить нормальный запрос на списко квестов

        return [
            response,
            {
                id: "1",
                title: "title",
                description: "description",
                reward: 5,
                current: 2,
                target: 10,
                unit: "unit",
                completed: true,
                progress: 3,
                expiresAt: "25.12.2025",
                totalEmployees: 5,
                completedEmployees: 3,
                employeeNames: ["ASD", "zxc", "zzz"],
                date: "12.12.2025",
                employeeProgress: [1, 2, 3],
            },
        ];
    } catch (error) {
        console.error("Error fetching quests:", error);
        throw error; // Re-throw to handle in fetchAll
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

// Add more fetch functions here as needed
// const fetchOtherData = async (inputs: QueryInputs): Promise<OtherData | null> => { ... }

// ============================================================================
// Provider Component
// ============================================================================

export const CeoProvider = ({ children }: { children: ReactNode }) => {
    // State Management
    const [employees, setEmployees] = useState<Employee[] | null>(null); // ✅ Changed from [] to null
    const [shifts, setShifts] = useState<Shift | null>(null);
    const [quests, setQuests] = useState<Quest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locations, setLocations] = useState<any[]>([]);
    const [finesSummary, setFinesSummary] = useState<FinesSummary>(null);

    const [inputs, setInputs] = useState<QueryInputs>({
        date: getTodayFormatted(),
    });

    // ========================================================================
    // Data Fetching - NOW DEPENDS ON INPUTS
    // ========================================================================

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [
                employeesData,
                shiftsData,
                questsData,
                organizations,
                finesSummary,
            ] = await Promise.all([
                fetchEmployeesData(inputs),
                fetchShiftsData(inputs),
                fetchQuestsData(inputs),
                fetchOrganizations(),
                fetchFinesSummary(inputs),
            ]);
            setLocations(organizations);

            setFinesSummary(finesSummary);
            setEmployees(employeesData);
            setShifts(shiftsData);
            setQuests(questsData);
        } catch (err: any) {
            console.error("❌ Error fetching CEO data:", err);
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

    const setDate = useCallback((date: string) => {
        setInputs((prev) => ({ ...prev, date }));
    }, []);

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

    // Context Value
    const value: CeoContextType = {
        employees,
        locations,
        finesSummary,
        shifts,
        quests,
        loading,
        error,
        queryInputs: inputs,
        createFineAction,
        createQuestAction,
        refetch,
        clearError,
        setDate,
    };

    return <CeoContext.Provider value={value}>{children}</CeoContext.Provider>;
};
