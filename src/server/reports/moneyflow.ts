import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";

export async function getMoneyflowData(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = checkFilters(filters);

    const res = await api.get("/reports/moneyflow", { params });

    return res.data;
}
