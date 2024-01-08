import { config } from "dotenv";
import { data } from "../data/data.js";

export class BotConfig {
  static configure(configType) {
    config();
    switch (configType) {
      case "dev":
        return {
          port: process.env.PORT || 5001,
          botToken: process.env.DEV_BOT_TOKEN,
          chatId: process.env.DEV_CHAT_ID,
        };
      case "prod":
        return {
          port: process.env.PORT || 5001, 
          botToken: process.env.BOT_TOKEN,
          chatId: process.env.CHAT_ID,
          appUrl: process.env.APP_URL
        };
      default:
        throw new Error(data.invalidConfig);
    }
  }
}