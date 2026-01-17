import api from "../api";
import { checkFilters } from "@/src/utils/serverUtils";
import {
    createWarehouseDocumentIncomingInvoiceType,
    createWarehouseDocumentInventoryType,
    createWarehouseDocumentWriteoffType,
    WarehouseDocumentsFilters,
} from "@/src/server/types/storage";

export async function getWarehouseDocuments(
    filters: WarehouseDocumentsFilters,
) {
    const params = checkFilters(filters);
    const res = await api.get("/warehouse/documents", { params });

    return res.data;
}
export async function getWarehouseStore() {
    const res = await api.get("/warehouse/stores");
    return res.data?.data;
}

export async function createWarehouseDocument(
    data:
        | createWarehouseDocumentWriteoffType
        | createWarehouseDocumentInventoryType
        | createWarehouseDocumentIncomingInvoiceType,
) {
    try {
        const res = await api.post("/documents", data);

        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function updateWarehouseDocument(
    document_id: number,
    data:
        | createWarehouseDocumentWriteoffType
        | createWarehouseDocumentInventoryType
        | createWarehouseDocumentIncomingInvoiceType,
) {
    const res = await api.put(`/documents/${document_id}`, data);

    return res.data;
}
