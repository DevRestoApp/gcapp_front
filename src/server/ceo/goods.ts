import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";

export async function getGoodsData(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = checkFilters(filters);
    const res = await api.get("/goods", { params });

    return res.data;
}
