import api from "../api";

export async function getSalesDynamicsData(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = {
        date: filters.date,
        days: 7,
    };

    const res = await api.get("/reports/sales-dynamics", { params });

    return res.data;
}
