import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

import { FormContainer } from "@/src/client/components/form/FormContainer";
import { FormField } from "@/src/client/components/form/FormFields";
import { OptionPicker } from "@/src/client/components/form/OptionPicker";
import { CommentInput } from "@/src/client/components/form/Comment";
import { NumberInput } from "@/src/client/components/form/NumberInput";
import { FormTextInput } from "@/src/client/components/form/TextInput";
import { DatePickerButton } from "@/src/client/components/form/DatePicker";
import { ReportCalendar } from "@/src/client/components/reports/Calendar";
import SegmentedControl from "@/src/client/components/Tabs";
import MenuPicker, { MenuItem } from "@/src/client/components/form/MenuPicker";
import { useManager } from "@/src/contexts/ManagerProvider";
import { Day } from "@/src/client/types/waiter";
import { createWarehouseDocumentIncomingInvoice } from "@/src/server/general/warehouse";

export default function StorageForm() {
    const { selectedStorageTab } = useManager();
    const router = useRouter(); // Add this import at the top: import { useRouter } from "expo-router";

    const [days, setDays] = useState<Day[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showMenuPicker, setShowMenuPicker] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
        null,
    );

    const [activeTab, setActiveTab] = useState<"general" | "content">(
        "general",
    );

    const storageOptions = [
        { label: "Продуктовый", value: "products" },
        { label: "Второй", value: "second" },
        { label: "Третий", value: "third" },
        { label: "Четвертый", value: "fourth" },
    ];

    const tabs = [
        { label: "Общая инфо.", value: "general" },
        { label: "Содержимое", value: "content" },
    ];

    // Single form state object
    const [formData, setFormData] = useState({
        storage: "",
        amount: "",
        accountingAmount: "",
        date: "",
        comment: "",
        priceType: "",
        deviaton: "",
        supplier: "",
        itemId: 0,
        itemName: "",
        itemQuantity: "",
        itemUnit: "",
        itemPurchasePrice: "",
        itemAccountingQuantity: "",
        itemCoefficient: "",
        itemNote: "",
        itemPrice: "",
        itemCostPrice: "",
        itemAmount: "",
        itemAccountingAmount: "",
    });

    // Generic handler for form updates
    const handleFormChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDateSelect = (selectedDate: string) => {
        handleFormChange("date", selectedDate);
    };

    // Handle menu item selection
    const handleMenuItemSelect = (item: MenuItem) => {
        setSelectedMenuItem(item);
        setFormData((prev) => ({
            ...prev,
            itemId: item.id,
            itemName: item.name,
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
            try {
                // Validate required fields
                if (!formData.date) {
                    Alert.alert("Ошибка", "Пожалуйста, выберите дату");
                    return;
                }
                if (!formData.itemId) {
                    Alert.alert("Ошибка", "Пожалуйста, выберите товар");
                    return;
                }
                if (
                    !formData.itemQuantity ||
                    Number(formData.itemQuantity) <= 0
                ) {
                    Alert.alert("Ошибка", "Пожалуйста, введите количество");
                    return;
                }
                if (!formData.itemPrice || Number(formData.itemPrice) <= 0) {
                    Alert.alert("Ошибка", "Пожалуйста, введите цену");
                    return;
                }

                const preparedData: any = {
                    dateIncoming: formData.date,
                    items: [
                        {
                            id: formData.itemId,
                            amount: Number(formData.itemQuantity),
                            price: Number(formData.itemPrice),
                            sum:
                                Number(formData.itemQuantity) *
                                Number(formData.itemPrice),
                        },
                    ],
                };

                if (formData.comment) {
                    preparedData.comment = formData.comment;
                }
                if (formData.supplier) {
                    preparedData.supplier = formData.supplier;
                }
                if (formData.storage) {
                    preparedData.storage = formData.storage;
                }

                // Make API call
                await createWarehouseDocumentIncomingInvoice(preparedData);

                // Show success notification
                Alert.alert("Успешно", "Приходная накладная успешно создана");
                router.push("/manager/storage");
                // Reset form
                setFormData({
                    storage: "",
                    amount: "",
                    accountingAmount: "",
                    date: "",
                    comment: "",
                    priceType: "",
                    deviaton: "",
                    supplier: "",
                    itemId: 0,
                    itemName: "",
                    itemQuantity: "",
                    itemUnit: "",
                    itemPurchasePrice: "",
                    itemAccountingQuantity: "",
                    itemCoefficient: "",
                    itemNote: "",
                    itemPrice: "",
                    itemCostPrice: "",
                    itemAmount: "",
                    itemAccountingAmount: "",
                });
                setSelectedMenuItem(null);
                setActiveTab("general");
            } catch (error: any) {
                console.error("Error creating document:", error);
                Alert.alert(
                    "Ошибка",
                    error.message || "Не удалось создать приходную накладную",
                );
            }
        };

        return (
            <View>
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        setActiveTab(value as "general" | "content");
                    }}
                />

                <FormContainer
                    title={`Добавить ${activeTab === "general" ? "общую информацию" : "содержимое"}`}
                    description="Заполните нужную информацию"
                    onSubmit={handleSubmit}
                    submitText="Сохранить"
                >
                    {activeTab === "general" ? (
                        <View>
                            <FormField label="Дата">
                                <DatePickerButton
                                    value={formData.date}
                                    onPress={() => setShowCalendar(true)}
                                    placeholder="Выберите дату"
                                />
                            </FormField>

                            <FormField label="Поставщик">
                                <FormTextInput
                                    value={formData.supplier}
                                    onChange={(value) =>
                                        handleFormChange("supplier", value)
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>

                            <FormField label="Склад">
                                <OptionPicker
                                    options={storageOptions}
                                    value={formData.storage}
                                    onChange={(value) =>
                                        handleFormChange("storage", value)
                                    }
                                    placeholder="Выберите склад"
                                />
                            </FormField>

                            <FormField label="Сумма">
                                <NumberInput
                                    value={formData.amount}
                                    onChange={(value) =>
                                        handleFormChange("amount", value)
                                    }
                                    placeholder="Выберите сумму"
                                    currency="тг"
                                    maxLength={20}
                                />
                            </FormField>

                            <FormField label="Коментарий">
                                <CommentInput
                                    value={formData.comment}
                                    onChange={(value) =>
                                        handleFormChange("comment", value)
                                    }
                                    placeholder="Напишите коментарий"
                                />
                            </FormField>

                            <ReportCalendar
                                visible={showCalendar}
                                onClose={() => setShowCalendar(false)}
                                onDateSelect={handleDateSelect}
                                initialDate={formData.date}
                            />
                        </View>
                    ) : (
                        <View>
                            <FormField label="Название товара">
                                <MenuItemPickerButton />
                            </FormField>
                            <FormField label="Количество">
                                <FormTextInput
                                    value={formData.itemQuantity}
                                    onChange={(value) =>
                                        handleFormChange("itemQuantity", value)
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>

                            <FormField label="Цена">
                                <NumberInput
                                    value={formData.itemPrice}
                                    onChange={(value) =>
                                        handleFormChange("itemPrice", value)
                                    }
                                    placeholder="Выберите цену"
                                    currency="тг"
                                    maxLength={20}
                                />
                            </FormField>
                        </View>
                    )}
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
        const handleSubmit = () => {
            console.log(formData);
        };

        return (
            <View>
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        setActiveTab(value as "general" | "content");
                    }}
                />

                <FormContainer
                    title={`Добавить ${activeTab === "general" ? "общую информацию" : "содержимое"}`}
                    description="Заполните нужную информацию"
                    onSubmit={handleSubmit}
                    submitText="Сохранить"
                >
                    {activeTab === "general" ? (
                        <View>
                            <FormField label="Дата">
                                <DatePickerButton
                                    value={formData.date}
                                    onPress={() => setShowCalendar(true)}
                                    placeholder="Выберите дату"
                                />
                            </FormField>

                            <FormField label="Склад">
                                <OptionPicker
                                    options={storageOptions}
                                    value={formData.storage}
                                    onChange={(value) =>
                                        handleFormChange("storage", value)
                                    }
                                    placeholder="Выберите склад"
                                />
                            </FormField>

                            <FormField label="Тип цены">
                                <FormTextInput
                                    value={formData.priceType}
                                    onChange={(value) =>
                                        handleFormChange("priceType", value)
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>

                            <FormField label="Сумма">
                                <NumberInput
                                    value={formData.amount}
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
                                    value={formData.accountingAmount}
                                    onChange={(value) =>
                                        handleFormChange(
                                            "accountingAmount",
                                            value,
                                        )
                                    }
                                    placeholder="Выберите сумму"
                                    currency="тг"
                                    maxLength={20}
                                />
                            </FormField>

                            <FormField label="Отклонение">
                                <FormTextInput
                                    value={formData.deviaton}
                                    onChange={(value) =>
                                        handleFormChange("deviaton", value)
                                    }
                                    placeholder="Введите данные"
                                />
                            </FormField>

                            <FormField label="Коментарий">
                                <CommentInput
                                    value={formData.comment}
                                    onChange={(value) =>
                                        handleFormChange("comment", value)
                                    }
                                    placeholder="Напишите коментарий"
                                />
                            </FormField>

                            <ReportCalendar
                                visible={showCalendar}
                                onClose={() => setShowCalendar(false)}
                                onDateSelect={handleDateSelect}
                                initialDate={formData.date}
                            />
                        </View>
                    ) : (
                        <View>
                            <FormField label="Название товара">
                                <MenuItemPickerButton />
                            </FormField>

                            <View style={{ flexDirection: "row", gap: 12 }}>
                                <FormField label="Количество">
                                    <FormTextInput
                                        value={formData.itemQuantity}
                                        onChange={(value) =>
                                            handleFormChange(
                                                "itemQuantity",
                                                value,
                                            )
                                        }
                                        placeholder="Введите данные"
                                    />
                                </FormField>

                                <FormField label="Единицы">
                                    <FormTextInput
                                        value={formData.itemUnit}
                                        onChange={(value) =>
                                            handleFormChange("itemUnit", value)
                                        }
                                        placeholder="Введите данные"
                                    />
                                </FormField>
                            </View>

                            <FormField label="Учетное количество">
                                <FormTextInput
                                    value={formData.itemAccountingQuantity}
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
                                        value={formData.itemCoefficient}
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
                                        value={formData.itemCostPrice}
                                        onChange={(value) =>
                                            handleFormChange(
                                                "itemCostPrice",
                                                value,
                                            )
                                        }
                                        placeholder="Введите данные"
                                    />
                                </FormField>

                                <FormField label="Сумма">
                                    <NumberInput
                                        value={formData.itemAmount}
                                        onChange={(value) =>
                                            handleFormChange(
                                                "itemAmount",
                                                value,
                                            )
                                        }
                                        placeholder="Выберите сумму"
                                        currency="тг"
                                        maxLength={20}
                                    />
                                </FormField>

                                <FormField label="Учетная сумма">
                                    <NumberInput
                                        value={formData.itemAccountingAmount}
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
                    )}
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
        const handleSubmit = () => {
            console.log(formData);
        };

        return (
            <View>
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        setActiveTab(value as "general" | "content");
                    }}
                />

                <FormContainer
                    title={`Добавить ${activeTab === "general" ? "общую информацию" : "содержимое"}`}
                    description="Заполните нужную информацию"
                    onSubmit={handleSubmit}
                    submitText="Сохранить"
                >
                    {activeTab === "general" ? (
                        <View>
                            <FormField label="Дата">
                                <DatePickerButton
                                    value={formData.date}
                                    onPress={() => setShowCalendar(true)}
                                    placeholder="Выберите дату"
                                />
                            </FormField>

                            <FormField label="Склад">
                                <OptionPicker
                                    options={storageOptions}
                                    value={formData.storage}
                                    onChange={(value) =>
                                        handleFormChange("storage", value)
                                    }
                                    placeholder="Выберите склад"
                                />
                            </FormField>

                            <FormField label="Сумма">
                                <NumberInput
                                    value={formData.amount}
                                    onChange={(value) =>
                                        handleFormChange("amount", value)
                                    }
                                    placeholder="Выберите сумму"
                                    currency="тг"
                                    maxLength={20}
                                />
                            </FormField>

                            <FormField label="Коментарий">
                                <CommentInput
                                    value={formData.comment}
                                    onChange={(value) =>
                                        handleFormChange("comment", value)
                                    }
                                    placeholder="Напишите коментарий"
                                />
                            </FormField>

                            <ReportCalendar
                                visible={showCalendar}
                                onClose={() => setShowCalendar(false)}
                                onDateSelect={handleDateSelect}
                                initialDate={formData.date}
                            />
                        </View>
                    ) : (
                        <View>
                            <FormField label="Название товара">
                                <MenuItemPickerButton />
                            </FormField>

                            <View style={{ flexDirection: "row", gap: 12 }}>
                                <FormField label="Количество">
                                    <FormTextInput
                                        value={formData.itemQuantity}
                                        onChange={(value) =>
                                            handleFormChange(
                                                "itemQuantity",
                                                value,
                                            )
                                        }
                                        placeholder="Введите данные"
                                    />
                                </FormField>

                                <FormField label="Единицы">
                                    <FormTextInput
                                        value={formData.itemUnit}
                                        onChange={(value) =>
                                            handleFormChange("itemUnit", value)
                                        }
                                        placeholder="Введите данные"
                                    />
                                </FormField>
                            </View>

                            <FormField label="Учетное количество">
                                <FormTextInput
                                    value={formData.itemAccountingQuantity}
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
                                        value={formData.itemCoefficient}
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
                                        value={formData.itemNote}
                                        onChange={(value) =>
                                            handleFormChange("itemNote", value)
                                        }
                                        placeholder="Введите данные"
                                    />
                                </FormField>

                                <FormField label="Цена">
                                    <NumberInput
                                        value={formData.itemPrice}
                                        onChange={(value) =>
                                            handleFormChange("itemPrice", value)
                                        }
                                        placeholder="Выберите сумму"
                                        currency="тг"
                                        maxLength={20}
                                    />
                                </FormField>

                                <FormField label="Сумма">
                                    <NumberInput
                                        value={formData.itemAmount}
                                        onChange={(value) =>
                                            handleFormChange(
                                                "itemAmount",
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
                    )}
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
