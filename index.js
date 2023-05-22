import { Telegraf } from 'telegraf';

// Replace 'YOUR_BOT_TOKEN' with your actual bot token obtained from BotFather
const bot = new Telegraf('6121860486:AAGB5YSEjba1BUDfQLr0YdZTOBI2tL5ZthU');

// Start command handler
bot.start((ctx) => {
  const { first_name } = ctx.from;
  ctx.reply(`Привет, ${first_name}! Тестовая версия бота МАРАА приветствует тебя.`);
});

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

