import React, { createContext, useCallback, useContext, useState } from "react";

import {
    RoomsType,
    TablesType,
    RoomInputsType,
    TablesInputsType,
} from "@/src/server/types/waiter";

import { getRooms, getTables } from "@/src/server/waiter/general";

interface WaiterContextType {
    rooms: RoomsType[];
    tables: TablesType[];
    fetchRooms: (inputs: RoomInputsType) => Promise<RoomsType[]>;
    fetchTables: (inputs: TablesInputsType) => Promise<TablesType[]>;
}

const WaiterContext = createContext<WaiterContextType | undefined>(undefined);

export const WaiterProvider = ({ children }: { children: React.ReactNode }) => {
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const [tables, setTables] = useState<TablesType[]>([]);

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
            console.error("Error fetching rooms:", error);
            throw error;
        }
    };

    return (
        <WaiterContext.Provider
            value={{
                rooms,
                tables,
                fetchRooms,
                fetchTables,
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
