import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";

export async function createFine(inputs: {
    employeeId: string;
    employeeName: string;
    reason: string;
    amount: number;
    date: string;
}) {
    const params = checkFilters(inputs);
    console.log(params);

    const res = await api.post("/fines", params);

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

export async function createQuest(inputs: {
    title: string;
    description: string;
    reward: number;
    target: number;
    unit: string;
    date: string;
    employeeIds: string[];
    organization_id: number;
}) {
    const params = checkFilters(inputs);

    const res = await api.post("/quests", params);

    return res.data;
}
