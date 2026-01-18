import React, { createContext, useCallback, useContext, useState } from "react";

import {
    RoomsType,
    TablesType,
    RoomInputsType,
    TablesInputsType,
    WaiterQuestsInputType,
    WaiterQuestsType,
    WaiterSalaryInputType,
    WaiterSalaryType,
} from "@/src/server/types/waiter";

import {
    getRooms,
    getTables,
    getWaiterQuests,
    getWaiterSalary,
} from "@/src/server/waiter/general";

interface WaiterContextType {
    rooms: RoomsType[];
    tables: TablesType[];
    quests: WaiterQuestsType[];
    salary: WaiterSalaryType | null;
    fetchRooms: (inputs: RoomInputsType) => Promise<RoomsType[]>;
    fetchTables: (inputs: TablesInputsType) => Promise<TablesType[]>;
    fetchQuest: (
        waiter_id: number,
        inputs: WaiterQuestsInputType,
    ) => Promise<WaiterQuestsType[]>;
    fetchSalary: (
        waiter_id: number,
        inputs: WaiterSalaryInputType,
    ) => Promise<WaiterSalaryType | null>;
}

const WaiterContext = createContext<WaiterContextType | undefined>(undefined);

export const WaiterProvider = ({ children }: { children: React.ReactNode }) => {
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const [tables, setTables] = useState<TablesType[]>([]);
    const [quests, setQuests] = useState<WaiterQuestsType[]>([]);
    const [salary, setSalary] = useState<WaiterSalaryType | null>(null);

    const fetchRooms = async (inputs: RoomInputsType): Promise<RoomsType[]> => {
        try {
            const response = await getRooms(inputs);

            setRooms(response);
            return response;
        } catch (error) {
            console.error("Error fetching rooms:", error);
            throw error;
        }
    };
    const fetchTables = async (
        inputs: TablesInputsType,
    ): Promise<TablesType[]> => {
        try {
            const response = await getTables(inputs);

            setTables(response);
            return response;
        } catch (error) {
            console.error("Error fetching tables:", error);
            throw error;
        }
    };

    const fetchQuest = async (
        waiter_id: number,
        inputs: WaiterQuestsInputType,
    ): Promise<WaiterQuestsType[]> => {
        try {
            console.log("fetchQuest", waiter_id, inputs);
            const response = await getWaiterQuests(waiter_id, inputs);

            setQuests(response);
            return response;
        } catch (error) {
            console.error("Error fetching quests:", error);
            throw error;
        }
    };
    const fetchSalary = async (
        waiter_id: number,
        inputs: WaiterSalaryInputType,
    ): Promise<WaiterSalaryType> => {
        try {
            const response = await getWaiterSalary(waiter_id, inputs);

            setSalary(response);
            return response;
        } catch (error) {
            console.error("Error fetching quests:", error);
            throw error;
        }
    };

    return (
        <WaiterContext.Provider
            value={{
                rooms,
                tables,
                quests,
                salary,
                fetchRooms,
                fetchTables,
                fetchQuest,
                fetchSalary,
            }}
        >
            {children}
        </WaiterContext.Provider>
    );
};

export const useWaiter = () => {
    const ctx = useContext(WaiterContext);
    if (!ctx) throw new Error("useWaiter must be used within WaiterProvider");
    return ctx;
};
