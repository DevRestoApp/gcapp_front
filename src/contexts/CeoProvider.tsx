import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

import { getEmployeesData } from "@/src/server/general/employees";
import { getQuests, getShifts } from "@/src/server/ceo/generals";

// ============================================================================
// Types
// ============================================================================

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

    // State
    loading: boolean;
    error: string | null;

    // Actions
    refetch: () => Promise<void>;
    clearError: () => void;
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

const fetchEmployeesData = async (): Promise<Employee[] | null> => {
    try {
        const response = await getEmployeesData({ deleted: false });

        // Validate response structure - getEmployeesData returns the array directly
        if (!Array.isArray(response)) {
            console.error("Invalid employees data structure:", response);
            return null;
        }

        console.log(response);
        return response;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error; // Re-throw to handle in fetchAll
    }
};
const fetchShiftsData = async (): Promise<Shift | null> => {
    try {
        const response = await getShifts({});
        console.log("asd", response);

        return response;
    } catch (error) {
        console.error("Error fetching shifts:", error);
        throw error; // Re-throw to handle in fetchAll
    }
};
const fetchQuestsData = async (): Promise<Quest | null> => {
    try {
        const response = await getQuests(1, {});

        return response;
    } catch (error) {
        console.error("Error fetching quests:", error);
        throw error; // Re-throw to handle in fetchAll
    }
};

// Add more fetch functions here as needed
// const fetchOtherData = async (): Promise<OtherData | null> => { ... }

// ============================================================================
// Provider Component
// ============================================================================

export const CeoProvider = ({ children }: { children: ReactNode }) => {
    // ========================================================================
    // State Management
    // ========================================================================

    const [employees, setEmployees] = useState<Employee[] | null>([]);
    const [shifts, setShifts] = useState<Shift | null>(null);
    const [quests, setQuests] = useState<Quest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ========================================================================
    // Data Fetching
    // ========================================================================

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data in parallel
            const [employeesData, shiftsData, questsData] = await Promise.all([
                fetchEmployeesData(),
                fetchShiftsData(),
                // fetchQuestsData()
            ]);

            // Update state only if component is still mounted
            setEmployees(employeesData);
            setShifts(shiftsData);
            // setQuests(questsData);

            // Set other data:
            // setOtherData(otherData);
        } catch (err: any) {
            console.error("Error fetching CEO data:", err);
            setError(
                err?.message ||
                    "Не удалось загрузить данные. Попробуйте снова.",
            );
        } finally {
            setLoading(false);
        }
    }, []); // Empty deps - function doesn't depend on any props/state

    // ========================================================================
    // Effects
    // ========================================================================

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // ========================================================================
    // Actions
    // ========================================================================

    const refetch = useCallback(async () => {
        await fetchAll();
    }, [fetchAll]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // ========================================================================
    // Context Value
    // ========================================================================

    const value: CeoContextType = {
        // Data
        employees,
        shifts,
        quests,

        // State
        loading,
        error,

        // Actions
        refetch,
        clearError,
    };

    return <CeoContext.Provider value={value}>{children}</CeoContext.Provider>;
};
