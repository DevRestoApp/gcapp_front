import React, { createContext, useContext, useState } from "react";

export interface Employee {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    totalAmount: string;
    shiftTime: string;
    isActive: boolean;
}

interface EmployeeContextType {
    selectedEmployee: Employee | null;
    setSelectedEmployee: (employee: Employee | null) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
    undefined,
);

export const EmployeeProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null,
    );
    return (
        <EmployeeContext.Provider
            value={{ selectedEmployee, setSelectedEmployee }}
        >
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployee = () => {
    const ctx = useContext(EmployeeContext);
    if (!ctx)
        throw new Error("useEmployee must be used within EmployeeProvider");
    return ctx;
};
