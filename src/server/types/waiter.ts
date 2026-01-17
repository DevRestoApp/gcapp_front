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
    capacity: 0;
    status: string;
    currentOrderId: string;
    assignedEmployeeId: string;
}

export interface TablesType {
    id: string;
    number: string;
    roomId: string;
    roomName: string;
    capacity: 0;
    status: string;
    currentOrderId: string;
    assignedEmployeeId: string;
}
