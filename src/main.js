import { Telegraf } from 'telegraf';
import { config } from 'dotenv';

config();

const bot = new Telegraf(process.env.BOT_TOKEN);

export const start = () => {
  // Start command handler
  bot.start((ctx) => {
    const { first_name } = ctx.from;
    ctx.reply(`Привет, ${first_name}! Тестовая версия бота МАРАА приветствует тебя.`);
    
  });

  bot.command('sendmessage', (ctx) => {
    const chatId = process.env.CHAT_ID
    const messageText = 'Послано в чат из бота.';
    ctx.telegram.sendMessage(chatId, messageText);
  })

  // Help command handler
  bot.help((ctx) => {
    ctx.reply('Это тестовая версия. Можешь выбрать команды /start или /help.');
  });

  // Custom command handler
  bot.command('custom', (ctx) => {
    ctx.reply('Упс, ты нажал /custom. Эта команда в разработке.');
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


