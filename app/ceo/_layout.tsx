// TODO move context and all fetches into single Context.tsx file in contexts directory
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { Tabs } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";

// Define your CEO data types
interface Employee {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    totalAmount: string;
    shiftTime: string;
    isActive: boolean;
    data?: { label: string; value: string }[];
}

interface Fine {
    id: string;
    employeeId: string;
    employeeName: string;
    amount: number;
    reason: string;
    date: string;
}

interface Motivation {
    id: string;
    employeeId: string;
    employeeName: string;
    amount: number;
    reason: string;
    date: string;
}

interface QuestEmployees {
    id: string;
    title: string;
    description: string;
    reward: number;
    target: number;
    unit: string;
    totalEmployees: number;
    completedEmployees: number;
    employeeNames?: string[];
    date: string;
}

interface ShiftData {
    openEmployees: number;
    totalAmount: number;
    finesCount: number;
    motivationCount: number;
    questsCount: number;
    elapsedTime: string;
    selectedDate: string;
}

interface CeoContextType {
    // Shift data
    shiftData: ShiftData;

    // Employees data
    employees: Employee[];

    // Fines and motivation
    fines: Fine[];
    motivation: Motivation[];

    // Quests
    quests: QuestEmployees[];

    // State
    loading: boolean;
    error: string | null;

    // Actions
    updateShiftData: (data: Partial<ShiftData>) => void;
    addEmployee: (employee: Employee) => void;
    updateEmployee: (id: string, employee: Partial<Employee>) => void;
    addFine: (fine: Omit<Fine, "id">) => void;
    addMotivation: (motivation: Omit<Motivation, "id">) => void;
    addQuest: (quest: Omit<QuestEmployees, "id">) => void;
    refetch: () => Promise<void>;
    fetchQuestsForDate: (date: string) => Promise<QuestEmployees[]>;
    getQuestById: (id: string) => QuestEmployees | undefined;
}

const CeoContext = createContext<CeoContextType | undefined>(undefined);

export const useCeo = () => {
    const context = useContext(CeoContext);
    if (!context) {
        throw new Error("useCeo must be used within CeoProvider");
    }
    return context;
};

// Mock API functions - replace with your actual API calls
const fetchEmployeesData = async (): Promise<Employee[]> => {
    console.log("Fetching employees data...");

    return [
        {
            id: "1",
            name: "Аслан Аманов",
            role: "Официант",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/3a1a0f795dd6cebc375ac2f7fbeab6a0d791efc8?width=80",
            totalAmount: "56 897 тг",
            shiftTime: "00:56:25",
            isActive: true,
            data: [
                { label: "Общая сумма", value: "56 897 тг" },
                { label: "Время смены", value: "00:56:25" },
            ],
        },
        {
            id: "2",
            name: "Аида Таманова",
            role: "Официант",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/4bd88d9313f5402e21d3f064a4ad85d264b177bb?width=80",
            totalAmount: "45 230 тг",
            shiftTime: "00:45:12",
            isActive: true,
            data: [
                { label: "Общая сумма", value: "45 230 тг" },
                { label: "Время смены", value: "00:45:12" },
            ],
        },
        {
            id: "3",
            name: "Арман Ашимов",
            role: "Бармен",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/4a47f1eee62770da0326efa94f2187fd2ec7547d?width=80",
            totalAmount: "32 150 тг",
            shiftTime: "01:12:33",
            isActive: true,
            data: [
                { label: "Общая сумма", value: "32 150 тг" },
                { label: "Время смены", value: "01:12:33" },
            ],
        },
        {
            id: "4",
            name: "Тима Янь",
            role: "Хостес",
            avatarUrl:
                "https://api.builder.io/api/v1/image/assets/TEMP/b97cb7d8a6a91ffcc6568eea52ade41a7e8dec91?width=80",
            totalAmount: "28 500 тг",
            shiftTime: "00:38:45",
            isActive: false,
            data: [
                { label: "Общая сумма", value: "28 500 тг" },
                { label: "Время смены", value: "00:38:45" },
            ],
        },
    ];
};

const fetchFinesData = async (): Promise<Fine[]> => {
    console.log("Fetching fines data...");
    return [];
};

const fetchMotivationData = async (): Promise<Motivation[]> => {
    console.log("Fetching motivation data...");
    return [];
};

const fetchQuestsData = async (date?: string): Promise<QuestEmployees[]> => {
    console.log("Fetching quests data for date:", date);

    // Mock quest data
    return [
        {
            id: "1",
            title: "Продажи десертов",
            description: "Продать 10 десертов за смену",
            reward: 5000,
            target: 10,
            unit: "десертов",
            totalEmployees: 4,
            completedEmployees: 3,
            employeeNames: ["Аслан Аманов", "Аида Таманова", "Арман Ашимов"],
            date:
                date ||
                new Date().toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
        },
        {
            id: "2",
            title: "Обслуживание столов",
            description: "Обслужить 25 столов качественно",
            reward: 8000,
            target: 25,
            unit: "столов",
            totalEmployees: 4,
            completedEmployees: 1,
            employeeNames: ["Аслан Аманов"],
            date:
                date ||
                new Date().toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
        },
        {
            id: "3",
            title: "Продажи напитков",
            description: "Продать 30 алкогольных напитков",
            reward: 12000,
            target: 30,
            unit: "напитков",
            totalEmployees: 4,
            completedEmployees: 4,
            employeeNames: [
                "Аслан Аманов",
                "Аида Таманова",
                "Арман Ашимов",
                "Тима Янь",
            ],
            date:
                date ||
                new Date().toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
        },
        {
            id: "4",
            title: "Время обслуживания",
            description: "Подавать заказы в течение 15 минут",
            reward: 7000,
            target: 20,
            unit: "заказов",
            totalEmployees: 4,
            completedEmployees: 0,
            employeeNames: [],
            date:
                date ||
                new Date().toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }),
        },
    ];
};

