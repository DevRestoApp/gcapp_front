import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

import { FormContainer } from "@/src/client/components/form/FormContainer";
import { FormField } from "@/src/client/components/form/FormFields";
import { NumberInput } from "@/src/client/components/form/NumberInput";
import { FormTextInput } from "@/src/client/components/form/TextInput";
import SegmentedControl from "@/src/client/components/Tabs";
import MenuPicker, { MenuItem } from "@/src/client/components/form/MenuPicker";
import { useManager } from "@/src/contexts/ManagerProvider";

import { useStorage } from "@/src/contexts/StorageProvider";

export default function StorageForm() {
    const { selectedStorageTab } = useManager();
    const { document, setDocument } = useStorage();
    const router = useRouter();
    console.log("DOC", document);

    const [showMenuPicker, setShowMenuPicker] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
        null,
    );

    const [activeTab, setActiveTab] = useState<"content">("content");

    const tabs = [{ label: "Содержимое", value: "content" }];

    // Single form state object
    const [formDataItems, setFormDataItems] = useState({
        item_id: 0,
        item_name: "",
        quantity: "",
        itemUnit: "",
        itemPurchasePrice: "",
        itemAccountingQuantity: "",
        itemCoefficient: "",
        itemNote: "",
        price: "",
        itemCostPrice: "",
        amount: "",
        itemAccountingAmount: "",
        created_at: document.date,
    });

    // Generic handler for form updates
    const handleFormChange = (field: string, value: string | number) => {
        setFormDataItems((prev) => ({ ...prev, [field]: value }));
    };

    // Handle menu item selection
    const handleMenuItemSelect = (item: MenuItem) => {
        setSelectedMenuItem(item);
        console.log("ITEM", item);
        setFormDataItems((prev) => ({
            ...prev,
            item_id: item.id,
            item_name: item.name,
        }));
    };

    // Menu item picker button component
    const MenuItemPickerButton = () => (
        <TouchableOpacity
            style={styles.menuPickerButton}
            onPress={() => setShowMenuPicker(true)}
        >
            <View style={styles.menuPickerContent}>
                {selectedMenuItem ? (
                    <View style={styles.selectedItemInfo}>
                        <Text style={styles.selectedItemName}>
                            {selectedMenuItem.name}
                        </Text>
                        <Text style={styles.selectedItemPrice}>
                            {selectedMenuItem.price.toLocaleString("ru-RU")} тг
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.placeholderText}>
                        Нажмите для выбора товара
                    </Text>
                )}
            </View>
            <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
    );

    const renderFormReceipts = () => {
        const handleSubmit = async () => {
            if (!formDataItems.item_id) {
                Alert.alert("Ошибка", "Пожалуйста, выберите товар");
                return;
            }
            if (
                !formDataItems.quantity ||
                Number(formDataItems.quantity) <= 0
            ) {
                Alert.alert("Ошибка", "Пожалуйста, введите количество");
                return;
            }
            if (!formDataItems.price || Number(formDataItems.price) <= 0) {
                Alert.alert("Ошибка", "Пожалуйста, введите цену");
                return;
            }

            const preparedData: any = {
                ...document,
                items: [...document.items, formDataItems],
            };
            setDocument(preparedData);
            // Reset form
            setFormDataItems({
                item_id: 0,
                item_name: "",
                quantity: "",
                itemUnit: "",
                itemPurchasePrice: "",
                itemAccountingQuantity: "",
                itemCoefficient: "",
                itemNote: "",
                price: "",
                itemCostPrice: "",
                amount: "",
                itemAccountingAmount: "",
                created_at: document.date,
            });
            setSelectedMenuItem(null);
            router.push("/manager/storage/item");
        };

        return (
            <View>
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        setActiveTab(value as "content");
                    }}
                />

                <FormContainer
                    title={"Добавить содержимое"}
                    description="Заполните нужную информацию"
                    onSubmit={handleSubmit}
                    submitText="Сохранить"
                >
                    <View>
                        <FormField label="Название товара">
                            <MenuItemPickerButton />
                        </FormField>
                        <FormField label="Количество">
                            <FormTextInput
                                value={formDataItems.quantity}
                                onChange={(value) =>
                                    handleFormChange("quantity", value)
                                }
                                placeholder="Введите данные"
                            />
                        </FormField>

                        <FormField label="Цена">
                            <NumberInput
                                value={formDataItems.price}
                                onChange={(value) =>
                                    handleFormChange("price", value)
                                }
                                placeholder="Выберите цену"
                                currency="тг"
                                maxLength={20}
                            />
                        </FormField>
                    </View>
                </FormContainer>

                <MenuPicker
                    visible={showMenuPicker}
                    onClose={() => setShowMenuPicker(false)}
                    onSelect={handleMenuItemSelect}
                    selectedItem={selectedMenuItem}
                    title="Выберите товар"
                />
            </View>
        );
    };

    const renderFormInventory = () => {
        const handleSubmit = async () => {
            if (!formDataItems.item_id) {
                Alert.alert("Ошибка", "Пожалуйста, выберите товар");
                return;
            }
            if (
                !formDataItems.quantity ||
                Number(formDataItems.quantity) <= 0
            ) {
                Alert.alert("Ошибка", "Пожалуйста, введите количество");
                return;
            }
            if (!formDataItems.price || Number(formDataItems.price) <= 0) {
                Alert.alert("Ошибка", "Пожалуйста, введите цену");
                return;
            }

            const preparedData: any = {
                ...document,
                items: [...document.items, formDataItems],
            };
            setDocument(preparedData);
            // Reset form
            setFormDataItems({
                item_id: 0,
                item_name: "",
                quantity: "",
                itemUnit: "",
                itemPurchasePrice: "",
                itemAccountingQuantity: "",
                itemCoefficient: "",
                itemNote: "",
                price: "",
                itemCostPrice: "",
                amount: "",
                itemAccountingAmount: "",
                created_at: document.date,
            });
            setSelectedMenuItem(null);
            router.push("/manager/storage/item");
        };

        return (
            <View>
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        setActiveTab(value as "content");
                    }}
                />

                <FormContainer
                    title={"Добавить содержимое"}
                    description="Заполните нужную информацию"
                    onSubmit={handleSubmit}
                    submitText="Сохранить"
                >
                    <View>
                        <FormField label="Название товара">
                            <MenuItemPickerButton />
                        </FormField>

                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <FormField label="Количество">
                                <FormTextInput
                                    value={formDataItems.quantity}
                                    onChange={(value) =>
                                        handleFormChange("quantity", value)
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>

                            <FormField label="Единицы">
                                <FormTextInput
                                    value={formDataItems.itemUnit}
                                    onChange={(value) =>
                                        handleFormChange("itemUnit", value)
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>
                        </View>

                        <FormField label="Учетное количество">
                            <FormTextInput
                                value={formDataItems.itemAccountingQuantity}
                                onChange={(value) =>
                                    handleFormChange(
                                        "itemAccountingQuantity",
                                        value,
                                    )
                                }
                                placeholder="Введите данные"
                            />
                        </FormField>

                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <FormField label="Коэффициент">
                                <FormTextInput
                                    value={formDataItems.itemCoefficient}
                                    onChange={(value) =>
                                        handleFormChange(
                                            "itemCoefficient",
                                            value,
                                        )
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>

                            <FormField label="Себестоимость">
                                <FormTextInput
                                    value={formDataItems.itemCostPrice}
                                    onChange={(value) =>
                                        handleFormChange("itemCostPrice", value)
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>

                            <FormField label="Сумма">
                                <NumberInput
                                    value={formDataItems.amount}
                                    onChange={(value) =>
                                        handleFormChange("amount", value)
                                    }
                                    placeholder="Выберите сумму"
                                    currency="тг"
                                    maxLength={20}
                                />
                            </FormField>

                            <FormField label="Учетная сумма">
                                <NumberInput
                                    value={formDataItems.itemAccountingAmount}
                                    onChange={(value) =>
                                        handleFormChange(
                                            "itemAccountingAmount",
                                            value,
                                        )
                                    }
                                    placeholder="Выберите сумму"
                                    currency="тг"
                                    maxLength={20}
                                />
                            </FormField>
                        </View>
                    </View>
                </FormContainer>

                <MenuPicker
                    visible={showMenuPicker}
                    onClose={() => setShowMenuPicker(false)}
                    onSelect={handleMenuItemSelect}
                    selectedItem={selectedMenuItem}
                    title="Выберите товар"
                />
            </View>
        );
    };

    const renderFormWriteoffs = () => {
        const handleSubmit = async () => {
            if (!formDataItems.item_id) {
                Alert.alert("Ошибка", "Пожалуйста, выберите товар");
                return;
            }
            if (
                !formDataItems.quantity ||
                Number(formDataItems.quantity) <= 0
            ) {
                Alert.alert("Ошибка", "Пожалуйста, введите количество");
                return;
            }
            if (!formDataItems.price || Number(formDataItems.price) <= 0) {
                Alert.alert("Ошибка", "Пожалуйста, введите цену");
                return;
            }

            const preparedData: any = {
                ...document,
                items: [...document.items, formDataItems],
            };
            setDocument(preparedData);
            // Reset form
            setFormDataItems({
                item_id: 0,
                item_name: "",
                quantity: "",
                itemUnit: "",
                itemPurchasePrice: "",
                itemAccountingQuantity: "",
                itemCoefficient: "",
                itemNote: "",
                price: "",
                itemCostPrice: "",
                amount: "",
                itemAccountingAmount: "",
                created_at: document.date,
            });
            setSelectedMenuItem(null);
            router.push("/manager/storage/item");
        };

        return (
            <View>
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        setActiveTab(value as "content");
                    }}
                />

                <FormContainer
                    title={"Добавить содержимое"}
                    description="Заполните нужную информацию"
                    onSubmit={handleSubmit}
                    submitText="Сохранить"
                >
                    <View>
                        <FormField label="Название товара">
                            <MenuItemPickerButton />
                        </FormField>

                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <FormField label="Количество">
                                <FormTextInput
                                    value={formDataItems.quantity}
                                    onChange={(value) =>
                                        handleFormChange("quantity", value)
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>

                            <FormField label="Единицы">
                                <FormTextInput
                                    value={formDataItems.itemUnit}
                                    onChange={(value) =>
                                        handleFormChange("itemUnit", value)
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>
                        </View>

                        <FormField label="Учетное количество">
                            <FormTextInput
                                value={formDataItems.itemAccountingQuantity}
                                onChange={(value) =>
                                    handleFormChange(
                                        "itemAccountingQuantity",
                                        value,
                                    )
                                }
                                placeholder="Введите данные"
                            />
                        </FormField>

                        <View style={{ flexDirection: "row", gap: 12 }}>
                            <FormField label="Коэффициент">
                                <FormTextInput
                                    value={formDataItems.itemCoefficient}
                                    onChange={(value) =>
                                        handleFormChange(
                                            "itemCoefficient",
                                            value,
                                        )
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>

                            <FormField label="Примечание">
                                <FormTextInput
                                    value={formDataItems.itemNote}
                                    onChange={(value) =>
                                        handleFormChange("itemNote", value)
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>

                            <FormField label="Цена">
                                <NumberInput
                                    value={formDataItems.price}
                                    onChange={(value) =>
                                        handleFormChange("price", value)
                                    }
                                    placeholder="Выберите сумму"
                                    currency="тг"
                                    maxLength={20}
                                />
                            </FormField>

                            <FormField label="Сумма">
                                <NumberInput
                                    value={formDataItems.amount}
                                    onChange={(value) =>
                                        handleFormChange("amount", value)
                                    }
                                    placeholder="Выберите сумму"
                                    currency="тг"
                                    maxLength={20}
                                />
                            </FormField>
                        </View>
                    </View>
                </FormContainer>

                <MenuPicker
                    visible={showMenuPicker}
                    onClose={() => setShowMenuPicker(false)}
                    onSelect={handleMenuItemSelect}
                    selectedItem={selectedMenuItem}
                    title="Выберите товар"
                />
            </View>
        );
    };

    switch (selectedStorageTab) {
        case "receipts":
            return renderFormReceipts();
        case "inventory":
            return renderFormInventory();
        case "writeoffs":
            return renderFormWriteoffs();
        default:
            return null;
    }
}

const styles = StyleSheet.create({
    menuPickerButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(35, 35, 36, 1)",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(60, 130, 253, 0.3)",
    },
    menuPickerContent: {
        flex: 1,
    },
    selectedItemInfo: {
        gap: 4,
    },
    selectedItemName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    selectedItemPrice: {
        color: "#797A80",
        fontSize: 14,
    },
    placeholderText: {
        color: "#797A80",
        fontSize: 16,
    },
    chevron: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "300",
    },
});
