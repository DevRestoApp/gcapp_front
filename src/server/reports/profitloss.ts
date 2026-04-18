import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";

import { getProfitlossDetailsInputType } from "@/src/server/types/ceo";

export async function getProfitLossData(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = checkFilters(filters);

    const res = await api.get("/reports/profit-loss", { params });

    return res.data;
}

export async function getProfitLossDetails(
    filters: getProfitlossDetailsInputType,
) {
    const params = checkFilters(filters);

    const res = await api.get("/reports/profit-loss/detail", { params });

    return res.data;
}
