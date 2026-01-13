import React, { createContext, useContext, useState } from "react";

// TODO прописать типы для документа
interface Document {
    id: string;
}

interface StorageContextType {
    document: any;
    setDocument: (document: any) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [document, setDocument] = useState<Document | null>(null);
    return (
        <StorageContext.Provider value={{ document, setDocument }}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => {
    const ctx = useContext(StorageContext);
    if (!ctx)
        throw new Error("useEmployee must be used within EmployeeProvider");
    return ctx;
};
