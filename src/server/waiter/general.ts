import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";
import {
    TablesInputsType,
    RoomInputsType,
    WaiterQuestsInputType,
    WaiterSalaryInputType,
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
    console.log("url", `/waiter/${waiter_id}/salary`);
    const res = await api.get(`/waiter/${waiter_id}/salary`, { params });

    return res.data;
}
