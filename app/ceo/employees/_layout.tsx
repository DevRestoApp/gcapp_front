import { Stack } from "expo-router";
import { EmployeeProvider } from "@/src/contexts/EmployeeContext";

export default function EmployeesLayout() {
    return (
        <EmployeeProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    presentation: "card",
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: "Сотрудники",
                    }}
                />
                <Stack.Screen
                    name="[id]/index"
                    options={{
                        title: "Профиль сотрудника",
                    }}
                />
                <Stack.Screen
                    name="[id]/table/[tableId]"
                    options={{
                        title: "Стол",
                    }}
                />
            </Stack>
        </EmployeeProvider>
    );
}
