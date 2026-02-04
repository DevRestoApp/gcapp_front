export interface ExpensesDataInputType {
    organization_id?: string;
    expense_type?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
    offset?: number;
}

type ExpensesData = {
    id: number;
    organization_id: number;
    expense_type: string;
    amount: number;
    date: string;
    comment: string;
    account_id: string;
    created_by: number;
    created_at: string;
    updated_at: string;
};

export interface ExpensesDataType {
    success: boolean;
    message: string;
    expenses: ExpensesData[];
    total: number;
}

export interface AddExpensesInputType {
    organization_id: number;
    expense_type: string;
    amount: number;
    date: string;
    comment?: string;
    account_id?: string;
}

export interface AddExpensesType {
    success: boolean;
    message: string;
    expense_id: number;
}

export interface UpdateExpensesInputType {
    expense_type: string;
    amount: number;
    date: string;
    comment?: string;
    account_id?: string;
}

export interface UpdateExpensesType {
    success: boolean;
    message: string;
    expense_id: number;
}

export type Supplier = {
    id: number;
    iiko_id: string;
    name: string;
    code: string;
    comment: string;
};
export interface GetSupplierType {
    success: boolean;
    message: string;
    suppliers: Supplier[];
    total: number;
}

export type GetPayoutTypes = {
    id: string;
    account_name: string;
    chief_account_name: string;
    transactionType: string;
    counteragentType: string;
    comment: string;
};
