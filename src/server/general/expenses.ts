import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";
import {
    AddExpensesInputType,
    ExpensesDataInputType,
    UpdateExpensesInputType,
} from "@/src/server/types/expenses";

export async function getExpensesData(filters: ExpensesDataInputType) {
    const params = checkFilters(filters);
    const res = await api.get("/expenses", { params });

    return res.data;
}

export async function addExpenses(body: AddExpensesInputType) {
    const res = await api.post("/expenses", body);

    return res.data;
}

export async function getExpensesDetail(expense_id: number) {
    const res = await api.get(`/expenses/${expense_id}`);

    return res.data;
}

export async function updateExpense(
    expense_id: number,
    body: UpdateExpensesInputType,
) {
    const bodyParams = checkFilters(body);

    const res = await api.put(`/expenses/${expense_id}`, bodyParams);

    return res.data;
}

export async function deleteExpense(expense_id: number) {
    const res = await api.delete(`/expenses/${expense_id}`);

    return res.data;
}

export async function getSuppliersData() {
    const res = await api.get("/suppliers");

    return res.data;
}
