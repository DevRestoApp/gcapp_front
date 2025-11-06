import api from "../api";

export async function getOrganizationsData() {
    const res = await api.get("/organizations");

    return res.data;
}
