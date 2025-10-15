export interface Day {
    date: string;
    day: string;
    active: boolean;
}

export interface Dish {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
}

export interface OrderItem {
    dishId: string;
    quantity: number;
    price: number;
}

export interface Order {
    id?: string;
    table: string;
    location: string;
    room: string;
    items: OrderItem[];
    status?: string;
    createdAt?: Date;
}
