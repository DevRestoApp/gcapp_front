// ============================================================================
// EmployeePicker.tsx — thin wrapper over OptionPicker for employee selection
// ============================================================================
import React, { useMemo } from "react";
import { OptionPicker } from "./OptionPicker";

interface Employee {
    id: string | number;
    name: string;
    role?: string;
}

interface EmployeePickerProps {
    employees: Employee[];
    value: string | null;
    onChange: (employee: Employee) => void;
    placeholder?: string;
    showSearchInput?: boolean;
    modalTitle?: string;
    emptyText?: string;
}

export function EmployeePicker({
    employees,
    value,
    onChange,
    placeholder = "Выберите сотрудника",
    showSearchInput = true,
    modalTitle = "Выберите сотрудника",
    emptyText = "Нет доступных сотрудников",
}: EmployeePickerProps) {
    const options = useMemo(
        () =>
            employees.map((emp) => ({
                label: emp.name,
                value: String(emp.id),
                subtitle: emp.role || undefined,
            })),
        [employees],
    );

    const handleChange = (selectedValue: string) => {
        const employee = employees.find(
            (emp) => String(emp.id) === selectedValue,
        );
        if (employee) {
            onChange(employee);
        }
    };

    return (
        <OptionPicker
            options={options}
            value={value ?? ""}
            onChange={handleChange}
            placeholder={placeholder}
            showSearchInput={showSearchInput}
            searchPlaceholder="Поиск сотрудника..."
            modalTitle={modalTitle}
            emptyText={emptyText}
        />
    );
}
