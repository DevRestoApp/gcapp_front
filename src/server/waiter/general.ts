import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";
import {
    TablesInputsType,
    RoomInputsType,
    WaiterQuestsInputType,
    WaiterSalaryInputType,
    WaiterShiftStatusInputType,
    WaiterOrdersInputType,
} from "@/src/server/types/waiter";

export async function getTables(filters: TablesInputsType) {
    const params = checkFilters(filters);
    const res = await api.get("/tables", { params });

    return res.data.tables;
}

export async function getRooms(filters: RoomInputsType) {
    const params = checkFilters(filters);
    const res = await api.get("/rooms", { params });

    return res.data.rooms;
}

export async function getWaiterQuests(
    waiter_id: number,
    filters: WaiterQuestsInputType,
) {
    const params = checkFilters(filters);
    const res = await api.get(`/waiter/${waiter_id}/quests`, { params });

    return res.data.quests;
}
export async function getWaiterSalary(
    waiter_id: number,
    filters: WaiterSalaryInputType,
) {
    const params = checkFilters(filters);
    const res = await api.get(`/waiter/${waiter_id}/salary`, { params });

    return res.data;
}

export async function getWaiterShiftStatus(
    waiter_id: number,
    filters: WaiterShiftStatusInputType,
) {
    const params = checkFilters(filters);
    const res = await api.get(`/waiter/${waiter_id}/shift/status`, { params });

    return res.data;
}

export async function getOrders(filters: WaiterOrdersInputType) {
    const params = checkFilters(filters);

    const res = await api.get(`/orders`, { params });

    return res.data;
}
