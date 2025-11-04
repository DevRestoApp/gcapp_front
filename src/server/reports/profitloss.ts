import api from "../api";

export async function getProfitLossData(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = {
        date: filters.date,
        period: filters.period,
        organization_id: filters.organization_id,
    };

    const res = await api.get("/reports/profit-loss", { params });

    return res.data;
}
