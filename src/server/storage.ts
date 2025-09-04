import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const isMobile = Platform.OS === "ios" || Platform.OS === "android";

export const storage = {
    async setItem(key: string, value: string) {
        if (isMobile) {
            await AsyncStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, value);
        }
    },
    async getItem(key: string) {
        if (isMobile) {
            return await AsyncStorage.getItem(key);
        } else {
            return localStorage.getItem(key);
        }
    },
    async removeItem(key: string) {
        if (isMobile) {
            await AsyncStorage.removeItem(key);
        } else {
            localStorage.removeItem(key);
        }
    },
};
