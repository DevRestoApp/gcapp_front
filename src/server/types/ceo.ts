export interface FineInputsType {
    employeeId: string;
    employeeName: string;
    reason: string;
    amount: number;
    date: string;
}
export interface QuestInputsType {
    date?: string;
    employee_id?: string;
    organization_id?: string;
}

export interface TaskInputsType {
    title: string;
    description: string;
    user_id?: number;
    employee_id?: number;
    organization_id: number;
    due_date: string;
}

type Tasks = {
    id: number;
    title: string;
    description: string;
    employee__id: number;
    employee_name: string;
    organization_id: number;
    is_completed: boolean;
    due_date: string;
    created_at: string;
};

export interface GetTaskType {
    tasks: Tasks[];
}

export interface TaskType {
    success: true;
    message: string;
    task: Tasks;
}

export interface EmployeeProgress {
    employeeId: string;
    employeeName: string;
    progress: number;
    completed: boolean;
    points: number;
    rank: number;
}

export interface QuestDetail {
    id: string;
    title: string;
    description: string;
    reward: number;
    current: number;
    target: number;
    unit: string;
    completed: boolean;
    progress: number;
    expiresAt: string;
    totalEmployees: number;
    completedEmployees: number;
    employeeNames: string[];
    date: string;
    employeeProgress: EmployeeProgress[];
}

export interface GetQuestDetailType {
    quest: QuestDetail;
}
