import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";
import {
    FineInputsType,
    QuestInputsType,
    TaskInputsType,
} from "@/src/server/types/ceo";

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

export async function getQuests(inputs: {
    data?: string;
    organization_id?: string;
}) {
    const params = checkFilters(inputs);

    const res = await api.get(`/quests/active`, { params });

    return res.data;
}

export async function createQuest(inputs: QuestInputsType) {
    const params = checkFilters(inputs);

    const res = await api.post("/quests", params);

    return res.data;
}

export async function createTask(user_id: string, inputs: TaskInputsType) {
    const params = checkFilters(inputs);

    const res = await api.post("/tasks", params);

    return res.data;
}

export async function getTasks(inputs: {
    user_id?: string;
    due_date?: number;
    organization_id?: number;
}) {
    const params = checkFilters(inputs);

    const res = await api.get(`/quests/active`, { params });

    return res.data;
}

export async function completeTask(task_id: number) {
    const res = await api.post(`/tasks/${task_id}/complete`);

    return res.data;
}
