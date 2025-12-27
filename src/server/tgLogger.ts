import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

interface TelegramLoggerConfig {
    botToken: string;
    chatId: string;
    enabled?: boolean;
    appName?: string;
}

class TelegramLogger {
    private botToken: string;
    private chatId: string;
    private enabled: boolean;
    private appName: string;
    private apiUrl: string;

    constructor(config: TelegramLoggerConfig) {
        this.botToken = config.botToken;
        this.chatId = config.chatId;
        this.enabled = config.enabled ?? true;
        this.appName = config.appName || "GCApp";
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    }

    private async sendMessage(text: string): Promise<void> {
        if (!this.enabled) return;

        try {
            await axios.post(
                this.apiUrl,
                {
                    chat_id: this.chatId,
                    text,
                    parse_mode: "HTML",
                },
                {
                    timeout: 5000,
                },
            );
        } catch (error) {
            // Silently fail - we don't want logging errors to crash the app
            console.error("Failed to send Telegram log:", error);
        }
    }

    private formatError(error: any, context?: string): string {
        const timestamp = new Date().toISOString();
        const platform = Platform.OS;
        const version = Constants.expoConfig?.version || "unknown";

        let errorMessage = "";
        let errorStack = "";

        if (error instanceof Error) {
            errorMessage = error.message;
            errorStack = error.stack || "";
        } else if (typeof error === "string") {
            errorMessage = error;
        } else {
            errorMessage = JSON.stringify(error);
        }

        return `
🚨 <b>${this.appName} Error</b>

📱 <b>Platform:</b> ${platform}
📦 <b>Version:</b> ${version}
🕐 <b>Time:</b> ${timestamp}
${context ? `📍 <b>Context:</b> ${context}\n` : ""}
❌ <b>Error:</b> ${errorMessage}

<code>${errorStack.substring(0, 500)}</code>
    `.trim();
    }

    private formatInfo(message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const platform = Platform.OS;

        let dataText = "";
        if (data) {
            dataText =
                typeof data === "string"
                    ? data
                    : JSON.stringify(data, null, 2).substring(0, 500);
        }

        return `
ℹ️ <b>${this.appName} Info</b>

📱 <b>Platform:</b> ${platform}
🕐 <b>Time:</b> ${timestamp}
💬 <b>Message:</b> ${message}
${dataText ? `\n<code>${dataText}</code>` : ""}
    `.trim();
    }

    // Log errors
    async logError(error: any, context?: string): Promise<void> {
        const message = this.formatError(error, context);
        await this.sendMessage(message);
    }

    // Log info messages
    async logInfo(message: string, data?: any): Promise<void> {
        const formattedMessage = this.formatInfo(message, data);
        await this.sendMessage(formattedMessage);
    }

    // Log network errors specifically
    async logNetworkError(
        error: any,
        url: string,
        method: string = "GET",
    ): Promise<void> {
        const timestamp = new Date().toISOString();
        const platform = Platform.OS;

        const message = `
🌐 <b>${this.appName} Network Error</b>

📱 <b>Platform:</b> ${platform}
🕐 <b>Time:</b> ${timestamp}
🔗 <b>URL:</b> ${url}
📤 <b>Method:</b> ${method}
❌ <b>Error:</b> ${error.message || error}

${error.response ? `<b>Status:</b> ${error.response.status}\n<b>Data:</b> <code>${JSON.stringify(error.response.data).substring(0, 300)}</code>` : ""}
    `.trim();

        await this.sendMessage(message);
    }

    // Enable/disable logging
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }
}

export default TelegramLogger;
