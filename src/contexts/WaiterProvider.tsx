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
    WaiterShiftStatusInputType,
    WaiterShiftStatusType,
} from "@/src/server/types/waiter";

import {
    getRooms,
    getTables,
    getWaiterQuests,
    getWaiterSalary,
    getWaiterShiftStatus,
} from "@/src/server/waiter/general";

import type { OrganizationIdType } from "@/src/server/types/waiter";

// Import with different names to avoid conflicts
import {
    startShift as startShiftAPI,
    endShift as endShiftAPI,
} from "@/src/server/waiter/mutation";

interface WaiterContextType {
    rooms: RoomsType[];
    tables: TablesType[];
    quests: WaiterQuestsType[];
    salary: WaiterSalaryType | null;
    shiftStatus: WaiterShiftStatusType | null;
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
    fetchShiftStatus: (
        waiter_id: number,
        inputs: WaiterShiftStatusInputType,
    ) => Promise<WaiterShiftStatusType | null>;
    startShift: (
        waiter_id: number,
        organization_id?: OrganizationIdType,
    ) => Promise<void>;
    endShift: (
        waiter_id: number,
        organization_id?: OrganizationIdType,
    ) => Promise<void>;
}

const WaiterContext = createContext<WaiterContextType | undefined>(undefined);

export const WaiterProvider = ({ children }: { children: React.ReactNode }) => {
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const [tables, setTables] = useState<TablesType[]>([]);
    const [quests, setQuests] = useState<WaiterQuestsType[]>([]);
    const [salary, setSalary] = useState<WaiterSalaryType | null>(null);
    const [shiftStatus, setShiftStatus] =
        useState<WaiterShiftStatusType | null>(null);

    const fetchRooms = useCallback(
        async (inputs: RoomInputsType): Promise<RoomsType[]> => {
            try {
                const response = await getRooms(inputs);
                setRooms(response);
                return response;
            } catch (error) {
                console.error("Error fetching rooms:", error);
                throw error;
            }
        },
        [],
    );

    const fetchTables = useCallback(
        async (inputs: TablesInputsType): Promise<TablesType[]> => {
            try {
                const response = await getTables(inputs);
                setTables(response);
                return response;
            } catch (error) {
                console.error("Error fetching tables:", error);
                throw error;
            }
        },
        [],
    );

    const fetchQuest = useCallback(
        async (
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
        },
        [],
    );

    const fetchSalary = useCallback(
        async (
            waiter_id: number,
            inputs: WaiterSalaryInputType,
        ): Promise<WaiterSalaryType> => {
            try {
                const response = await getWaiterSalary(waiter_id, inputs);
                setSalary(response);
                return response;
            } catch (error) {
                console.error("Error fetching salary:", error);
                throw error;
            }
        },
        [],
    );

    const fetchShiftStatus = useCallback(
        async (
            waiter_id: number,
            inputs: WaiterShiftStatusInputType,
        ): Promise<WaiterShiftStatusType> => {
            try {
                const response = await getWaiterShiftStatus(waiter_id, inputs);
                setShiftStatus(response);
                return response;
            } catch (error) {
                console.error("Error fetching shift status:", error);
                throw error;
            }
        },
        [],
    );

    const startShift = useCallback(
        async (waiter_id: number, organization_id?: OrganizationIdType) => {
            console.log("startShift", waiter_id, organization_id);
            try {
                // Call the API function, not itself!
                await startShiftAPI(waiter_id, organization_id);

                // Optionally refresh shift status after starting
                // await fetchShiftStatus(waiter_id, { date: new Date().toISOString() });
            } catch (e) {
                console.error("Error starting shift", e);
                throw e;
            }
        },
        [],
    );

    const endShift = useCallback(
        async (waiter_id: number, organization_id?: OrganizationIdType) => {
            try {
                // Call the API function, not itself!
                await endShiftAPI(waiter_id, organization_id);

                // Optionally refresh shift status after ending
                // await fetchShiftStatus(waiter_id, { date: new Date().toISOString() });
            } catch (e) {
                console.error("Error ending shift", e);
                throw e;
            }
        },
        [],
    );

    return (
        <WaiterContext.Provider
            value={{
                rooms,
                tables,
                quests,
                salary,
                shiftStatus,
                fetchRooms,
                fetchTables,
                fetchQuest,
                fetchSalary,
                fetchShiftStatus,
                startShift,
                endShift,
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
