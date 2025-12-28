import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";

export async function getEmployeesData(filters: { deleted?: boolean | false }) {
    const params = checkFilters({ ...filters, limit: 0 });

    const res = await api.get("/employees", { params });

    const employees = res.data.employees;
    const filtered = employees.filter((employee) =>
        ["Официант"].includes(employee.role),
    );

    return filtered;
}
