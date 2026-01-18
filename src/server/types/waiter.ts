export interface TablesInputsType {
    room_id?: number;
    status?: availables | occupied | disabled | all;
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
    organization_id?: string;
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
