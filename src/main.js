import { Telegraf } from 'telegraf';
import { config } from 'dotenv';

config();

const bot = new Telegraf(process.env.BOT_TOKEN);


export const start = () => {
  // Start command handler
  bot.start((ctx) => {
    const { first_name } = ctx.from;
    const commands = [
      '/start - Запуск бота',
      '/help - Помощь',
      '/sendmessage - Послать сообщение',

    ]
    const commandList = commands.join('\n');
    ctx.reply(`Привет, ${first_name}! Тестовая версия бота МАРАА приветствует тебя.\n Доступные команды:\n ${commandList}`);
  });

  // Send message comand send message to the chat
  bot.command('sendmessage', async (ctx) => {
    const chatId = process.env.CHAT_ID;
  
    // Prompt the user for their message
    await ctx.reply('Введите сообщение, которое вы хотите отправить:');
  
    // Listen for the user's reply
    bot.on('message', async (ctx) => {
      if (ctx.chat.type === 'private') {
        const message = ctx.message;
        bot.telegram.sendMessage(chatId, message.text);
        await ctx.reply('Сообщение послано в чат.');
      };
      // If replied to messsage - copy message and send back to bot
      if (ctx.message.reply_to_message) {
        const user_id = ctx.message.from.id;

        await ctx.telegram
        .copyMessage(
          user_id,
          ctx.message.chat.id,
          ctx.message.message_id
        );
        await ctx.reply('Сообщение послано юзеру.');
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


