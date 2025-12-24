import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

import { getTodayFormatted } from "@/src/utils/utils";

// ============================================================================
// Types
// ============================================================================

interface QueryInputs {
    date?: string; // Format: "DD.MM.YYYY"
    period?: string;
    organization_id?: string;
}

interface ManagerContextType {
    // State
    loading: boolean;
    error: string | null;
    queryInputs: QueryInputs;
    selectedStorageTab: string;
    selectedExpenseTab: string;

    // Actions
    refetch: () => Promise<void>;
    clearError: () => void;
    setDate: (date: string) => void;
    setPeriod: (period: string) => void;
    setLocation: (organization_id: string) => void;
    setSelectedStorageTab: (tab: string) => void;
    setSelectedExpenseTab: (tab: string) => void;
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

// ============================================================================
// Provider Component
// ============================================================================

export const ManagerProvider = ({ children }: { children: ReactNode }) => {
    // State Management
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStorageTab, setSelectedStorageTab] =
        useState<string>("open"); // Set default value
    const [selectedExpenseTab, setSelectedExpenseTab] =
        useState<string>("open"); // Added this

    const [inputs, setInputs] = useState<QueryInputs>({
        date: getTodayFormatted(),
        period: "",
        organization_id: "",
    });

    // ========================================================================
    // Data Fetching - NOW DEPENDS ON INPUTS
    // ========================================================================

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // PUT REQS here
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

    // Context Value
    const value: ManagerContextType = {
        loading,
        error,
        selectedStorageTab,
        selectedExpenseTab,
        setSelectedStorageTab,
        setSelectedExpenseTab,
        queryInputs: inputs,
        setDate,
        setPeriod,
        setLocation,
        refetch,
        clearError,
    };

    return (
        <ManagerContext.Provider value={value}>
            {children}
        </ManagerContext.Provider>
    );
};
