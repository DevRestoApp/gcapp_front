import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text } from "react-native";
import { useEmployee } from "@/src/contexts/EmployeeContext";

export default function EmployeeDetails() {
    const { id } = useLocalSearchParams();

    const { selectedEmployee } = useEmployee();

    console.log("zxc", selectedEmployee);

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            {/* Заголовок в навигации */}
            <Stack.Screen options={{ title: `Сотрудник ${id}` }} />

            <Text style={{ fontSize: 22 }}>Детали сотрудника с ID: {id}</Text>
        </View>
    );
}
