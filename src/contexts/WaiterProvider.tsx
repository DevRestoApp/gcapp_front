import React, { createContext, useCallback, useContext, useState } from "react";

import {
    RoomsType,
    TablesType,
    RoomInputsType,
    TablesInputsType,
    WaiterQuestsInputType,
    WaiterQuestsType,
} from "@/src/server/types/waiter";

import {
    getRooms,
    getTables,
    getWaiterQuests,
} from "@/src/server/waiter/general";
import { getQuests } from "@/src/server/ceo/generals";

interface WaiterContextType {
    rooms: RoomsType[];
    tables: TablesType[];
    quests: WaiterQuestsType[];
    fetchRooms: (inputs: RoomInputsType) => Promise<RoomsType[]>;
    fetchTables: (inputs: TablesInputsType) => Promise<TablesType[]>;
    fetchQuest: (
        id: number,
        inputs: WaiterQuestsInputType,
    ) => Promise<WaiterQuestsType[]>;
}

const WaiterContext = createContext<WaiterContextType | undefined>(undefined);

export const WaiterProvider = ({ children }: { children: React.ReactNode }) => {
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const [tables, setTables] = useState<TablesType[]>([]);
    const [quests, setQuests] = useState<WaiterQuestsType[]>([]);

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
        id: number,
        inputs: WaiterQuestsInputType,
    ): Promise<WaiterQuestsType[]> => {
        try {
            console.log("fetchQuest", id, inputs);
            const response = await getWaiterQuests(id, inputs);

            setQuests(response);
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
                fetchRooms,
                fetchTables,
                fetchQuest,
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
