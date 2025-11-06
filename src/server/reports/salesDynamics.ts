import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";

export async function getSalesDynamicsData(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = checkFilters({
        date: filters.date,
        days: 7,
    });

    const res = await api.get("/reports/sales-dynamics", { params });

    return res.data;
}
