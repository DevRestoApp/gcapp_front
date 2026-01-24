import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";

import type { OrganizationIdType } from "@/src/server/types/waiter";

// TODO добавить organization_id в после того как будут орги
export async function startShift(
    waiter_id: number,
    organization_id: OrganizationIdType,
) {
    const params = checkFilters({ organization_id });
    const res = await api.post(`/waiter/${waiter_id}/shift/start`, { params });

    return res.data;
}
export async function endShift(
    waiter_id: number,
    organization_id: OrganizationIdType,
) {
    const params = checkFilters({ organization_id });
    const res = await api.post(`/waiter/${waiter_id}/shift/end`, { params });

    return res.data;
}
