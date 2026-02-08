import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";
import { WaiterOrdersInputType } from "@/src/server/types/waiter";

export async function getGeneralOrders(filters: WaiterOrdersInputType) {
    const params = checkFilters(filters);
    const res = await api.get("/orders", { params });

    return res.data;
}
