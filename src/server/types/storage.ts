export interface WarehouseDocumentsFilters {
    organization_id?: string | null;
    document_type?: string | null;
    from_date?: string | null;
    to_date?: string | null;
    limit?: number;
    offset?: number;
}

export type WarehouseDocumentsItemType = {
    id: number;
    document_id: number;
    item_id: number;
    item_iiko_id: string;
    item_name: string;
    quantity: number;
    price: number;
    amount: number;
    batch_number: null;
    expiry_date: null;
    created_at: string;
    updated_at: string;
};
type createWarehouseDocumentWriteoffItemType = {
    id: number;
    amount: number;
};
export type createWarehouseDocumentWriteoffType = {
    account_id: number;
    date: string;
    comment?: string;
    items: createWarehouseDocumentWriteoffItemType[];
};
type createWarehouseDocumentInventoryItemType = {
    id: number;
    amount: number;
    price?: number;
    sum?: number;
    containerId?: string;
    comment?: string;
};
export type createWarehouseDocumentInventoryType = {
    dateIncoming: string;
    accountSurplusCode: string;
    accountShortageCode: string;
    comment?: string;
    items: createWarehouseDocumentInventoryItemType[];
};
type createWarehouseDocumentIncomingInvoiceItemType = {
    id: number;
    amount: number;
    price?: number;
    sum?: number;
};
export type createWarehouseDocumentIncomingInvoiceType = {
    dateIncoming: string;
    supplier?: string;
    invoice?: string;
    comment?: string;
    items: createWarehouseDocumentIncomingInvoiceItemType[];
};

export interface WarehouseDocumentsType {
    id: number;
    iiko_id: string;
    document_type: string;
    document_number: string;
    date: string;
    organization_id: number;
    store_id: string;
    created_by: number;
    comment: string;
    created_at: string;
    updated_at: string;
    items: WarehouseDocumentsItemType[];
}
export interface WarehouseDocumentsOutput {
    success: boolean;
    message: string;
    documents: WarehouseDocumentsType[];
    total: number;
}
