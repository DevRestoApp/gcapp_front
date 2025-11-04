import api from "../api";

export async function getAnalyticsData(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = {
        date: filters.date,
        period: filters.period,
        organization_id: filters.organization_id,
    };
    const res = await api.get("/analytics", { params });

    return res.data;
}
