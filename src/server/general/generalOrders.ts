import api from "../api";

export async function getGeneralOrders(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = {
        date: filters.date,
        period: filters.period,
        organization_id: filters.organization_id,
    };
    const res = await api.get("/orders", { params, limit: "50" });

    return res.data;
}
