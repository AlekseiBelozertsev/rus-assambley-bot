import { config } from 'dotenv';
import { Telegraf } from 'telegraf';

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
      const { first_name } = ctx.from;
      const greetMessage = `Привет! Этот чат-бот создан для быстрой обратной связи с русскоговорящими анонимными алкоголиками по всему миру.

Мы поможем Вам:
- Найти ближайшую к Вам группу на русском языке.
- Найти ближайшего от Вас анонимного алкоголика, готового Вам помочь.
- Помочь найти наставника, который поделится опытом выздоровления от алкоголизма с помощью программы АА.
- Ответить на ваши вопросы по социализации после реабилитации.
- Связать Вас с АА в Вашей стране проживания.

С любовью и поддержкой,
Международная Ассамблея Русскоязычных Анонимных Алкоголиков.`;

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

        // If replied to a message - copy the message and send it back to the bot and then notifies the chat member, that the message has been sent
        if (ctx.message.reply_to_message) {
          await ctx.telegram.copyMessage(
            this.user_id, // Use the stored user_id
            this.chatId,
            message.message_id,
          );
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
      ctx.reply('Этот чат-бот создан для быстрой обратной связи с русскоговорящими анонимными алкоголиками по всему миру. Для отправки сообщения вам достаточно один раз нажать команду "start" и начать писать в поле ввода сообщений. Когда оператор поддержки ответит на ваше сообщение, вы получите его прямо в боте.');
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
