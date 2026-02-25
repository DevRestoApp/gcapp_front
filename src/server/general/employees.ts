import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";

// TODO убрать заглушку на date
export async function getEmployeesData(filters: { deleted?: boolean | false }) {
    const params = checkFilters({ ...filters, date: null });

    const res = await api.get("/employees", { params });

    const employees = res.data.employees;
    const filtered = employees.filter((employee) =>
        ["Официант"].includes(employee.role),
    );

    return filtered;
}

export async function changeEmployeePassword(params: {
    employee_id: number;
    new_password: string;
}) {
    const parameters = checkFilters(params);

    const res = await api.put("/change-password", parameters);

    return res.data;
}
