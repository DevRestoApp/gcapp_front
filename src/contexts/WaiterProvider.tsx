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
    WaiterOrdersInputType,
    OrderType,
    CreateOrdersInputType,
    PayOrderType,
    CreateOrdersType,
} from "@/src/server/types/waiter";

import {
    createOrder,
    getOrders,
    getRooms,
    getTables,
    getWaiterQuests,
    getWaiterSalary,
    getWaiterShiftStatus,
    payOrder,
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
    orders: OrderType | null;
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
    createOrderWrapper: (
        inputs: CreateOrdersInputType,
    ) => Promise<CreateOrdersType | null>;
    payOrderWrapper: (order_id: number) => Promise<PayOrderType | null>;
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
    fetchOrders: (inputs: WaiterOrdersInputType) => Promise<void>;
}

const WaiterContext = createContext<WaiterContextType | undefined>(undefined);

export const WaiterProvider = ({ children }: { children: React.ReactNode }) => {
    const [rooms, setRooms] = useState<RoomsType[]>([]);
    const [tables, setTables] = useState<TablesType[]>([]);
    const [quests, setQuests] = useState<WaiterQuestsType[]>([]);
    const [salary, setSalary] = useState<WaiterSalaryType | null>(null);
    const [orders, setOrders] = useState<WaiterOrdersInputType | null>(null);
    const [shiftStatus, setShiftStatus] =
        useState<WaiterShiftStatusType | null>(null);

    const fetchRooms = useCallback(
        async (inputs: RoomInputsType): Promise<RoomsType[]> => {
            try {
                console.log("fetchRooms", inputs);
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

    const fetchOrders = useCallback(
        async (inputs: WaiterOrdersInputType): Promise<WaiterSalaryType> => {
            try {
                console.log("fetchOrders", inputs);
                const response = await getOrders(inputs);
                setOrders(response.orders);
                console.log("end");
                return response;
            } catch (error) {
                console.error("Error fetching salary:", error);
                throw error;
            }
        },
        [],
    );

    const createOrderWrapper = useCallback(
        async (inputs: CreateOrdersInputType): Promise<CreateOrdersType> => {
            try {
                const response = await createOrder(inputs);
                return response;
            } catch (error) {
                console.error("Error create order:", error);
                throw error;
            }
        },
        [],
    );
    const payOrderWrapper = useCallback(
        async (order_id: number): Promise<PayOrderType> => {
            try {
                const response = await payOrder(order_id);
                return response;
            } catch (error) {
                console.error("Error order pay:", error);
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
                console.log("fetchShiftStatus", waiter_id, inputs);
                const response = await getWaiterShiftStatus(waiter_id, inputs);
                console.log("res", response);
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

                // Clear shift status after ending
                setShiftStatus(null);
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
                orders,
                shiftStatus,
                fetchRooms,
                fetchTables,
                fetchQuest,
                fetchSalary,
                fetchShiftStatus,
                fetchOrders,
                startShift,
                endShift,
                createOrderWrapper,
                payOrderWrapper,
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
