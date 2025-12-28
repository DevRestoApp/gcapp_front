import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";
import type { FineInputsType, QuestInputsType } from "@/src/server/types/ceo";

export async function createFine(inputs: FineInputsType) {
    const params = checkFilters(inputs);

    const res = await api.post("/fines", params);

    return res.data;
}

export async function getFines(inputs: {
    date?: string;
    organization_id?: string;
}) {
    const params = checkFilters(inputs);

    const res = await api.get("/fines/summary", { params });

    return res.data;
}

export async function getShifts(inputs: {
    date?: string;
    employee_id?: string;
    organization_id?: string;
}) {
    const params = checkFilters(inputs);

    const res = await api.get("/shifts", { params });

    return res.data;
}

export async function getQuests(
    quest_id: number,
    inputs: {
        organization_id?: string;
    },
) {
    const params = checkFilters(inputs);

    const res = await api.get(`/quests/${quest_id}`, { params });

    return res.data;
}

export async function createQuest(inputs: QuestInputsType) {
    const params = checkFilters(inputs);

    const res = await api.post("/quests", params);

    return res.data;
}
