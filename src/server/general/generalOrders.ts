import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";

export async function getGeneralOrders(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = checkFilters(filters);
    const res = await api.get("/orders", { params, limit: "50" });

    return res.data;
}
