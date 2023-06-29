import { Telegraf, Markup } from 'telegraf';
import { config } from 'dotenv';

config();

const bot = new Telegraf(process.env.BOT_TOKEN);
import { config } from 'dotenv';





export const start = (chatId) => {
  const chatId = process.env.CHAT_ID;
  const user_id_array = [];
  // Start command handler
  bot.start((ctx) => {
    const { first_name } = ctx.from;
    const greetMessage = `Привет, ${first_name}! Тестовая версия бота МАРАА приветствует тебя. Список доступных команд вы найдёте в меню бота рядом полем для ввода сообщений.`;
    ctx.reply(greetMessage);
    ctx.telegram.sendMessage(process.env.CHAT_ID, `${first_name} подключился к боту.`)
  });

  // Listen for the user's reply
  bot.on('message', async (ctx) => {
    try {
      const message = ctx.message;
      const user_id = ctx.message.from.id;
      
      if (message.chat.type === 'private') {
        try {
          await bot.telegram.sendMessage(chatId, message.text);
          user_id_array.push(user_id);
        } catch (error) {
          console.error('An error occurred while sending the message:', error);
          await ctx.reply('Произошла ошибка при отправке. Пожалуйста, посылайте только текстовые сообщения.');
        }
      }

      // If replied to a message - copy the message and send it back to the bot
      if (ctx.message.reply_to_message) {
        console.log(user_id_array);
        const user_to_reply = user_id_array.pop();
        await ctx.telegram.copyMessage(
          user_to_reply,
          chatId,
          message.message_id,
        );

        // Add the reply button below the copied message
        await ctx.telegram.sendMessage(
          chatId,
          'Сообщение отправлено.',
        );
      };
    } catch (error) {
      console.error('An error occurred:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
    }
  });

  // Help command handler
  bot.help((ctx) => {
    ctx.reply('Тут будет инструкция по использованию бота и его описание');
  });

  // Start the bot
  bot.launch()
    .then(() => {
      console.log('Bot is running');
    })
    .catch((error) => {
      console.error('Error starting bot', error);
    });
}




