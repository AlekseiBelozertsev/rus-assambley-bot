import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { errorMessage, initialMessage, sendMessage } from './text.js';

export class Bot {
  constructor() {
    config();
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.chatId = process.env.CHAT_ID;
    this.user_id = null;
  }

  start() {
    // Start command handler
    this.bot.start((ctx) => {
      ctx.reply(initialMessage);
    });

    //notifies when new user started chating with the bot
    this.bot.on('new_chat_members', async (ctx) => {
      const user = ctx.message.new_chat_members[0];
      const chatId = this.chatId;
      const notificationMessage = `${user.first_name} подключился к боту.`;
      ctx.telegram.sendMessage(chatId, notificationMessage);
    })

    // Listen for the user's reply
    this.bot.on('message', async (ctx) => {
      try {
        const message = ctx.message;
        if (message.text) {
          if (message.chat.type === 'private') {
            try {
              await ctx.telegram.sendMessage(this.chatId, `Cообщение от ${ctx.from.first_name}: ${message.text}`);
              this.user_id = ctx.message.from.id; // Store the user_id
              await ctx.reply(sendMessage);
            } catch (error) {
              console.error('An error occurred while sending the message:', error);
              await ctx.reply(errorMessage);
            }
          }
          // If replied to a message - copy the message and send it back to the bot and then notifies the chat member, that the message has been sent
          if (ctx.message.reply_to_message) {
            await ctx.telegram.copyMessage(
              this.user_id, // Use the stored user_id
              this.chatId,
              message.message_id,
            );
            await ctx.telegram.sendMessage(
              this.chatId,
              sendMessage,
            );
          }
        } else {
          ctx.reply(errorMessage);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    });

    // Start the bot
    this.bot.launch()
      .then(() => {
        console.log('Bot is running');
      })
      .catch((error) => {
        console.error('Error starting bot', error);
      });
  }
}
