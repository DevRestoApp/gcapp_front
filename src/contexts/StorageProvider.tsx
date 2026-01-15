import React, { createContext, useCallback, useContext, useState } from "react";
import {
    createWarehouseDocument,
    getWarehouseStore,
    updateWarehouseDocument,
} from "@/src/server/general/warehouse";

// TODO: Define proper document type based on your warehouse document structure
interface WarehouseDocument {
    id: number;
    document_type: string;
    items: any[];
    // Add other fields as needed
}

interface StoreOption {
    label: string;
    value: string;
}

interface StorageContextType {
    document: WarehouseDocument | null;
    setDocument: (document: WarehouseDocument | null) => void;
    isNew: boolean | null;
    setIsNew: (bool: boolean | null) => void;
    fetchStores: () => Promise<StoreOption[]>;
    createWarehouseDocumentWrapper: (inputs: any) => Promise<void>;
    updateWarehouseDocumentWrapper: (
        document_id: number | undefined,
        inputs: any,
    ) => Promise<void>;
}

const fetchStores = async (): Promise<StoreOption[]> => {
    try {
        const response = await getWarehouseStore();

        return response.map((el: any) => ({
            label: el.name,
            value: el.id,
        }));
    } catch (error) {
        console.error("Error fetching stores:", error);
        throw error;
    }
};

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [document, setDocument] = useState<WarehouseDocument | null>(null);
    const [isNew, setIsNew] = useState<boolean | null>(null);

    const createWarehouseDocumentWrapper = useCallback(async (inputs: any) => {
        // TODO: type this based on createWarehouseDocument params
        try {
            await createWarehouseDocument(inputs);
        } catch (e) {
            console.error("Error creating warehouse document:", e);
            throw e; // Re-throw so caller can handle
        }
    }, []);

    const updateWarehouseDocumentWrapper = useCallback(
        async (document_id: number, inputs: any) => {
            // TODO: type this based on updateWarehouseDocument params
            try {
                await updateWarehouseDocument(document_id, inputs);
            } catch (e) {
                console.error("Error updating warehouse document:", e);
                throw e;
            }
        },
        [],
    );

    return (
        <StorageContext.Provider
            value={{
                document,
                setDocument,
                fetchStores,
                isNew,
                setIsNew,
                createWarehouseDocumentWrapper,
                updateWarehouseDocumentWrapper,
            }}
        >
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => {
    const ctx = useContext(StorageContext);
    if (!ctx) throw new Error("useStorage must be used within StorageProvider");
    return ctx;
};
