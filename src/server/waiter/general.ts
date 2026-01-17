import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";
import { TablesInputsType, RoomInputsType } from "@/src/server/types/waiter";

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
