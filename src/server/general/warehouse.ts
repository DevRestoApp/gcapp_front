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

export async function createWarehouseDocumentWriteoff(
    data: createWarehouseDocumentWriteoffType,
) {
    const res = await api.post("/documents/writeoff", data);

    return res.data;
}
export async function createWarehouseDocumentInventory(
    data: createWarehouseDocumentInventoryType,
) {
    const res = await api.post("/documents/inventory", data);

    return res.data;
}
export async function createWarehouseDocumentIncomingInvoice(
    data: createWarehouseDocumentIncomingInvoiceType,
) {
    try {
        const res = await api.post("/documents/incoming-invoice", data);

        return res.data;
    } catch (error) {
        console.log(error);
    }
}
