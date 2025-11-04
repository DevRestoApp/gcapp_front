import api from "../api";

export async function getOrdersData(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = {
        date: filters.date,
        period: filters.period,
        organization_id: filters.organization_id,
    };

    const res = await api.get("/reports/orders", { params });

    return res.data;
}
