import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";
import { MenuInputsType } from "@/src/server/types/menu";

export async function getMenu(filters: MenuInputsType) {
    const params = checkFilters(filters);
    const res = await api.get("/menu", { params });

    return res.data;
}
