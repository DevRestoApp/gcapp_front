import React, { createContext, useCallback, useContext, useState } from "react";
import {
    createWarehouseDocumentIncomingInvoice,
    createWarehouseDocumentInventory,
    createWarehouseDocumentWriteoff,
    getDocumentsAccounts,
    getWarehouseStore,
    updateWarehouseDocument,
} from "@/src/server/general/warehouse";
import { WarehouseDocumentsAccountsType } from "@/src/server/types/storage";

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
interface AccountsTypeOutput {
    accounts: WarehouseDocumentsAccountsType[];
}

interface StorageContextType {
    document: WarehouseDocument | null;
    accounts: WarehouseDocumentsAccountsType[] | [];
    setDocument: (document: WarehouseDocument | null) => void;
    isNew: boolean | null;
    setIsNew: (bool: boolean | null) => void;
    fetchStores: () => Promise<StoreOption[]>;
    fetchAccounts: () => Promise<AccountsTypeOutput>;
    createWarehouseDocumentWrapper: (
        type: string | undefined,
        inputs: any,
    ) => Promise<void>;
    updateWarehouseDocumentWrapper: (
        document_id: number,
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
    const [accounts, setAccounts] = useState<
        WarehouseDocumentsAccountsType[] | []
    >([]);
    const [isNew, setIsNew] = useState<boolean | null>(null);

    const fetchAccounts = async (): Promise<AccountsTypeOutput> => {
        try {
            const response = await getDocumentsAccounts();
            setAccounts(response.accounts);
            return response;
        } catch (error) {
            console.error("Error fetching accounts:", error); // Also fix error message
            throw error;
        }
    };

    const createWarehouseDocumentWrapper = useCallback(
        async (type: string, inputs: any) => {
            // TODO: type this based on createWarehouseDocument params
            try {
                if (type === "RECEIPT") {
                    await createWarehouseDocumentIncomingInvoice(inputs);
                }
                if (type === "INVENTORY") {
                    await createWarehouseDocumentInventory(inputs);
                }
                if (type === "WRITEOFF") {
                    await createWarehouseDocumentWriteoff(inputs);
                }
            } catch (e) {
                console.error("Error creating warehouse document:", e);
                throw e; // Re-throw so caller can handle
            }
        },
        [],
    );

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
                accounts,
                setDocument,
                fetchStores,
                fetchAccounts,
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
