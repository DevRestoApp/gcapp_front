import React, { useState, useEffect } from "react";
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
import { useManager } from "@/src/contexts/ManagerProvider";
import { useStorage } from "@/src/contexts/StorageProvider";

export default function StorageForm() {
    const { selectedStorageTab, loading } = useManager();
    const { setDocument, fetchStores, document } = useStorage();
    const router = useRouter();

    const [showCalendar, setShowCalendar] = useState(false);
    const [storageOptions, setStorageOptions] = useState([]);

    const [activeTab, setActiveTab] = useState<"general">("general");

    useEffect(() => {
        const loadStores = async () => {
            try {
                const options = await fetchStores();
                setStorageOptions(options);
            } catch (error) {
                console.error("Failed to fetch stores:", error);
            }
        };

        loadStores();
    }, []);

    useEffect(() => {
        if (document?.items && document.items.length > 0) {
            const sum = document.items
                .map((el) => Number(el.amount) || 0)
                .reduce((a, b) => a + b, 0);

            setFormData((prev) => ({
                ...prev,
                accountingAmount: sum.toString(),
            }));
        }
    }, [document?.items]);

    const tabs = [{ label: "Общая инфо.", value: "general" }];

    // Single form state object
    const [formData, setFormData] = useState({
        store_id: "",
        amount: "",
        accountingAmount: "",
        date: "",
        comment: "",
        priceType: "",
        deviaton: "",
        supplier: "",
    });

    // Generic handler for form updates
    const handleFormChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDateSelect = (selectedDate: string) => {
        handleFormChange("date", selectedDate);
    };

    const renderFormReceipts = () => {
        const handleSubmit = () => {
            // Validate required fields
            if (!formData.date) {
                Alert.alert("Ошибка", "Пожалуйста, выберите дату");
                return;
            }

            const preparedData: any = {
                date: formData.date,
                date_incoming: formData.date,
                items: [],
            };

            preparedData.document_type = "RECEIPT";
            if (formData.comment) {
                preparedData.comment = formData.comment;
            }
            if (formData.supplier) {
                preparedData.supplier = formData.supplier;
            }
            if (formData.store_id) {
                preparedData.store_id = formData.store_id;
            }

            // Make API call
            setDocument(preparedData);

            // Reset form
            setFormData({
                store_id: "",
                amount: "",
                accountingAmount: "",
                date: "",
                comment: "",
                priceType: "",
                deviaton: "",
                supplier: "",
            });
            setActiveTab("general");
            router.push("/manager/storage/item");
        };

        return (
            <View>
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        setActiveTab(value as "general");
                    }}
                />

                <FormContainer
                    title={`Добавить общую информацию`}
                    description="Заполните нужную информацию"
                    onSubmit={handleSubmit}
                    submitText="Далее"
                >
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
                                value={formData.store_id}
                                onChange={(value) =>
                                    handleFormChange("store_id", value)
                                }
                                placeholder="Выберите склад"
                            />
                        </FormField>

                        <FormField label="Сумма">
                            <View style={styles.displayField}>
                                <Text style={styles.displayValue}>
                                    {formData.accountingAmount || "0"} тг
                                </Text>
                            </View>
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
                </FormContainer>
            </View>
        );
    };

    const renderFormInventory = () => {
        const handleSubmit = async () => {
            // Validate required fields
            if (!formData.date) {
                Alert.alert("Ошибка", "Пожалуйста, выберите дату");
                return;
            }

            const preparedData: any = {
                date: formData.date,
                date_incoming: formData.date,
                items: [],
            };

            preparedData.document_type = "INVENTORY";
            if (formData.comment) {
                preparedData.comment = formData.comment;
            }
            if (formData.supplier) {
                preparedData.supplier = formData.supplier;
            }
            if (formData.store_id) {
                preparedData.store_id = formData.store_id;
            }
            if (formData.priceType) {
                preparedData.priceType = formData.priceType;
            }
            if (formData.amount) {
                preparedData.amount = formData.amount;
            }
            if (formData.accountingAmount) {
                preparedData.accountingAmount = formData.accountingAmount;
            }
            if (formData.deviaton) {
                preparedData.deviaton = formData.deviaton;
            }

            // Make API call
            setDocument(preparedData);

            // Reset form
            setFormData({
                store_id: "",
                amount: "",
                accountingAmount: "",
                date: "",
                comment: "",
                priceType: "",
                deviaton: "",
                supplier: "",
            });
            setActiveTab("general");

            router.push("/manager/storage/item");
        };

        return (
            <View>
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        setActiveTab(value as "general");
                    }}
                />

                <FormContainer
                    title={`Добавить общую информацию`}
                    description="Заполните нужную информацию"
                    onSubmit={handleSubmit}
                    submitText="Далее"
                >
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
                                value={formData.store_id}
                                onChange={(value) =>
                                    handleFormChange("store_id", value)
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

                        <FormField label="Сумма">
                            <View style={styles.displayField}>
                                <Text style={styles.displayValue}>
                                    {formData.accountingAmount || "0"} тг
                                </Text>
                            </View>
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
                </FormContainer>
            </View>
        );
    };

    const renderFormWriteoffs = () => {
        const handleSubmit = () => {
            // Validate required fields
            if (!formData.date) {
                Alert.alert("Ошибка", "Пожалуйста, выберите дату");
                return;
            }

            const preparedData: any = {
                date: formData.date,
                date_incoming: formData.date,
                items: [],
            };

            preparedData.document_type = "WRITEOFF";
            if (formData.store_id) {
                preparedData.store_id = formData.store_id;
            }
            if (formData.amount) {
                preparedData.amount = formData.amount;
            }
            if (formData.comment) {
                preparedData.comment = formData.comment;
            }

            // Make API call
            setDocument(preparedData);

            // Reset form
            setFormData({
                store_id: "",
                amount: "",
                accountingAmount: "",
                date: "",
                comment: "",
                priceType: "",
                deviaton: "",
                supplier: "",
            });
            setActiveTab("general");
            router.push("/manager/storage/item");
        };

        return (
            <View>
                <SegmentedControl
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(value) => {
                        setActiveTab(value as "general");
                    }}
                />

                <FormContainer
                    title={`Добавить общую информацию`}
                    description="Заполните нужную информацию"
                    onSubmit={handleSubmit}
                    submitText="Далее"
                >
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
                                value={formData.store_id}
                                onChange={(value) =>
                                    handleFormChange("store_id", value)
                                }
                                placeholder="Выберите склад"
                            />
                        </FormField>

                        <FormField label="Сумма">
                            <View style={styles.displayField}>
                                <Text style={styles.displayValue}>
                                    {formData.accountingAmount || "0"} тг
                                </Text>
                            </View>
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
                </FormContainer>
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
    displayField: {
        backgroundColor: "rgba(43, 43, 44, 1)",
        borderRadius: 16,
        padding: 16,
        minHeight: 50,
        justifyContent: "center",
    },
    displayValue: {
        color: "rgba(121, 122, 128, 1)",
        fontSize: 16,
        lineHeight: 22,
    },
});
