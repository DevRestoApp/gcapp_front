import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { ButtonStyles } from "@/src/client/styles/ui/buttons/Button.styles";
import { useRouter } from "expo-router";

export default function AddOrder() {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={[ButtonStyles.buttonWhite, { width: "100%" }]}
            onPress={() => router.push("/waiter/newOrder")}
        >
            <Text style={ButtonStyles.buttonText}>+ Новый заказ</Text>
        </TouchableOpacity>
    );
}
