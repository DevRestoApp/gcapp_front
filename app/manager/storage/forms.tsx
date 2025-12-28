import React, { useState } from "react";
import { View } from "react-native";

import { FormContainer } from "@/src/client/components/form/FormContainer";
import { FormField } from "@/src/client/components/form/FormFields";
import { OptionPicker } from "@/src/client/components/form/OptionPicker";
import { CommentInput } from "@/src/client/components/form/Comment";
import { NumberInput } from "@/src/client/components/form/NumberInput";
import { FormTextInput } from "@/src/client/components/form/TextInput";
import { DatePickerButton } from "@/src/client/components/form/DatePicker";
import { ReportCalendar } from "@/src/client/components/reports/Calendar";
import SegmentedControl from "@/src/client/components/Tabs";
import { useManager } from "@/src/contexts/ManagerProvider";
import { Day } from "@/src/client/types/waiter";

export default function StorageForm() {
    const { selectedStorageTab } = useManager();
    console.log("selectedStorageTab", selectedStorageTab);

    const [days, setDays] = useState<Day[]>([]);
    const [showCalendar, setShowCalendar] = useState(false);

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
    const handleFormChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDateSelect = (selectedDate: string) => {
        handleFormChange("date", selectedDate);
    };

    const renderFormReceipts = () => {
        const handleSubmit = () => {
            console.log(formData);
            // TODO implement proper save handle

            let preparedData = {};
            if (selectedStorageTab === "receipts") {
                preparedData = {
                    dateIncoming: formData.date,
                    items: [
                        {
                            id: "",
                            amount: formData.itemQuantity,
                            price: formData.itemPrice,
                            sum: formData.accountingAmount,
                        },
                    ],
                };
                if (formData.comment)
                    preparedData["comment"] = formData.comment;
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
                            {/*// TODO Поменять на модалку с option picker + search как в waiter/menu*/}
                            <FormField label="Название товара">
                                <FormTextInput
                                    value={formData.itemName}
                                    onChange={(value) =>
                                        handleFormChange("itemName", value)
                                    }
                                    placeholder="Введите данные"
                                />
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

                            <FormField label="Сумма">
                                <NumberInput
                                    value={formData.itemAmount}
                                    onChange={(value) =>
                                        handleFormChange("itemPrice", value)
                                    }
                                    placeholder="Выберите сумму"
                                    currency="тг"
                                    maxLength={20}
                                />
                            </FormField>
                        </View>
                    )}
                </FormContainer>
            </View>
        );
    };
    const renderFormInventory = () => {
        const handleSubmit = () => {
            console.log(formData);
            // TODO implement proper save handle
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
                            {/*// TODO Поменять на модалку с option picker + search как в waiter/menu*/}
                            <FormField label="Название товара">
                                <FormTextInput
                                    value={formData.itemName}
                                    onChange={(value) =>
                                        handleFormChange("itemName", value)
                                    }
                                    placeholder="Введите данные"
                                />
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
            </View>
        );
    };
    const renderFormWriteoffs = () => {
        const handleSubmit = () => {
            console.log(formData);
            // TODO implement proper save handle
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
                            {/*// TODO Поменять на модалку с option picker + search как в waiter/menu*/}
                            <FormField label="Название товара">
                                <FormTextInput
                                    value={formData.itemName}
                                    onChange={(value) =>
                                        handleFormChange("itemName", value)
                                    }
                                    placeholder="Введите данные"
                                />
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
            </View>
        );
    };

    console.log("selectedStorageTab", selectedStorageTab);

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
