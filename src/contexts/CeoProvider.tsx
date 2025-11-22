import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

import { getEmployeesData } from "@/src/server/general/employees";

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

interface CeoContextType {
    // Data
    employees: Employee[] | null;

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

// Add more fetch functions here as needed
// const fetchOtherData = async (): Promise<OtherData | null> => { ... }

// ============================================================================
// Provider Component
// ============================================================================

export const CeoProvider = ({ children }: { children: ReactNode }) => {
    // ========================================================================
    // State Management
    // ========================================================================

    const [employees, setEmployees] = useState<Employee[] | null>(null);
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
            const [employeesData] = await Promise.all([
                fetchEmployeesData(),
                // Add more fetches here:
                // fetchOtherData(),
            ]);

            // Update state only if component is still mounted
            setEmployees(employeesData);

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

        // State
        loading,
        error,

        // Actions
        refetch,
        clearError,
    };

    return <CeoContext.Provider value={value}>{children}</CeoContext.Provider>;
};
