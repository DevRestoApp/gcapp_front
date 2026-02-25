import api from "../api";

export async function getOrganizationsData() {
    const params = {
        is_active: true,
    };
    const res = await api.get("/organizations", { params });

    return res.data;
}
