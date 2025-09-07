import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isMobile = Platform.OS === "ios" || Platform.OS === "android";

export const storage = {
    async setItem(key: string, value: string) {
        if (isMobile) {
            await SecureStore.setItemAsync(key, value);
        } else {
            localStorage.setItem(key, value);
        }
    },
    async getItem(key: string) {
        if (isMobile) {
            return await SecureStore.getItemAsync(key);
        } else {
            return localStorage.getItem(key);
        }
    },
    async removeItem(key: string) {
        if (isMobile) {
            await SecureStore.deleteItemAsync(key);
        } else {
            localStorage.removeItem(key);
        }
    },
};