export const CeoProvider = ({ children }: { children: ReactNode }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [fines, setFines] = useState<Fine[]>([]);
    const [motivation, setMotivation] = useState<Motivation[]>([]);
    const [quests, setQuests] = useState<QuestEmployees[]>([]);

    const [shiftData, setShiftData] = useState<ShiftData>({
        openEmployees: 0,
        totalAmount: 0,
        finesCount: 0,
        motivationCount: 0,
        questsCount: 0,
        elapsedTime: "00:00:00",
        selectedDate: new Date().toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllCeoData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data in parallel
            const [employeesData, finesData, motivationData, questsData] =
                await Promise.all([
                    fetchEmployeesData(),
                    fetchFinesData(),
                    fetchMotivationData(),
                    fetchQuestsData(shiftData.selectedDate),
                ]);

            setEmployees(employeesData);
            setFines(finesData);
            setMotivation(motivationData);
            setQuests(questsData);

            // Update shift data based on fetched data
            const activeEmployees = employeesData.filter((emp) => emp.isActive);
            const totalAmount = activeEmployees.reduce((sum, emp) => {
                const amount = parseInt(emp.totalAmount.replace(/[^\d]/g, ""));
                return sum + amount;
            }, 0);

            setShiftData((prev) => ({
                ...prev,
                openEmployees: activeEmployees.length,
                totalAmount,
                finesCount: finesData.length,
                motivationCount: motivationData.length,
                questsCount: questsData.length,
            }));
        } catch (err) {
            console.error("Error fetching CEO data:", err);
            setError("Не удалось загрузить данные");
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestsForDate = async (
        date: string,
    ): Promise<QuestEmployees[]> => {
        try {
            const questsData = await fetchQuestsData(date);
            setQuests(questsData);
            setShiftData((prev) => ({
                ...prev,
                questsCount: questsData.length,
            }));
            return questsData;
        } catch (error) {
            console.error("Error fetching quests for date:", error);
            return [];
        }
    };

    // Update elapsed time
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const seconds = now.getSeconds().toString().padStart(2, "0");
            setShiftData((prev) => ({
                ...prev,
                elapsedTime: `${hours}:${minutes}:${seconds}`,
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch data on mount
    useEffect(() => {
        fetchAllCeoData();
    }, []);

    const updateShiftData = (data: Partial<ShiftData>) => {
        setShiftData((prev) => ({ ...prev, ...data }));
    };

    const addEmployee = (employee: Employee) => {
        setEmployees((prev) => [...prev, employee]);
    };

    const updateEmployee = (id: string, employeeUpdate: Partial<Employee>) => {
        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === id ? { ...emp, ...employeeUpdate } : emp,
            ),
        );
    };

    const addFine = (fine: Omit<Fine, "id">) => {
        const newFine = { ...fine, id: Date.now().toString() };
        setFines((prev) => [...prev, newFine]);
        setShiftData((prev) => ({ ...prev, finesCount: prev.finesCount + 1 }));
    };

    const addMotivation = (motivationItem: Omit<Motivation, "id">) => {
        const newMotivation = { ...motivationItem, id: Date.now().toString() };
        setMotivation((prev) => [...prev, newMotivation]);
        setShiftData((prev) => ({
            ...prev,
            motivationCount: prev.motivationCount + 1,
        }));
    };

    const addQuest = (questItem: Omit<QuestEmployees, "id">) => {
        const newQuest = { ...questItem, id: Date.now().toString() };
        setQuests((prev) => [...prev, newQuest]);
        setShiftData((prev) => ({
            ...prev,
            questsCount: prev.questsCount + 1,
        }));
    };

    const getQuestById = (id: string): QuestEmployees | undefined => {
        return quests.find((quest) => quest.id === id);
    };

    const refetch = async () => {
        await fetchAllCeoData();
    };

    return (
        <CeoContext.Provider
            value={{
                shiftData,
                employees,
                fines,
                motivation,
                quests,
                loading,
                error,
                updateShiftData,
                addEmployee,
                updateEmployee,
                addFine,
                addMotivation,
                addQuest,
                refetch,
                fetchQuestsForDate,
                getQuestById,
            }}
        >
            {children}
        </CeoContext.Provider>
    );
};

export default function CeoLayout() {
    return (
        <CeoProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#242424",
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Смена",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons
                                name="refresh-circle"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="analytics"
                    options={{
                        title: "Аналитика",
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign
                                name="line-chart"
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Профиль",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen name="penalties/index" options={{ href: null }} />
                <Tabs.Screen name="motivation/index" options={{ href: null }} />
                <Tabs.Screen name="motivation/[id]" options={{ href: null }} />
            </Tabs>
        </CeoProvider>
    );
}
