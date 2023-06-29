import { config } from 'dotenv';
import { Telegraf } from 'telegraf';

export class Bot {
  constructor() {
    config();
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.chatId = process.env.CHAT_ID;
    this.user_id = null; // Store the user_id outside the handler
  }

  start() {
    // Start command handler
    this.bot.start((ctx) => {
      const { first_name } = ctx.from;
      const greetMessage = `Привет, ${first_name}! Тестовая версия бота МАРАА приветствует тебя. Список доступных команд вы найдёте в меню бота рядом полем для ввода сообщений.`;
      ctx.reply(greetMessage);
      ctx.telegram.sendMessage(this.chatId, `${first_name} подключился к боту.`);
    });

    // Listen for the user's reply
    this.bot.on('message', async (ctx) => {
      try {
        const message = ctx.message;
        
        if (message.chat.type === 'private') {
          try {
            await ctx.telegram.sendMessage(this.chatId, `Cообщение от ${ctx.from.first_name}: ${message.text}`);
            this.user_id = ctx.message.from.id; // Store the user_id
          } catch (error) {
            console.error('An error occurred while sending the message:', error);
            await ctx.reply('Произошла ошибка при отправке. Пожалуйста, посылайте только текстовые сообщения.');
          }
        }

        // If replied to a message - copy the message and send it back to the bot
        if (ctx.message.reply_to_message) {
          await ctx.telegram.copyMessage(
            this.user_id, // Use the stored user_id
            this.chatId,
            message.message_id,
          );

          // Add the reply button below the copied message
          await ctx.telegram.sendMessage(
            this.chatId,
            'Сообщение отправлено.',
          );
        }
      } catch (error) {
        console.error('An error occurred:', error);
        await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
      }
    });

    // Help command handler
    this.bot.help((ctx) => {
      ctx.reply('Тут будет инструкция по использованию бота и его описание');
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
