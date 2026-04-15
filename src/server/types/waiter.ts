import { Dish } from "@/src/client/types/waiter";

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
    sales_number: number;
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

export interface WaiterShiftStatusInputType {
    date?: string | null | undefined;
    organization_id?: number;
}

export interface WaiterShiftStatusType {
    isActive: boolean;
    shiftId: string;
    startTime: string;
    elapsedTime: string;
}

export type OrganizationIdType = number | null | undefined;

export interface WaiterOrdersInputType {
    organization_id?: number | null | undefined;
    user_id?: number | null | undefined;
    state?: string | null;
    date?: string;
    limit?: number;
    offset?: number;
}

type OrderItemsType = {
    productId: number;
    amount: number;
    price: number;
    sum: number;
    comment: string;
};

export interface createOrderInputType {
    organization_id: number;
    tableId: number;
    waiterId: number;
    guests: number;
    items: OrderItemsType[];
    comment: string;
}

// TODO добавить тип для any[]
export interface OrderType {
    success: boolean;
    message: string;
    orders: any[];
}

export type CreateOrderItem = {
    productId: number;
    amount: number;
    price: number;
    sum: number;
    comment?: string;
};

export interface CreateOrdersInputType {
    organizationId?: number;
    tableId?: number;
    waiterId?: number;
    guests?: number;
    items: CreateOrderItem[];
}
export interface UpdateOrdersInputType {
    organizationId?: number;
    tableId?: number;
    waiterId?: number;
    guests?: number;
    items?: CreateOrderItem[];
    comment?: string;
}

export interface CreateOrdersType {
    success: boolean;
    message: string;
    order_id: number;
    iiko_id?: number;
}

export interface UpdateOrdersType {
    success: boolean;
    message: string;
    order_id: number;
}

export interface PayOrderType {
    success: boolean;
    message: string;
    order_id: number;
    status: string;
}

export interface DishItemCreateOrderType extends Dish {
    productId: number;
    amount: number;
    price: number;
    sum: number;
    comment?: string;
}

export interface EmployeesData {
    id: string;
    name: string;
    role?: string;
    avatar: string;
    amount: string;
    shiftTime?: string;
    isActive?: boolean;
    average_check?: string | number;
    checks_count?: string | number;
    returns_count?: string | number;
    data?: { label: string; value: string }[];
}
