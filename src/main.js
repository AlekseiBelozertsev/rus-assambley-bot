import { Telegraf, Markup } from 'telegraf';
import { config } from 'dotenv';

config();

const bot = new Telegraf(process.env.BOT_TOKEN);


export const start = () => {
  // Start command handler
  bot.start((ctx) => {
    const { first_name } = ctx.from;
    const greetMessage = `Привет, ${first_name}! Тестовая версия бота МАРАА приветствует тебя. Список доступных комманд вы найдёте в меню бота рядом полем для ввода сообщений.`;
    ctx.reply(greetMessage);
  });

// Send message command to send a message to the chat
bot.command('sendmessage', async (ctx) => {
  const chatId = process.env.CHAT_ID;
  const replyButton = Markup.inlineKeyboard([
    Markup.button.url('Ответить', `callback_data`)
  ]);

  // Prompt the user for their message
  await ctx.reply('Введите сообщение, которое вы хотите отправить:');

  // Listen for the user's reply
  bot.on('message', async (ctx) => {
    try {
      if (ctx.chat.type === 'private') {
        const message = ctx.message;
        try {
          await bot.telegram.sendMessage(chatId, message.text);
          await ctx.reply('Сообщение отправлено.');
        } catch (error) {
          console.error('An error occurred while sending the message:', error);
          await ctx.reply('Произошла ошибка при отправке. Пожалуйста, посылайте только сообщения.');
        }
      }
      // If replied to a message - copy the message and send it back to the bot
      if (ctx.message.reply_to_message) {
        const user_id = ctx.message.from.id;

        await ctx.telegram.copyMessage(
          user_id,
          ctx.message.chat.id,
          ctx.message.message_id
        );

        // Add the reply button below the copied message
        const copiedMessageId = ctx.message.reply_to_message.message_id;
        await ctx.telegram.sendMessage(
          chatId,
          'Сообщение отправлено.',
          { reply_to_message_id: copiedMessageId, reply_markup: replyButton }
        );
      }
    } catch (error) {
      console.error('An error occurred:', error);
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
    }
  });
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


