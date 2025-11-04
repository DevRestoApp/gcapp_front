import api from "../api";

export async function getGoodsData(filters: {
    date?: string;
    period?: string;
    organization_id?: string;
}) {
    const params = {
        date: filters.date,
        period: filters.period,
        organization_id: filters.organization_id,
    };
    const res = await api.get("/goods", { params });

    return res.data;
}
