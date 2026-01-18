export interface TablesInputsType {
    room_id?: number;
    status?: "availables" | "occupied" | "disabled" | "all";
    organization_id?: string;
}

export interface RoomInputsType {
    organization_id?: string;
}

export interface RoomsType {
    id: string;
    number: string;
    roomId: string;
    roomName: string;
    capacity: number;
    status: string;
    currentOrderId: string;
    assignedEmployeeId: string;
}

export interface TablesType {
    id: string;
    number: string;
    roomId: string;
    roomName: string;
    capacity: number;
    status: string;
    currentOrderId: string;
    assignedEmployeeId: string;
}

export interface WaiterQuestsInputType {
    date?: string;
    organization_id?: number;
}

export interface WaiterQuestsType {
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
}

export interface WaiterSalaryInputType {
    date: string;
    organization_id?: number;
}

export interface WaiterSalaryType {
    date: string;
    tablesCompleted: number;
    totalRevenue: number;
    salary: number;
    salaryPercentage: number;
    bonuses: number;
    questBonus: number;
    questDescription: string;
    penalties: number;
    totalEarnings: number;
    breakdown: {
        baseSalary: number;
        percentage: number;
        bonuses: [
            {
                type: string;
                amount: number;
                description: string;
            },
        ];
        penalties: [
            {
                reason: string;
                amount: number;
                date: string;
            },
        ];
        questRewards: [
            {
                questId: string;
                questName: string;
                reward: number;
            },
        ];
    };
    quests: [
        {
            id: string;
            title: string;
            description: string;
            reward: number;
            current: number;
            target: number;
            unit: string;
            completed: true;
            progress: number;
            expiresAt: string;
        },
    ];
}
