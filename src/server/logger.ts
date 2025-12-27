// logger.ts
import TelegramLogger from "./tgLogger";
import Constants from "expo-constants";

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } =
    Constants.expoConfig?.extra || {};

export const logger = new TelegramLogger({
    botToken: TELEGRAM_BOT_TOKEN || "",
    chatId: TELEGRAM_CHAT_ID || "",
    // Enable only if both token and chatId are provided
    enabled: !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID),
    appName: "GCApp",
});

// Export for use throughout the app
export default logger;
