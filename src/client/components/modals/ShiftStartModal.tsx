import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import ModalWrapper, { ModalWrapperRef } from "./ModalWrapper";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";

export default function ShiftStartModal() {
    const modalRef = useRef<ModalWrapperRef>(null);
    const [time, setTime] = useState("12:32");

    const handleStartShift = () => {
        console.log("Смена начата в:", time);
        modalRef.current?.close();
    };

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            {/* Кнопка открытия */}
            <TouchableOpacity
                style={ButtonStyles.buttonWhite}
                onPress={() => modalRef.current?.open()}
            >
                <Text style={ButtonStyles.buttonText}>Начать смену</Text>
            </TouchableOpacity>

            {/* Модалка */}
            <ModalWrapper ref={modalRef}>
                {/* Заголовок */}
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "600",
                        color: "white",
                        textAlign: "center",
                        marginBottom: 8,
                    }}
                >
                    Начало смены
                </Text>
                <Text
                    style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.7)",
                        textAlign: "center",
                        marginBottom: 16,
                    }}
                >
                    Для начала смены нужно заполнить информацию
                </Text>

                {/* Ввод времени */}
                <View
                    style={{
                        marginBottom: 16,
                        backgroundColor: "rgba(43,43,44,1)",
                        borderRadius: 16,
                        padding: 12,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            color: "rgba(121,122,128,1)",
                            marginBottom: 4,
                        }}
                    >
                        Время начала
                    </Text>
                    <TextInput
                        value={time}
                        onChangeText={setTime}
                        placeholder="12:32"
                        placeholderTextColor="#aaa"
                        style={{
                            color: "white",
                            fontSize: 16,
                            paddingVertical: 4,
                        }}
                    />
                </View>

                {/* Кнопка запуска смены */}
                <TouchableOpacity
                    style={[ButtonStyles.buttonWhite, { marginTop: 8 }]}
                    onPress={handleStartShift}
                >
                    <Text style={ButtonStyles.buttonText}>Начать смену</Text>
                </TouchableOpacity>
            </ModalWrapper>
        </View>
    );
}
