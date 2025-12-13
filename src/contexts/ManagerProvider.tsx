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
}

interface ManagerContextType {
    // State
    loading: boolean;
    error: string | null;
    queryInputs: QueryInputs;

    // Actions
    refetch: () => Promise<void>;
    clearError: () => void;
    setDate: (date: string) => void;
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
// Helper Functions
// ============================================================================

// ============================================================================
// Provider Component
// ============================================================================

export const ManagerProvider = ({ children }: { children: ReactNode }) => {
    // State Management

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const setDate = useCallback((date: string) => {
        setInputs((prev) => ({ ...prev, date }));
    }, []);

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
        queryInputs: inputs,
        refetch,
        clearError,
        setDate,
    };

    return (
        <ManagerContext.Provider value={value}>
            {children}
        </ManagerContext.Provider>
    );
};
