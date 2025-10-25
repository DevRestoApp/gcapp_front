import React, { createContext, useContext, ReactNode } from "react";
import { Stack } from "expo-router";

interface MoneyFlowItem {
    id: number;
    label: string;
    value: string;
    type?: "positive" | "negative";
    data: any[];
}

interface MoneyFlowContextType {
    dishes: MoneyFlowItem | null;
    writeoffs: MoneyFlowItem | null;
    expenses: MoneyFlowItem | null;
    incomes: MoneyFlowItem | null;
    setMoneyFlowData: (data: {
        dishes?: MoneyFlowItem;
        writeoffs?: MoneyFlowItem;
        expenses?: MoneyFlowItem;
        incomes?: MoneyFlowItem;
    }) => void;
}

const MoneyFlowContext = createContext<MoneyFlowContextType | undefined>(
    undefined,
);

export const useMoneyFlow = () => {
    const context = useContext(MoneyFlowContext);
    if (!context) {
        throw new Error("useMoneyFlow must be used within MoneyFlowProvider");
    }
    return context;
};

export const MoneyFlowProvider = ({ children }: { children: ReactNode }) => {
    const [dishes, setDishes] = React.useState<MoneyFlowItem | null>(null);
    const [writeoffs, setWriteoffs] = React.useState<MoneyFlowItem | null>(
        null,
    );
    const [expenses, setExpenses] = React.useState<MoneyFlowItem | null>(null);
    const [incomes, setIncomes] = React.useState<MoneyFlowItem | null>(null);

    const setMoneyFlowData = (data: {
        dishes?: MoneyFlowItem;
        writeoffs?: MoneyFlowItem;
        expenses?: MoneyFlowItem;
        incomes?: MoneyFlowItem;
    }) => {
        if (data.dishes) setDishes(data.dishes);
        if (data.writeoffs) setWriteoffs(data.writeoffs);
        if (data.expenses) setExpenses(data.expenses);
        if (data.incomes) setIncomes(data.incomes);
    };

    return (
        <MoneyFlowContext.Provider
            value={{
                dishes,
                writeoffs,
                expenses,
                incomes,
                setMoneyFlowData,
            }}
        >
            {children}
        </MoneyFlowContext.Provider>
    );
};

export default function MoneyFlowLayout() {
    return (
        <MoneyFlowProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="[type]" />
            </Stack>
        </MoneyFlowProvider>
    );
}
