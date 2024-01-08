import { Telegraf } from "telegraf";
import { BotConfig } from "./config/botConfig.js";
import { data } from "./data/data.js";
import { MessageHandler } from "./handlers/index.js";
import { Launcher } from "./launcher/launcher.js";


export class Bot {
  constructor() {
    const { port, botToken, chatId, appUrl } = BotConfig.configure("prod");
    this.port = port;
    this.bot = new Telegraf(botToken);
    this.chatId = chatId;
    this.appUrl = appUrl;
  }

  static userId = "";

  start() {

    const launcher = new Launcher(this.bot, this.port, this.appUrl);
    // Start command handler
    this.bot.start((ctx) => {
      ctx.reply(data.initialMessage);
    });

    // Listen for the user's messages
    this.bot.on("message", async (ctx) => {
      const messageHandler = new MessageHandler(ctx, data, this.chatId);
      const message = ctx.message;
      try {
        if (message.text) {
          if (message.chat.type === "private") {
            Bot.userId = ctx.message.from.id;
            messageHandler.HandlePrivateMessage();
          } else
          if (message.reply_to_message) {
            messageHandler.HandleReplyMessage(Bot.userId);
          };
        } else {
          ctx.reply(data.errorMessageType);
        }
      } catch (error) {
        console.error(data.eternalError, error);
      }
    });

    launcher.launch("prod");
  }
}
